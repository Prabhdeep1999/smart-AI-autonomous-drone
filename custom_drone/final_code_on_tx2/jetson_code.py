### Driver Code:
### python3 trt_yolo_mjpeg.py -m yolov4-416 --video http://192.168.1.104:8000/stream.mjpg

"""trt_yolo_mjpeg.py

MJPEG version of trt_yolo.py.
"""

# threading import
import threading_firebase

import os
import time
import argparse
import threading

import cv2

# Jetson and YOLO imports
import pycuda.autoinit  # This is needed for initializing CUDA driver 

from utils.yolo_classes import get_cls_dict
from utils.camera import add_camera_args, Camera
from utils.display import show_fps
from utils.visualization import BBoxVisualization
from utils.mjpeg import MjpegServer

from utils.yolo_with_plugins import TrtYOLO


# vehicle location list
loc = list()
req_args = tuple()
count = 0
th = dict()
# if check[0] == 'person' or check[0] == 'dog' or check[0] == 'cat' or check[0] == 'elephant':

# initializing firebase
threading_firebase.initialize_app()
print('app initialized')

def parse_args():
    """Parse input arguments."""
    desc = 'MJPEG version of trt_yolo'
    parser = argparse.ArgumentParser(description=desc)
    parser = add_camera_args(parser)
    parser.add_argument(
        '-c', '--category_num', type=int, default=80,
        help='number of object categories [80]')
    parser.add_argument(
        '-m', '--model', type=str, required=True,
        help=('[yolov3|yolov3-tiny|yolov3-spp|yolov4|yolov4-tiny]-'
              '[{dimension}], where dimension could be a single '
              'number (e.g. 288, 416, 608) or WxH (e.g. 416x256)'))
    parser.add_argument(
        '-p', '--mjpeg_port', type=int, default=8080,
        help='MJPEG server port [8080]')
    args = parser.parse_args()
    return args

def loop_and_detect(cam, trt_yolo, conf_th, vis, mjpeg_server):
    """Continuously capture images from camera and do object detection.

    # Arguments
      cam: the camera instance (video source).
      trt_yolo: the TRT YOLO object detector instance.
      conf_th: confidence/score threshold for object detection.
      vis: for visualization.
      mjpeg_server
    """
    global loc
    global req_args
    global count
    global th

    fps = 0.0
    tic = time.time()
    while True:
        img = cam.read()
        if img is None:
            break
        boxes, confs, clss = trt_yolo.detect(img, conf_th)
        #img = vis.draw_bboxes(img, boxes, confs, clss)
        #img = show_fps(img, fps)
        #mjpeg_server.send_img(img)
        toc = time.time()
        curr_fps = 1.0 / (toc - tic)
        # calculate an exponentially decaying average of fps number
        fps = curr_fps if fps == 0.0 else (fps*0.95 + curr_fps*0.05)

        #source code change
        #cv2.imshow("img", img)
        #cv2.waitKey(1)
        
        print("Class: ", clss, "FPS: ", fps)
        tic = toc
        if clss == 0.:
            # local path to save the image
            im_path = "output_imgs/{}".format(str(count)+'.jpg')

            # writing image to that path
            img = vis.draw_bboxes(img, boxes, confs, clss)
            cv2.imwrite(im_path, img)
            print('Thread started')

            # fetching location from mission code
            # loc = threading_firebase.mission.get_curr_loc()
            loc = [22,21]   
            req_args = (im_path,'person', loc[0], loc[1])

            th[count] = threading.Thread(target=threading_firebase.thread_fun, daemon=True, args=req_args)
            th[count].start()
            count += 1



def main():
    args = parse_args()
    if args.category_num <= 0:
        raise SystemExit('ERROR: bad category_num (%d)!' % args.category_num)
    if not os.path.isfile('yolo/%s.trt' % args.model):
        raise SystemExit('ERROR: file (yolo/%s.trt) not found!' % args.model)

    cam = Camera(args)
    if not cam.isOpened():
        raise SystemExit('ERROR: failed to open camera!')

    cls_dict = get_cls_dict(args.category_num)
    yolo_dim = args.model.split('-')[-1]
    if 'x' in yolo_dim:
        dim_split = yolo_dim.split('x')
        if len(dim_split) != 2:
            raise SystemExit('ERROR: bad yolo_dim (%s)!' % yolo_dim)
        w, h = int(dim_split[0]), int(dim_split[1])
    else:
        h = w = int(yolo_dim)
    if h % 32 != 0 or w % 32 != 0:
        raise SystemExit('ERROR: bad yolo_dim (%s)!' % yolo_dim)

    trt_yolo = TrtYOLO(args.model, (h, w), args.category_num)

    vis = BBoxVisualization(cls_dict)
    mjpeg_server = MjpegServer(port=args.mjpeg_port)
    print('MJPEG server started...')
    try:
        loop_and_detect(cam, trt_yolo, conf_th=0.3, vis=vis,
                        mjpeg_server=mjpeg_server)
    except Exception as e:
        print(e)
    finally:
        mjpeg_server.shutdown()
        cam.release()

if __name__ == '__main__':
    main()
    for i in list(th):
        th[i].join()
        print('Thread' + str(i) + ' Ended!')
        th.pop(i)