plugins {
    kotlin("jvm") version "1.7.0"
    kotlin("plugin.serialization") version "1.7.0"
    id("application")
}

group = "tokyo.baseballyama.kvelte.template"
version = "0.0.0"
java.sourceCompatibility = JavaVersion.VERSION_11
java.targetCompatibility = JavaVersion.VERSION_11

repositories {
    mavenCentral()
}

val ktorVersion = "2.0.2"
dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-status-pages:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.3")
    implementation("tokyo.baseballyama:kvelte:0.1.0")
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("tokyo.baseballyama:kvelte:0.1.0")
    }
}

tasks.create("kvelte") {
    tokyo.baseballyama.kvelte.KvelteBuilder.build(project.projectDir)
}
tasks.build {
    this.dependsOn("kvelte")
}

application {
    mainClass.set("tokyo.baseballyama.kvelte.demo.AppKt")
}