import matplotlib.pyplot as plt
from math import sqrt

dist = 50

def generate(l,b):
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

if __name__ == '__main__':
    l, b = [int(x) for x in input().split()]
    ret = generate(l,b)
    x = list()
    y = list()
    total_len = 0
    for i in ret:
        x.append(i[1])
        y.append(i[0])
    for i in range(len(x) - 1):
        total_len += int(sqrt((abs(x[i] - x[i - 1])**2) + (abs(y[i] - y[i - 1])**2)))
    plt.plot(x, y)
    plt.xlabel("X-axis")
    plt.ylabel("Y-axis")
    plt.title("Path of drone")
    plt.show()
    print('waypoints are: ' +  str(ret) + "\nNo. of waypoints are: " + str(len(ret)) + "\nTotal distance to cover is: " + str(total_len) + " meters")