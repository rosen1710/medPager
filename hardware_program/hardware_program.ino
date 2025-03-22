#include <ESP8266WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

String department = "Ophthalmology";

// const char* ssid = "InnovationForumGuests";
// const char* password = "";
// const char* host = "10.1.171.66";
const char* ssid = "Tech_D3815701";
const char* password = "EUWVSUTG";
const char* host = "192.168.0.21";
const uint16_t port = 12345;

const char upButton = D5;
const char downButton = D6;
const char clearButton = D7;

const int maxMessages = 10;
String messages[maxMessages];
int messageCount = 0;
int currentMessage = 0;

WiFiClient client;
LiquidCrystal_I2C lcd(0x27, 16, 2);

String lastMessage = "Waiting...";

void setup() {
  pinMode(upButton, INPUT);
  pinMode(downButton, INPUT);
  pinMode(clearButton, INPUT);

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

  Serial.println("Connecting to server...");

  connectToServer();

  clearMessages();
}

void loop() {
  if (!client.connected()) {
    Serial.println("Disconnected from server! Reconnecting...");
    client.stop();
    delay(2000);
    connectToServer();
  } else {
    String response = "";
    
    while (client.available()) {
      response = client.readStringUntil('\n');
      response.trim();

      Serial.print("\nDepartment: ");
      Serial.println(response);

      if (response == department || response == "None") {
        response = client.readStringUntil('\n');
        response.trim();

        Serial.print("Received: ");
        Serial.println(response);

        // lcd.clear();
        // lcd.setCursor(0, 0);
        // lcd.print(response);

        storeMessage(response);
        displayMessage();
      }
      else {
        response = client.readStringUntil('\n');
        response.trim();
      }
    }

    // client.println("Ping!"); 
    // delay(2000);

    handleButtons();
  }
  delay(1000);
}

void connectToServer() {
  if (client.connect(host, port)) {
    Serial.println("Connected to server!");
    
    // client.println("Hello!");
  } else {
    Serial.println("Connection failed!");
  }
}

void storeMessage(String msg) {
  if (messageCount < maxMessages) {
    messages[messageCount] = msg;
    messageCount++;
  } else {
    for (int i = 1; i < maxMessages; i++) {
        messages[i - 1] = messages[i];
    }
    messages[maxMessages - 1] = msg;
  }
  currentMessage = messageCount - 1;
}

void displayMessage() {
  lcd.clear();

  if (messageCount == 0) {
    lcd.setCursor(0, 0);
    lcd.print("No current msgs");
  } else {
    lcd.setCursor(0, 0);
    lcd.print("Message ");
    lcd.print(currentMessage + 1);
    lcd.print(" / ");
    lcd.print(messageCount);
    lcd.setCursor(0, 1);
    lcd.print(messages[currentMessage]);
  }
}

void handleButtons() {
    if (digitalRead(upButton) == LOW) {
      if (currentMessage > 0) {
        currentMessage--;
        displayMessage();
      }
    }
    if (digitalRead(downButton) == LOW) {
      if (currentMessage < messageCount - 1) {
        currentMessage++;
        displayMessage();
      }
    }
    if (digitalRead(clearButton) == LOW) {
      clearMessages();
    }
    delay(500);
}

void clearMessages() {
  if (messageCount > 0) {
    for (int i = currentMessage; i < messageCount - 1; i++) {
      messages[i] = messages[i + 1];  // Shift messages up
    }
    messages[messageCount - 1] = "";
    messageCount--;

    if (messageCount == 0) {
      currentMessage = 0;
      messages[0] = "No current msgs";
    } else if (currentMessage >= messageCount) {
      currentMessage = messageCount - 1;
    }
  }

  displayMessage();
}