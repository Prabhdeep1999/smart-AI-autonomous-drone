speed = 10
z_inital = 0  #initial speed
y_inital = 0  
x_inital = 0
percentFactor = 25
prevHeight = 0

class Tracker:
    def __init__(self,FrameHeight,FrameWidth):
        


        self.FRAME_HEIGHT = FrameHeight
        self.FRAME_WIDTH  = FrameWidth
        

        self.H_LEFT_TH   = 200
        self.H_RIGHT_TH = 280

        self.V_TOP_TH   = self.FRAME_HEIGHT/3
        self.V_BOTTOM_TH = self.V_TOP_TH + (self.FRAME_HEIGHT/3)


        self.DIRECTION_DICT = {

        # (left,right), (forward,backward), (up,down), (yaw)
        
        "LeftTop":[0,0,speed,-speed],   
        "LeftCenter":[0,0,0,-speed],
        "LeftBottom":[0,0,-speed,-speed],

        "CenterTop" : [0,0,speed,0],
        "CenterCenter": [0,0,0,0],
        "CenterBottom" : [0,0,0,0],

        "RightTop":[0,0,10,speed],
        "RightCenter":[0,0,0,speed],
        "RightBottom":[0,0,10,speed],
        }

    def getVelocityAcc(self,initalVelocity,distance,time):
        Finalvelocity = distance/time
        speedSqDiff = (initalVelocity**2)-(Finalvelocity**2)
        acc = int(abs((speedSqDiff/(2*distance))))
        if acc>62.5:
            acc  = 62.5
        return Finalvelocity,acc

    def getAccPercentDistance(self,axis,point,time):
        global z_inital, y_inital, x_inital
        
        if axis == 'z':
            print('difference is: ', point-320)
            distance = int(abs(point-320) * 0.615) #pixel * cm / pixel = cm
            z_final,acc = self.getVelocityAcc(z_inital,distance,time)
            accPercent = int((percentFactor*acc/62.5))
            z_inital = z_final
            return accPercent,distance
        
        if axis == 'x':
            delX = abs(self.FRAME_WIDTH/2 - point)
            distance = int(abs(delX)*1/3)
            x_final, acc = self.getVelocityAcc(x_inital,distance,time)
            accPercent = int((percentFactor*acc/62.5))
            x_inital = x_final
            return accPercent,distance
        
        if axis == 'y':
            delY = abs(self.FRAME_HEIGHT/2 - point)
            distance = int(abs(delY)*1/37)
            y_final, acc = self.getVelocityAcc(y_inital,distance,time)
            accPercent = int((percentFactor*acc/62.5))
            y_inital = y_final
            return accPercent,distance
            

    def getDirection(self,x,y,wid,hght,time):
        print('height is:', hght, 'width is: ', wid)
        global speed, prevHeight
        try:
            Xmid = x + (wid/2)
            Ymid = y + (hght/2)
            
            directions = [0,0,0,0]

            #for z-axis
            accPercent,distance = self.getAccPercentDistance('z',wid,time)
            if accPercent <= 5:
                accPercent = 0
            print('distance is: ', distance/10)
            
            print('ratio is: ', wid/self.FRAME_WIDTH)
            HghtDiff = abs(hght - prevHeight)
            ratio = wid/self.FRAME_WIDTH
            
            # a sanity check which provides sudden increase in frame height
            if HghtDiff < 25:
                directions[1] = 0
            
            # 0.16 is the value for 3 meters
            elif ratio> 0.19:     
                directions[1] = -accPercent

            elif 0.19>ratio>0.11:   
                directions[1] = 0

            # 0.11 is the value for 5 meters
            elif ratio <0.11:   
                directions[1] = accPercent

            #for x-axis
            #accPercent,distance = self.getAccPercentDistance('x',Xmid,time)
            accPercent = speed
            if Xmid<self.H_LEFT_TH:
                directions[3]= -accPercent
            elif self.H_LEFT_TH<=Xmid<self.H_RIGHT_TH:
               directions[3]= 0
            elif self.H_RIGHT_TH<=Xmid:
                directions[3]= accPercent

            
            #for y-axis
            #accPercent,distance = self.getAccPercentDistance('y',Ymid,time)
            accPercent = speed
            if Ymid<self.V_TOP_TH:
                directions[2]= accPercent
            elif self.V_TOP_TH<=Ymid<self.V_BOTTOM_TH:
                directions[2]= 0
            elif self.V_BOTTOM_TH<=Ymid:
                directions[2]= 0
            
            print(directions)
            return directions,None


        except Exception as e:
            print(e)
            return [0,0,0,0],None
