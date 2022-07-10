#!/bin/sh
set -e

sudo apt update && sudo apt upgrade
yes | sudo apt install openjdk-11-jdk
java -version

wget -c https://services.gradle.org/distributions/gradle-7.4.2-bin.zip -P /tmp
sudo unzip -d /opt/gradle /tmp/gradle-7.4.2-bin.zip
echo -e 'export GRADLE_HOME=/opt/gradle/gradle-7.4.2\nexport PATH=${GRADLE_HOME}/bin:${PATH}' > /etc/profile.d/gradle.sh
sudo chmod +x /etc/profile.d/gradle.sh
gradle --version

yes | sudo apt install nodejs
node -v
yes | sudo apt install npm
npm -v
sudo npm install n -g
sudo n stable
sudo apt purge -y nodejs npm
exec $SHELL -l