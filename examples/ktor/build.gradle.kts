import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.7.0"
    kotlin("plugin.serialization") version "1.7.0"
    id("com.github.johnrengelman.shadow") version "7.1.2"
    id("application")
}

group = "tokyo.baseballyama.kvelte"
version = "0.0.2"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
    mavenLocal {
        content {
            includeGroupByRegex("tokyo\\.baseballyama.*")
        }
    }

    mavenCentral {
        content {
            excludeGroupByRegex("tokyo\\.baseballyama.*")
        }
    }
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:2.0.2")
    implementation("io.ktor:ktor-server-netty:2.0.2")
    implementation("ch.qos.logback:logback-classic:1.2.11")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.3")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.3")
    implementation("tokyo.baseballyama:kvelte:0.0.2")
    testImplementation(kotlin("test"))


}

tasks.test {
    useJUnitPlatform()
}

buildscript {
    repositories {
        mavenLocal()
    }
    dependencies {
        classpath("tokyo.baseballyama:kvelte:0.0.2")
    }
}

tasks.withType<KotlinCompile> {
    doFirst {
        tokyo.baseballyama.kvelte.KvelteBuilder.build(project.projectDir)
    }
}

application {
    mainClass.set("tokyo.baseballyama.kvelte.demo.ControllerKt")
}

tasks.shadowJar {
    archiveBaseName.set("kvelte-demo")
    archiveClassifier.set("")
    mergeServiceFiles()
}