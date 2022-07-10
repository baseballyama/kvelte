## Local Operations

```sh
# kvelte-node (add)
cd kvelte-node
npm version (patch|minor|major)
npm run build
cd ..

# kvelte (add)
# UPDATE `version` of `build.gradle.kts`.

# kvelte-node (release)
cd kvelte-node
npm publish ./
cd ..

# kvelte-node (release)
cd kvelte
./gradlew publish
cd ..

# Add tag and push
git add .
git commit -m "-> release 0.1.0"
git push origin HEAD
git tag -a kvelte@0.1.0 -m "version kvelte@0.1.0"
git push origin kvelte@0.1.0
```

## Maven Operations

```sh
# Go to sonatype page
https://s01.oss.sonatype.org/#view-repositories

# Releasing
`Staging Repositories` -> `Close` -> `Release`

# Check maven repo
https://repo1.maven.org/maven2/tokyo/baseballyama/kvelte/
```

## NPM Operations

```sh
# Check npm repo
https://www.npmjs.com/package/kvelte-node

```