plugins {
    kotlin("jvm") version "1.6.10"
    application
}

application {
    mainClass.set("com.sample.ktor.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:1.6.8")
    implementation("io.ktor:ktor-server-netty:1.6.8")
    implementation("io.ktor:ktor-websockets:1.6.8")
    implementation("org.slf4j:slf4j-nop:1.7.36")
    implementation("ch.qos.logback:logback-classic:1.2.11")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.2")
    // implementation("tokyo.baseballyama:kvelte:0.0.1")
    implementation(files(listOf("/Users/baseballyama/Desktop/git/kvelte/kvelte/build/libs/kvelte-0.0.1.jar")))
}

tasks.named("run") {
    doFirst {
        println("Building the application")
    }
}