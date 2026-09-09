# Try Drift — Swift

This project depends on `https://github.com/Alamofire/Alamofire` **4.9.1**.

The Codespace upgraded it to **5.9.1** and left the source code alone, so
`Sources/DriftDemo/ApiClient.swift` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 4 breaking changes in this demo:

1. SessionManager was removed in Alamofire 5 and replaced by Session, reached through the `AF` global.
2. The top-level Alamofire.request(..) function was removed in Alamofire 5; it is AF.request(..) now.
3. responseJSON was deprecated in Alamofire 5 and removed in 5.5 in favour of responseDecodable(of:).
4. SessionManager.upload moved to Session/AF, and the multipart API changed shape entirely in Alamofire 5.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/swift`.

From there:

1. Read what Drift found for `https://github.com/Alamofire/Alamofire` in the panel.
2. Open `Sources/DriftDemo/ApiClient.swift` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/swift
drift explain https://github.com/Alamofire/Alamofire --dir demos/swift
```

Reset it with `node scripts/reset-demo.mjs swift`.
