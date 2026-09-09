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

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `bblanchon/ArduinoJson` in the panel.
2. Open `src/main.cpp` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain bblanchon/ArduinoJson
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs arduino`.
