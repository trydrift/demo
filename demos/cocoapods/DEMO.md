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
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

If VS Code asks whether you trust the authors of the files in this folder, say
yes. It asks before anything is allowed to run, so until it is answered both
the panel and the terminal stay empty — and the files it is asking about are
this repository's own demo fixture.

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
drift analyze                    # what this upgrade breaks here
drift explain Alamofire
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs cocoapods`.
