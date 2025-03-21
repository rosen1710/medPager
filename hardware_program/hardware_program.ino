#include <ESP8266WiFi.h>

const char* ssid = "i0anbg";
const char* password = "hiokay141414";
const char* host = "192.168.117.216";
const uint16_t port = 12345;

WiFiClient client;

void setup() {
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
    while (client.available()) {
      String response = client.readStringUntil('\n');
      Serial.print("Received: ");
      Serial.println(response);
    }
    client.println("Ping!");
    delay(2000);
  }
}

void connectToServer() {
  if (client.connect(host, port)) {
    Serial.println("Connected to server!");
    client.println("Hello from ESP8266!");
  } else {
    Serial.println("Connection failed!");
  }
}
