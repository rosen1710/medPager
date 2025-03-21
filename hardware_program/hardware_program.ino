#include <ESP8266WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* ssid = "i0anbg";
const char* password = "hiokay141414";
const char* host = "192.168.117.216";
const uint16_t port = 12345;

WiFiClient client;
LiquidCrystal_I2C lcd(0x27, 16, 2);

String lastMessage = "Waiting...";

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.clear();
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.print("Connecting to server ");
  Serial.print(host);
  Serial.print(":");
  Serial.println(port);

  connectToServer();
}

void loop() {
  if (!client.connected()) {
    Serial.println("Disconnected from server! Reconnecting...");
    client.stop();
    delay(5000);
    connectToServer();
  } else {
    String response = "";
    
    while (client.available()) {
      response = client.readStringUntil('\n');
      response.trim();
      Serial.print("Received: ");
      Serial.println(response);
      
      if (response.length() > 0) {
        lastMessage = response;
      }
    }

    client.println("Ping!"); 
    delay(2000);
  }

  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Message:");
  lcd.setCursor(0, 1);
  lcd.print(lastMessage);
  delay(500);
}

void connectToServer() {
  if (client.connect(host, port)) {
    Serial.println("Connected to server!");
    client.println("Hello from ESP8266!");
  } else {
    Serial.println("Connection failed!");
  }
}
