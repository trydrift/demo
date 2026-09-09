cmake_minimum_required(VERSION 3.15)
project(drift_demo CXX)

set(CMAKE_CXX_STANDARD 17)

find_package(Catch2 CONFIG REQUIRED)

add_executable(drift_demo_tests src/tests.cpp)
target_link_libraries(drift_demo_tests PRIVATE Catch2::Catch2)
