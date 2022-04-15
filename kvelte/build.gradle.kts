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

    testImplementation("org.junit.jupiter:junit-jupiter:5.5.2")
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

tasks.test {
    // JUnit platform を使う設定
    useJUnitPlatform()

    testLogging {
        // テスト時の標準出力と標準エラー出力を表示する
        showStandardStreams = true
        // イベントを出力する (TestLogEvent)
        events = setOf(
            org.gradle.api.tasks.testing.logging.TestLogEvent.STARTED,
            org.gradle.api.tasks.testing.logging.TestLogEvent.SKIPPED,
            org.gradle.api.tasks.testing.logging.TestLogEvent.PASSED,
            org.gradle.api.tasks.testing.logging.TestLogEvent.FAILED
        )
        // 例外発生時の出力設定 (TestExceptionFormat)
        exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
    }
}