# Try Drift — Swift

This project depends on `https://github.com/Alamofire/Alamofire` **4.9.1**.

The Codespace upgraded it to **5.9.1** and left the source code alone, so
`Sources/DriftDemo/ApiClient.swift` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

4 breaking changes in this demo:

1. SessionManager was removed in Alamofire 5 and replaced by Session, reached through the `AF` global.
2. The top-level Alamofire.request(..) function was removed in Alamofire 5; it is AF.request(..) now.
3. responseJSON was deprecated in Alamofire 5 and removed in 5.5 in favour of responseDecodable(of:).
4. SessionManager.upload moved to Session/AF, and the multipart API changed shape entirely in Alamofire 5.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `https://github.com/Alamofire/Alamofire`.
3. Open `Sources/DriftDemo/ApiClient.swift` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs swift`.
