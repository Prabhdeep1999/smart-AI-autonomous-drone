# my opencv is not built with gstreamer

import cv2
import numpy as np

def receive():
	cap = cv2.VideoCapture('udpsrc port=5000 caps = "application/x-rtp, media=(string)video, clock-rate=(int)90000, encoding-name=(string)H264, payload=(int)96" ! rtph264depay ! decodebin ! videoconvert ! appsink', cv2.CAP_GSTREAMER)
	print(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
	print(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
	while True:
		ret,frame = cap.read()
		if not ret:
			print('Empty Frame')
			continue 
		cv2.imshow('Frame from PiCamera', frame)
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break
	cap.release()

receive();