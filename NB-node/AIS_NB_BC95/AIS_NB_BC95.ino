#include "AIS_NB_BC95.h"
#include <Thread.h>
#define sw 6
#define load 7
bool sw_state = false;
bool load_state = false;
String apnName = "devkit.nb";

String serverIP = "18.138.77.89"; // Your Server IP
String serverPort = "41234"; // Your Server Port
String node = "0000";

Thread myThread = Thread();

AIS_NB_BC95 AISnb;

const long interval = 1000;  //millisecond
unsigned long previousMillis = 0;

void udpSend(String nodeName, String data){
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval)
    {
      // Send data in String 
      UDPSend udp = AISnb.sendUDPmsgStr(serverIP, serverPort, nodeName + data);
      //Send data in HexString     
      //nodeNameHEX = AISnb.str2HexStr(nodeName);
      //UDPSend udp = AISnb.sendUDPmsg(serverIP, serverPort, nodeNameHEX);
      previousMillis = currentMillis;
    }
}

void checkState(){
  if(load == HIGH){
    load_state == true;
  }else{
    load_state == false;
  }
  
  if((sw_state == true) && (load_state == true)){
    udpSend(node, "TT");
  }else if((sw_state == true) && (load_state == false)){
    udpSend(node, "TF");
  }else if((sw_state == false) && (load_state == true)){
    udpSend(node, "FT");
  }else{
    udpSend(node, "FF");
  }
}

void setup()
{ 
  AISnb.debug = true;
  
  Serial.begin(9600);

  AISnb.setupDevice(serverPort);

  String ip1 = AISnb.getDeviceIP();  
  delay(1000);
  
  pingRESP pingR = AISnb.pingIP(serverIP);
  previousMillis = millis();

  myThread.onRun(checkState);
  myThread.setInterval(12000); 

  pinMode(sw, OUTPUT);
  pinMode(load, INPUT);
}

void loop()
{ 
  if(myThread.shouldRun()){
    myThread.run();
  }
   
  UDPReceive resp = AISnb.waitResponse();
  if(AISnb.toString(resp.data)!=""){
    if((AISnb.toString(resp.data)=="00") && (sw_state==true)){ 
      sw_state = false;
      digitalWrite(6,LOW);
      checkState();
      udpSend(node, "AC");
    }else if((AISnb.toString(resp.data)=="01") && (sw_state==false)){ 
      sw_state = true;
      digitalWrite(6,HIGH);
      checkState();
      udpSend(node, "AC");
    }
  }
  
}
