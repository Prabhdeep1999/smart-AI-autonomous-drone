from threading import Thread
from queue import Queue
import requests
countOfEmptyFrames = 0
checkLastUrl = ''

class Command:
    def __init__(self, debug):
        self.cmdQue = Queue(maxsize=1)
        self.__sendCmdThrdFlg = 1
        self.debug = debug

    def _sendCmd(self):
        print("sendCmd thread started")
        global countOfEmptyFrames, checkLastUrl
        while self.__sendCmdThrdFlg:
            if self.cmdQue.empty():
                url = f'http://localhost:4000/rc/0/0/0/0'
                
                print(f"URL = {url}")
                dirx = requests.get(url)
                print(f"status code = {dirx.status_code}")
                print(f"Response = {dirx.text}")
            else:
                queElement = self.cmdQue.get()
                direct = queElement
                url = f'http://localhost:4000/rc/{direct[0]}/{direct[1]}/{direct[2]}/{direct[3]}'
                print(f"URL = {url}")
                dirx = requests.get(url)
                print(f"status code = {dirx.status_code}")
                print(f"Response = {dirx.text}")
        print("sendCmd thread ended")
        

    def _webcamTest(self):
        print("webcam test thread started")
        while self.__sendCmdThrdFlg:
            if self.cmdQue.empty():
                    print("empty Queue in webcam")
            else:
                queElement = self.cmdQue.get()
                direct = queElement
                print(direct, 'command')
        print("webcam test thread ended")
        
    def startCmdThread(self):
        if self.debug:
            self.cmdThread = Thread(target=self._webcamTest)
        else:
            self.cmdThread = Thread(target=self._sendCmd)   #uncomment for drone    
        self.cmdThread.setDaemon(True)
        self.cmdThread.start()

    def stopCmdThread(self):
        self.__sendCmdThrdFlg=0
        self.cmdThread.join()

    def putInQue(self,directionList):
        self.cmdQue.put(directionList)
