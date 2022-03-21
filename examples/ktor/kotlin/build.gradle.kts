plugins {
    kotlin("jvm") version "1.6.10"
    application
}

group = "tokyo.baseballyama"
version = "0.0.1"

application {
    mainClass.set("tokyo.baseballyama.ksveltor.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:1.6.7")
    implementation("io.ktor:ktor-server-netty:1.6.7")
    implementation("ch.qos.logback:logback-classic:1.2.11")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.1")
    implementation(files(listOf("/Users/baseballyama/Desktop/git/ksveltor/kvelte2/build/libs/kvelte-0.0.1.jar")))
}

tasks.named("run") {
    doFirst {
        println("Building the application")
    }
}