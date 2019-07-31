#include "GamepadWebsocket.h"

#define LED 2 //onboard LED
bool LED_status = false;

int timer;

void setup() {
  digitalWrite(LED, HIGH); //led on for setup 
  Serial.begin(115200);

  startWiFi();
  startServer();

  timer = millis(); //start timer

}

void loop() {
  if(millis() - timer > 2000){
    timer = millis(); //reset timer

    //Serial.println(controller1_data);

    //blink LED
    if(LED_status){
      digitalWrite(LED,LOW);
    }
    else{
      digitalWrite(LED,HIGH);
    }
    LED_status = !LED_status;
  }

}
