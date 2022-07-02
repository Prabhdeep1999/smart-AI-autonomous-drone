import os
import cv2

# threading code for opening node in a different cmd
def start_node():
    os.system('cmd /c "node tello/Tello_API/newApp.js"')
    print('[INFO] Node Started')

def rescale_frame(frame, percent=50):
    width = int(frame.shape[1] * percent/ 100)
    height = int(frame.shape[0] * percent/ 100)
    dim = (width, height)
    return cv2.resize(frame, dim, interpolation = cv2.INTER_AREA)