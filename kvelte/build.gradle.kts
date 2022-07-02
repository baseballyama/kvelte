plugins {
    kotlin("jvm") version "1.7.0"
    id("com.vanniktech.maven.publish") version "0.19.0"
}

group = "tokyo.baseballyama"
version = "0.0.2"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.3")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.3")
    implementation("ch.qos.logback:logback-classic:1.2.11")
    implementation("org.graalvm.sdk:graal-sdk:22.1.0.1")
    implementation("org.graalvm.js:js-scriptengine:22.1.0.1")
    implementation("org.graalvm.js:js:22.1.0.1")

    testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")
}

tasks.withType<Jar> {
    enabled = true
}

apply {
    plugin("com.vanniktech.maven.publish")
}

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("com.vanniktech:gradle-maven-publish-plugin:0.19.0")
    }
}

plugins.withId("com.vanniktech.maven.publish") {
    mavenPublish {
        sonatypeHost = com.vanniktech.maven.publish.SonatypeHost.S01
    }
}