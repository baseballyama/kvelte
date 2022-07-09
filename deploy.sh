#!/bin/sh
set -e

rm -rf ./kvelte
git clone https://github.com/baseballyama/kvelte.git
cd kvelte
./gradlew build
java -jar examples/ktor/build/libs/kvelte-demo.jar