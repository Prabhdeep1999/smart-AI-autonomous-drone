# Person Tracking with Tello Drone

This part of the project focuses on building a real-time tracking algorithm able to follow a person in a 3D space.

We used YOLOv3 for person detection and built a tracking algorithm from scratch. Note there are some hard-coded values and other optimizations that could be done on this codebase as this is just a PoC demo version.

We wrote the APIs in Node.js as we found the Python SDK slow. The code is end-to-end multi-threaded for optimum performance.

### Demo of Person Tracking:

<p align="center"><img src="images/README/official_attempt.gif" alt="official_attempt" width="480" height="270"/></p>

#### Requirements:

* Python3.7
* Node.js and npm
* Tello Drone

#### Steps to Run:

1. Turn on your Tello Drone. Make sure your Tello has enough battery.
2. Connect your Tello Drone with your laptop over WiFi. Find out the ipaddress using ipconfig/ifconfig command and enter the same in **UDP** variable in main_track.py {line 15} with port being 11111 only.
3. If you want to try using your webcam to check everything is working fine without testing on drone change the **debug** parameter in main_track.py {line 14} this will test the code on your webcam.
4. Once connected please check if node is installed using **node -v.**
5. If this is your first time initiating the program do following
   1. ```
      cd Tello_API
      ```
   2. ```
      npm install .
      ```
6. Run:
   1. ```
      pip install -r requirements.txt
      ```
   2. ```
      python main.py
      ```

#### Working:

* The program turns on a node shell in background.
* If the correct IP is provided the program starts the stream from Tello Drone via UDP
* It finds person in the frame using [YOLOv3](https://pjreddie.com/darknet/yolo/)
* If person is present (It currently works only for a single person) then it finds it position on the frame.
* Once the position is found it optimizes the trajectory and moves accordingly

PS: The code can be buggy at times please feel free to raise a PR to fix it. Also this was tested on Windows some modifications might be needed for Linux/Mac
