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

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `Alamofire`.
3. Open `DriftDemo/NetworkService.swift` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs cocoapods`.
