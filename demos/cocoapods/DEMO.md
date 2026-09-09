# Try Drift — CocoaPods

This project depends on `Alamofire` **4.9.1**.

The Codespace upgraded it to **5.9.1** and left the source code alone, so
`DriftDemo/NetworkService.swift` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 5 breaking changes in this demo:

1. SessionManager was removed in Alamofire 5, replaced by Session/AF.
2. Alamofire 5 removed the SessionDelegate hooks that were assigned like this; retry and adapt are handled by a RequestInterceptor now.
3. The top-level Alamofire.request(..) was removed in Alamofire 5.
4. responseJSON was removed in Alamofire 5.5; use responseDecodable(of:) instead.
5. DataResponse.result was a Result enum with `.value` in Alamofire 4. In Alamofire 5 it is Swift's own Result, so `.value` is no longer how you read it.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/cocoapods`.

From there:

1. Read what Drift found for `Alamofire` in the panel.
2. Open `DriftDemo/NetworkService.swift` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/cocoapods
drift explain Alamofire --dir demos/cocoapods
```

Reset it with `node scripts/reset-demo.mjs cocoapods`.
