import numpy as np
import cv2
import time
import os
import threading
import requests

# local imports
from utils import (
    Tracker, Command, Capture, start_node, rescale_frame
)

mutex = 0 
debug = True
UDP = 'udp://192.138.10.1:11111'

# Creating a thread    
node_thread = threading.Thread(target = start_node) 
node_thread.deamon = True
node_thread.start()

# load the COCO class labels our YOLO model was trained on
labelsPath = "tello/req_files/coco.names"
LABELS = open(labelsPath).read().strip().split("\n")


# initialize a list of colors to represent each possible class label
np.random.seed(42)
COLORS = np.random.randint(0, 255, size=(len(LABELS), 3), dtype="uint8")


# derive the paths to the YOLO weights and model configuration
weightsPath = "tello/req_files/yolov3.weights"
if not os.path.exists(weightsPath):
    print(f"[INFO] Weights not found in the following path: {weightsPath}, Downloading now ...")
    os.system('cmd /c "curl -o tello/req_files/yolov3.weights https://pjreddie.com/media/files/yolov3.weights')
configPath = "tello/req_files/yolov3.cfg"


# load our YOLO object detector trained on COCO dataset (80 classes)
print("[INFO] loading YOLO from disk...")
net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)
ln = net.getLayerNames()
ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]


if not debug:
    isStreamOn = requests.get("http://localhost:4000/test/streamon")
    print(isStreamOn.text)
    time.sleep(2)
    udp = UDP
    capture = Capture(udp)
    command = Command()
    print("[INFO] Starting video from Tello")
else:
    capture = Capture(0)
    command = Command(debug=True)
    print("[INFO] Starting video from webcam")


if not debug:
    isTakeoff = requests.get('http://localhost:4000/test/takeoff')
    print(isTakeoff.status_code)


#creating object of class Tracker
tracker = Tracker(720/2, 960/2)
capture.startCaptureThread()
countOfFrames = 0

while True:
    frame = capture.read()
    
    if mutex == 0 and not debug:
        command.startCmdThread()
        mutex = 1

    H = 720/2 
    W = 960/2
    frame = rescale_frame(frame, percent = 50)
    
    # Our operations on the frame come here
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
	# construct a blob from the input frame and then perform a forward
	# pass of the YOLO object detector, giving us our bounding boxes
	# and associated probabilities
    blob = cv2.dnn.blobFromImage(rgb, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    start = time.time()
    layerOutputs = net.forward(ln)
    end = time.time()

	# initialize our lists of detected bounding boxes, confidences,
	# and class IDs, respectively
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:

		# loop over each of the detections
        for detection in output:

			# extract the class ID and confidence (i.e., probability)
			# of the current object detection
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]

			# filter out weak predictions by ensuring the detected
			# probability is greater than the minimum probability
            if confidence > 0.5:

				# scale the bounding box coordinates back relative to
				# the size of the image, keeping in mind that YOLO
				# actually returns the center (x, y)-coordinates of
				# the bounding box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")
                
				# use the center (x, y)-coordinates to derive the top
				# and and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))

				# update our list of bounding box coordinates,
				# confidences, and class IDs
                boxes.append([x, y, int(width), int(height)])
                confidences.append(float(confidence))
                classIDs.append(classID)
                
	# apply non-maxima suppression to suppress weak, overlapping bounding boxes
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.6)

	# ensure at least one detection exists
    if len(idxs) > 0:

		# loop over the indexes we are keeping
        for i in idxs.flatten():

			# extract the bounding box coordinates
            (x, y) = (boxes[i][0], boxes[i][1])
            (w, h) = (boxes[i][2], boxes[i][3])
            
			# draw a bounding box rectangle and label on the frame
            color = [int(c) for c in COLORS[classIDs[i]]]
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 1)
            text = "{}: {:.4f}".format(LABELS[classIDs[i]], confidences[i])
            cv2.putText(frame, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            check = text.split(':')
            if check[0] == 'person':
                direction = None
                value = None
                elap = end - start
                
                direction, value = tracker.getDirection(x, y, w, h, elap)
                command.putInQue(direction)
                countOfFrames = 0
                
            else:
                countOfFrames +=1
                if countOfFrames == 4:
                    direction = [0,0,0,20]
                    command.putInQue(direction)
                    countOfFrames = 0
                continue
            
            # Time elapsed
            elap = (end - start)
            print("[INFO] single frame took {:.4f} seconds".format(elap))
            
    cv2.imshow("frame", frame)
            
    if cv2.waitKey(300)  & 0xFF == ord('q'):
            break


print('[INFO] Freeing resources and stopping program')
capture.stopCaptureThread()
capture.release()
command.stopCmdThread()
cv2.destroyAllWindows()
