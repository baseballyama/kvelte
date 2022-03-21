plugins {
    kotlin("jvm") version "1.6.10"
}

group = "tokyo.baseballyama"
version = "0.0.1"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.1")
}

tasks.withType<Jar> {
    enabled = true
}

tasks.named("build") {
    doFirst {
        println("Building the application")
    }
}