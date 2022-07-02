#Working!!!
import cv2
import time
# os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;udp"
vcap = cv2.VideoCapture("http://username:password\"username@IPADDRESS:8000/stream.mjpg", cv2.CAP_FFMPEG)
while(1):
    start = time.time()
    ret, frame = vcap.read()
    if ret == False:
        print("Frame is empty")
        break
    else:
        cv2.imshow('VIDEO', frame)
        cv2.waitKey(1)
    print("Frame rate: {}".format(1.0/(time.time()-start)))