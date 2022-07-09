#!/bin/sh
set -e

echo "clone kvelte..."
cd ..
rm -rf kvelte
git clone https://github.com/baseballyama/kvelte.git
cd kvelte
echo "cloned kvelte"

echo "build kvelte-node..."
cd ./kvelte-node
npm i
npm run build
npm link
cd ..
echo "built kvelte-node"

echo "build kvelte..."
cd ./kvelte
./gradlew build
./gradlew publishToMavenLocal
cd ..
echo "built kvelte"

echo "build kvelte-demo..."
cd ./examples/ktor/src/main/resources/kvelte
npm i
npm link kvelte-node
cd ../../../..
./gradlew build
cd ../..
echo "built kvelte-demo"

echo "start kvelte-demo"
kill -9 $(lsof -t -i:80)
java -jar examples/ktor/build/libs/kvelte-demo.jar