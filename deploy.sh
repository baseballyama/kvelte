#!/bin/sh
set -e

cd ..
rm -rf kvelte
git clone https://github.com/baseballyama/kvelte.git
cd kvelte

cd ./kvelte-node
npm i
npm run build
npm link
cd ..

cd ./kvelte
./gradlew build
cd ..

cd ./examples/ktor/src/main/resources/kvelte
npm i
npm link kvelte-node
cd ../../../..

./gradlew build
cd ../..

java -jar examples/ktor/build/libs/kvelte-demo.jar