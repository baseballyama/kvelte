# Release operation

### Edit `version` of `build.gradle.kts`.

### Add tag

```sh
git add .
git commit -m "update version"
git push origin HEAD
git tag -a kvelte@0.0.2 -m "version kvelte@0.0.2"
git push origin kvelte@0.0.2
```

### Run this command

```sh
./gradlew publish
```

### Go to web

https://s01.oss.sonatype.org/#view-repositories

`Close` -> `Release`

### Check maven repo

https://repo1.maven.org/maven2/tokyo/baseballyama/kvelte/

### check global settings if I have permission issue

```sh
vi ~/.gradle/gradle.properties
```

# link package on local

```sh
./gradlew publishToMavenLocal
```
