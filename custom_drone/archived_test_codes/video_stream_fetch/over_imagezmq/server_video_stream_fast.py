 # run this program on the Mac to display image streams from multiple RPis
import cv2
import imagezmq
import time

image_hub = imagezmq.ImageHub()
while True:  # show streamed images until Ctrl-C
    start = time.time()
    rpi_name, image = image_hub.recv_image()
    cv2.imshow(rpi_name, image) # 1 window for each RPi
    cv2.waitKey(1)
    image_hub.send_reply(b'OK')
    print("Frame Rate: ", (1/(time.time()-start)), "image size: ", image.shape[:2])
    