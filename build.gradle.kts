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
}