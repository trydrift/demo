import Alamofire

/// Networking layer.
///
/// This file is written against Alamofire 4.9. The Codespace upgraded the
/// dependency to Alamofire 5.9 without touching this code — Alamofire 5 was a
/// full rewrite of the public API, so every marked usage below is gone.
final class ApiClient {

    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // SessionManager was removed in Alamofire 5 and replaced by Session,
    // reached through the `AF` global.
    private let manager = SessionManager.default

    /// Fetch a report as JSON.
    func fetchReport(id: String, completion: @escaping (Any?) -> Void) {
        // ── BREAKING 2 ────────────────────────────────────────────────────
        // The top-level Alamofire.request(..) function was removed in
        // Alamofire 5; it is AF.request(..) now.
        Alamofire.request("https://example.com/reports/\(id)")
            // ── BREAKING 3 ────────────────────────────────────────────────
            // responseJSON was deprecated in Alamofire 5 and removed in 5.5 in
            // favour of responseDecodable(of:).
            .responseJSON { response in
                completion(response.result.value)
            }
    }

    /// Upload a file.
    func upload(data: Data, to url: String) {
        // ── BREAKING 4 ────────────────────────────────────────────────────
        // SessionManager.upload moved to Session/AF, and the multipart API
        // changed shape entirely in Alamofire 5.
        manager.upload(data, to: url).responseString { response in
            print(response.result.value ?? "")
        }
    }
}
