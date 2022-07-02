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
    print(ret, len(ret))