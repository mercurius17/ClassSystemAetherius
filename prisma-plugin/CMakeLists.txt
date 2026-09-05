cmake_minimum_required(VERSION 3.23)

project(
    AetheriusClasses
    VERSION 1.0.0
    LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(CommonLibSSE-NG CONFIG REQUIRED)

add_library(${PROJECT_NAME} SHARED
    src/PCH.h
    src/PrismaUI_API.h
    src/main.cpp
)

target_include_directories(${PROJECT_NAME} PRIVATE src)

target_compile_definitions(${PROJECT_NAME} PRIVATE
    SKSE_SUPPORT_XBYAK
)

target_precompile_headers(${PROJECT_NAME} PRIVATE src/PCH.h)

target_link_libraries(${PROJECT_NAME} PRIVATE
    CommonLibSSE-NG::CommonLibSSE-NG
)

target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_23)
