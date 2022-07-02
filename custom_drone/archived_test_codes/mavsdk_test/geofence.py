import asyncio
from mavsdk import System
from mavsdk.geofence import Point, Polygon
import math as m
"""
This example shows how to use the geofence plugin.
Note: The behavior when your vehicle hits the geofence is NOT configured in this example. 
"""


async def run():

    # Connect to the Simulation
    drone = System()
    await drone.connect(system_address="udp://:14540")

    # Wait for the drone to connect
    print("Waiting for drone...")
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
    waypoints = [[0 - 20, 0 - 20],[l + 20, 0 - 20],[l + 20, b + 20],[0 - 20, b + 20]]
    for i in range(len(waypoints)):
        x,y = waypoints[i]
        new_latitude  = latitude  + (x / 6371000) * (180 / m.pi)
        new_longitude = longitude + ((y / 6371000) * (180 / m.pi)) / m.cos(latitude * m.pi/180)
        if i == 0 :
            p1 = Point(new_latitude, new_longitude)
        if i == 1 :
            p2 = Point(new_latitude, new_longitude)
        if i == 2 :
            p3 = Point(new_latitude, new_longitude)
        if i == 3 :
            p4 = Point(new_latitude, new_longitude)
    # Define your geofence boundary
    # p1 = Point(latitude - 0.001, longitude - 0.001)
    # p2 = Point(latitude + 0.001, longitude - 0.001)
    # p3 = Point(latitude + 0.001, longitude + 0.001)
    # p4 = Point(latitude - 0.001, longitude + 0.001)

    # Create a polygon object using your points
    polygon = Polygon([p1, p2, p3, p4], Polygon.FenceType.INCLUSION)
    #Upload the geofence to your vehicle
    print("Uploading geofence...")
    await drone.geofence.upload_geofence([polygon])

    print("Geofence uploaded!")

    await drone.param.set_param_int("GF_ACTION", 3)
    print("param set")

if __name__ == "__main__":
    l, b = [int(x) for x in input().split()]
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())