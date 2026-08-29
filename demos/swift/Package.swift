// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "DriftDemo",
    platforms: [.macOS(.v10_15)],
    products: [
        .library(name: "DriftDemo", targets: ["DriftDemo"])
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire", exact: "4.9.1")
    ],
    targets: [
        .target(name: "DriftDemo", dependencies: ["Alamofire"])
    ]
)
