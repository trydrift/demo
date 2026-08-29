#include <Arduino.h>
#include <ArduinoJson.h>

// This sketch is written against ArduinoJson 5.13.
// The Codespace upgraded the library to ArduinoJson 6.21 without touching this
// code. ArduinoJson 6 replaced the whole document model, so every marked line
// below refers to something that no longer exists.

// ── BREAKING 1 ──────────────────────────────────────────────────────────
// StaticJsonBuffer was removed in ArduinoJson 6, replaced by
// StaticJsonDocument. The buffer/document split is gone entirely.
StaticJsonBuffer<256> jsonBuffer;

void publishReading(float celsius) {
    // ── BREAKING 2 ──────────────────────────────────────────────────────
    // JsonObject was a reference type created from the buffer in v5
    // (`JsonObject& root = jsonBuffer.createObject()`). In v6 it is a value
    // type obtained from a document with `doc.to<JsonObject>()`.
    JsonObject& root = jsonBuffer.createObject();
    root["celsius"] = celsius;
    root["unit"] = "C";

    // ── BREAKING 3 ──────────────────────────────────────────────────────
    // printTo() was removed in ArduinoJson 6 in favour of the free function
    // serializeJson(doc, output).
    root.printTo(Serial);
    Serial.println();
}

void readCommand(const char* payload) {
    // ── BREAKING 4 ──────────────────────────────────────────────────────
    // parseObject() was removed in v6; parsing goes through
    // deserializeJson(doc, input), which returns a DeserializationError.
    JsonObject& command = jsonBuffer.parseObject(payload);

    // ── BREAKING 5 ──────────────────────────────────────────────────────
    // JsonObject::success() was removed in v6 — you check the
    // DeserializationError that deserializeJson returns instead.
    if (!command.success()) {
        Serial.println("bad payload");
        return;
    }

    Serial.println(command["action"].as<const char*>());
}

void setup() {
    Serial.begin(9600);
}

void loop() {
    publishReading(21.5);
    delay(1000);
}
