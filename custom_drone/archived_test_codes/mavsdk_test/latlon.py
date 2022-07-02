import asyncio
from mavsdk import System
from mavsdk.geofence import Point, Polygon
from mavsdk.mission import (MissionItem, MissionPlan)
import math as m

# def convert(waypoints):
#     coordinates = list()
#     for i in range(len(waypoints)):
#         new_latitude  = latitude  + (i[0] / 6371000) * (180 / m.pi)
#         new_longitude = longitude + (i[1] / 6371000) * (180 / m.pi) / m.cos(latitude * m.pi/180)
#         coordinates.append([new_latitude,new_longitude])
#     return coordinates

def generate(l,b,dist):
    waypoints = list()
    if b%2 != 0:
        for i in range(b//dist+1):
            if i%2 == 0:
                waypoints.append([0,i*dist])
                waypoints.append([l,i*dist])
            else:
                waypoints.append([l,i*dist])
                waypoints.append([0,i*dist])
        waypoints.append([0,b])
        waypoints.append([l,b])
    else:
        for i in range(b//dist+1):
            if i%2 == 0:
                waypoints.append([0,i*dist])
                waypoints.append([l,i*dist])
            else:
                waypoints.append([l,i*dist])
                waypoints.append([0,i*dist])
    return waypoints


async def run():
    drone = System()
    await drone.connect(system_address="udp://:14540")

    print("Waiting for drone to connect...")
    async for state in drone.core.connection_state():
        if state.is_connected:
            print(f"Drone discovered with UUID: {state.uuid}")
            break
    
    
    # Fetch the home location coordinates, in order to set a boundary around the home location
    print("Fetching home location coordinates...")
    async for terrain_info in drone.telemetry.home():
        latitude = terrain_info.latitude_deg
        longitude = terrain_info.longitude_deg
        break
    
    await asyncio.sleep(1)

    print(latitude,longitude)

    coordinates = list()
    for i in range(len(waypoints)):
        x,y = waypoints[i]
        new_latitude  = latitude  + (x / 6371000) * (180 / m.pi)
        new_longitude = longitude + ((y / 6371000) * (180 / m.pi)) / m.cos(latitude * m.pi/180)
        coordinates.append([new_latitude,new_longitude])

    print(coordinates)

    print_mission_progress_task = asyncio.ensure_future(print_mission_progress(drone))

    running_tasks = [print_mission_progress_task]
    termination_task = asyncio.ensure_future(observe_is_in_air(drone, running_tasks))

    mission_items = []
    for i in range(1,len(coordinates)):
        a,b = coordinates[i]
        print(a,b)
        mission_items.append(MissionItem(a,
                                         b,
                                         10,
                                         3,
                                         True,
                                         float('nan'),
                                         float('nan'),
                                         MissionItem.CameraAction.NONE,
                                         float('nan'),
                                         float('nan')))
    

    mission_plan = MissionPlan(mission_items)

    await drone.mission.set_return_to_launch_after_mission(True)

    print("-- Uploading mission")
    await drone.mission.upload_mission(mission_plan)

    print("-- Arming")
    await drone.action.arm()

    print("-- Starting mission")
    await drone.mission.start_mission()

    await termination_task
    print("Mission accomplished")
    await drone.mission.clear_mission()
    print("Mission removed")

async def print_mission_progress(drone):
    async for mission_progress in drone.mission.mission_progress():
        print(f"Mission progress: "
              f"{mission_progress.current}/"
              f"{mission_progress.total}")


async def observe_is_in_air(drone, running_tasks):
    """ Monitors whether the drone is flying or not and
    returns after landing """

    was_in_air = False

    async for is_in_air in drone.telemetry.in_air():
        if is_in_air:
            was_in_air = is_in_air

        if was_in_air and not is_in_air:
            for task in running_tasks:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
            await asyncio.get_event_loop().shutdown_asyncgens()

            return

if __name__ == "__main__":
    l, b , dist= [int(x) for x in input().split()]
    waypoints = generate(l,b,dist)
    # coordinates = convert(waypoints)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())