#include <LiquidCrystal.h>

#define RS_pin 4
#define EN_pin 6
#define D4_pin 9
#define D5_pin 10
#define D6_pin 11
#define D7_pin 12

#define COLS 16
#define ROWS 2

LiquidCrystal lcd(RS_pin, EN_pin, D4_pin, D5_pin, D6_pin, D7_pin);

void setup() {
  lcd.begin(COLS, ROWS);
  lcd.setCursor(0, 0);
  lcd.print("medPager");
}

void loop() {
}