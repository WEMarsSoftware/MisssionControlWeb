#ifndef websocketesp_h
#define websocketesp_h

#include "Arduino.h"
#include <WiFi.h>
#include "ESPAsyncWebServer.h"
#include "SPIFFS.h"

// INFO FOR LOCAL ROUTER
const char* ssid = "WE MARS Rover";
const char* password = "westill1";

//  BUTTON AND AXIS STATUS 
//  button map, L AXIS x, L AXIS y, R AXIS x, R AXIS y
int[] controller1 = {0,0,0,0};
int[] controller2 = {0,0,0,0};



// COMMUNICATION CONSTANTS
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
AsyncWebSocketClient * globalClient = NULL; //client for server

//if there is a websocket event
void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){

  //if the websocket has connected
  if(type == WS_EVT_CONNECT){
    Serial.println("Websocket client connection received");
    globalClient = client; //declare client
  }
  //if the websocket has disconnected
  else if(type == WS_EVT_DISCONNECT){
    Serial.println("Client disconnected");
    globalClient = NULL; //to avoid errors
  }
  //if data has been recieved
  else if(type == WS_EVT_DATA){
    //bool flag = true;
    //char temp[len];

    bool idFound = false; //if the id of the controller has been parsed
    byte id; 
    byte indexCounter = 0; 
    byte digitCounter = 5; //start at 5 for math to work
    int[4] temp;

    //reset controller data
    for(int j = 0; j < controller1.length; j++){
      if(id == 0){
        controller1[j] = 0;
      }
      else{
        controller2[j] = 0;
      }
    }
    
    for(int i=0; i < len; i++) {

      if (!idFound){
        id = toInt((char)data[i]);
        idFound = true;
      }
      else{
        if(',' == (char)data[i]){
          //adjust for extra zeros
          if(id == 0){
            controller1[indexCounter] /= 10*digitCounter;
          }
          else{
            controller2[indexCounter] /= 10*digitCounter;
          }
          
          digitCounter = 5; //reset counter
          indexCounter++; //next number
        }
        else if ('_' == (char)data[i]){
          break; //end loop
        }
        else{
          if(id == 0){
            controller1[indexCounter] += 10*digitCounter*toInt((char)data[i]);
          }
          else{
            controller2[indexCounter] += 10*digitCounter*toInt((char)data[i]);
          }
          digitCounter--;
        }
      }

      /*
      //translate data into string
       if('_' != (char)data[i] && flag){
          temp[i] = (char)data[i];  
       }
       else if (flag){
          flag = false;
          temp[i] = '_';
       }
       else{
          temp[i] = '_'; 
       }
       */
    }
  }
}

//starts wifi
//must begin serial before calling this function
void inline startWiFi()
{  
    WiFi.begin(ssid, password);

    Serial.print("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println();
    Serial.println("CONNECTED TO " + String(ssid));
    Serial.println(WiFi.localIP());
    Serial.println(WiFi.macAddress());
}

//starts server
void inline startServer(){
  //need this to write to client
  if(!SPIFFS.begin(true)){
     Serial.println("An Error has occurred while mounting SPIFFS");
     return;
  }

  //start server
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.on("/html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/ws.html", "text/html");
  });
  server.begin();
}

void writeServer(String message){
  //if server is connected
  if (globalClient){
    globalClient->text(message);
  }
} 

#endif
