cmake_minimum_required(VERSION 3.15)
project(drift_demo CXX)

set(CMAKE_CXX_STANDARD 17)

find_package(fmt REQUIRED)

add_executable(drift_demo src/main.cpp)
target_link_libraries(drift_demo fmt::fmt)
