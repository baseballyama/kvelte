plugins {
    kotlin("jvm") version "1.6.10"
    id("com.vanniktech.maven.publish") version "0.19.0"
}

group = "tokyo.baseballyama"
version = "0.0.1"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.2")

    implementation("io.ktor:ktor-server-core:1.6.8")
    implementation("io.ktor:ktor-server-netty:1.6.8")
    implementation("io.ktor:ktor-websockets:1.6.8")
    implementation("org.slf4j:slf4j-nop:1.7.36")
}

tasks.withType<Jar> {
    enabled = true
}

tasks.named("build") {
    doFirst {
        println("Building the application")
    }
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


