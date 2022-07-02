import queue
import cv2
import threading

class Capture:
    def __init__(self,camAddr):
        #frame capture thread
        self.cap = cv2.VideoCapture(camAddr)
        self.frameQue = queue.Queue()
        self.framCapFlag = 1

    def startCaptureThread(self):
        self.camThread = threading.Thread(target=self._reader)
        self.camThread.daemon = True
        self.camThread.start()
        
    def stopCaptureThread(self):
        self.framCapFlag = 1
        self.camThread.join()

    def _reader(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                print("break from queue")
                continue
            if not self.frameQue.empty():
                try:
                    self.frameQue.get_nowait()   # discard previous (unprocessed) frame
                except queue.Empty:
                    pass
            self.frameQue.put(frame)
    
    def read(self):
        return self.frameQue.get()
       
    
    def release(self):
        self.cap.release()