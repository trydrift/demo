import Alamofire

/// Networking layer for the iOS app.
///
/// This file is written against Alamofire 4.9, installed through CocoaPods.
/// The Codespace upgraded the pod to Alamofire 5.9 without touching this code.
/// Alamofire 5 rewrote the public API, so every marked usage below is gone.
final class NetworkService {

    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // SessionManager was removed in Alamofire 5, replaced by Session/AF.
    private let manager = SessionManager.default

    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // Alamofire 5 removed the SessionDelegate hooks that were assigned like
    // this; retry and adapt are handled by a RequestInterceptor now.
    init() {
        manager.adapter = nil
        manager.retrier = nil
    }

    /// Load the user's profile.
    func loadProfile(completion: @escaping (Any?) -> Void) {
        // ── BREAKING 3 ────────────────────────────────────────────────────
        // The top-level Alamofire.request(..) was removed in Alamofire 5.
        Alamofire.request("https://example.com/me")
            // ── BREAKING 4 ────────────────────────────────────────────────
            // responseJSON was removed in Alamofire 5.5; use
            // responseDecodable(of:) instead.
            .responseJSON { response in
                // ── BREAKING 5 ────────────────────────────────────────────
                // DataResponse.result was a Result enum with `.value` in
                // Alamofire 4. In Alamofire 5 it is Swift's own Result, so
                // `.value` is no longer how you read it.
                completion(response.result.value)
            }
    }
}
