import matplotlib.pyplot as plt
from math import sqrt

dist = 50

def generate(l,b):
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
            # waypoints.append([l - (revolutions * dist), b - ((l_sect -  revolutions) * dist) + dist])
            waypoints.append([l - (revolutions * dist), b - ((l_sect -  revolutions) * dist)])
        elif(c == 3):
            c = 0
            waypoints.append([l - ((l_sect -  revolutions) * dist) + dist, b - ((l_sect -  revolutions) * dist) + dist])
            revolutions += 1

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