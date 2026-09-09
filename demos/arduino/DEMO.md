# Try Drift — Arduino / PlatformIO

This project depends on `bblanchon/ArduinoJson` **5.13.5**.

The Codespace upgraded it to **6.21.3** and left the source code alone, so
`src/main.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 5 breaking changes in this demo:

1. StaticJsonBuffer was removed in ArduinoJson 6, replaced by StaticJsonDocument. The buffer/document split is gone entirely.
2. JsonObject was a reference type created from the buffer in v5 (`JsonObject& root = jsonBuffer.createObject()`). In v6 it is a value type obtained from a document with `doc.to<JsonObject>()`.
3. printTo() was removed in ArduinoJson 6 in favour of the free function serializeJson(doc, output).
4. parseObject() was removed in v6; parsing goes through deserializeJson(doc, input), which returns a DeserializationError.
5. JsonObject::success() was removed in v6 — you check the DeserializationError that deserializeJson returns instead.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `bblanchon/ArduinoJson`.
3. Open `src/main.cpp` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs arduino`.
