#!/usr/bin/env python
# -*- coding: utf-8 -*-


from __future__ import print_function

from dronekit import connect, VehicleMode, LocationGlobalRelative, LocationGlobal, Command
import time
import math
from pymavlink import mavutil

import argparse  
parser = argparse.ArgumentParser()
parser.add_argument('--connect', default='tcp:0.0.0.0:5763')
args = parser.parse_args()

connection_string = args.connect
sitl = None


# Connect to the Vehicle
print('Connecting to vehicle on: %s' % connection_string)
vehicle = connect(connection_string, wait_ready=True)


def get_location_metres(original_location, dNorth, dEast):
    
    earth_radius=6378137.0 
    dLat = dNorth/earth_radius
    dLon = dEast/(earth_radius*math.cos(math.pi*original_location.lat/180))

    newlat = original_location.lat + (dLat * 180/math.pi)
    newlon = original_location.lon + (dLon * 180/math.pi)
    return LocationGlobal(newlat, newlon,original_location.alt)


def get_distance_metres(aLocation1, aLocation2):
    
    dlat = aLocation2.lat - aLocation1.lat
    dlong = aLocation2.lon - aLocation1.lon
    return math.sqrt((dlat*dlat) + (dlong*dlong)) * 1.113195e5



def distance_to_current_waypoint():
    
    nextwaypoint = vehicle.commands.next
    if nextwaypoint==0:
        return None
    missionitem=vehicle.commands[nextwaypoint-1] #commands are zero indexed
    lat = missionitem.x
    lon = missionitem.y
    alt = missionitem.z
    targetWaypointLocation = LocationGlobalRelative(lat,lon,alt)
    distancetopoint = get_distance_metres(vehicle.location.global_frame, targetWaypointLocation)
    return distancetopoint


def download_mission():
    
    cmds = vehicle.commands
    cmds.download()
    cmds.wait_ready()

def generate(l,b,dist):
    waypoints = list()
    waypoints.append([0, 0])
    no_of_turns = ((l//dist) + (b//dist))
    c = 0
    revolutions = 0
    l_sect = l // dist
    b_sect = b//dist
    for i in range(no_of_turns):
        if(c == 0):
            c += 1
            waypoints.append([l - ((l_sect -  revolutions) * dist), b - (revolutions * dist)])
        elif(c == 1):
            c += 1
            waypoints.append([l - (revolutions * dist), b - (revolutions * dist)])
        elif(c == 2):
            c += 1
            waypoints.append([l - (revolutions * dist), b - ((l_sect -  revolutions) * dist)])
        elif(c == 3):
            c = 0
            waypoints.append([l - ((l_sect -  revolutions) * dist) + dist, b - ((l_sect -  revolutions) * dist) + dist])
            revolutions += 1

    return waypoints

def generatez(l,b,dist):
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

def adds_square_mission(cur_location, waypoints):
    
    cmds = vehicle.commands
    print(" Clear any existing commands")
    cmds.clear() 
    print(" Define/add new commands.")
    cmds.add(Command( 0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, 0, 0, 0, 0, 10))
    for i in range(1,len(waypoints)):
        a,b = waypoints[i]
        print(a,b)
        point = get_location_metres(cur_location, a, b)
        print(point)
        cmds.add(Command( 0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0, 0, 0, 0, 0, point.lat, point.lon, 10))
    cmds.add(Command( 0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0, 0, 0, 0, 0, point.lat, point.lon, 10))
    print(" Upload new commands to vehicle")
    cmds.upload()


def arm_and_takeoff(aTargetAltitude):

    print("Basic pre-arm checks")
    # Don't let the user try to arm until autopilot is ready
    while not vehicle.is_armable:
        print(" Waiting for vehicle to initialise...")
        time.sleep(1)

        
    print("Arming motors")
    # Copter should arm in GUIDED mode
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True
    while not vehicle.armed:      
        print(" Waiting for arming...")
        time.sleep(1)

    print("Taking off!")
    vehicle.simple_takeoff(aTargetAltitude) 

    while True:
        print(" Altitude: ", vehicle.location.global_relative_frame.alt)      
        if vehicle.location.global_relative_frame.alt>=aTargetAltitude*0.95: #Trigger just below target alt.
            print("Reached target altitude")
            break
        time.sleep(1)

        


if __name__ == '__main__':
    print("Enter l,b")
    l, b , dist= [int(x) for x in input().split()]
    waypoints = generatez(l,b,dist)

    #############################################
    #Set parameters safety part
    vehicle.parameters['WPNAV_SPEED'] = 400
    vehicle.parameters['FENCE_ALT_MAX'] = 15
    if vehicle.battery.level <= 20 :
        vehicle.mode = VehicleMode("RTL")
    
    #############################################
    
    print('Create a new mission (for current location)')
    adds_square_mission(vehicle.location.global_frame,waypoints)
    arm_and_takeoff(10)

    print("Starting mission")
    vehicle.commands.next=0
    vehicle.mode = VehicleMode("AUTO")

    print(len(waypoints))
    while True:
        nextwaypoint=vehicle.commands.next
        print('Distance to waypoint (%s): %s' % (nextwaypoint, distance_to_current_waypoint()))
        if nextwaypoint==len(waypoints): 
            print("Exit 'standard' mission when start heading to final waypoint %s",len(waypoints)-1)
            break
        time.sleep(1)

    print('Return to launch')
    vehicle.mode = VehicleMode("RTL")


    #Close vehicle object before exiting script
    print("Close vehicle object")
    vehicle.close()