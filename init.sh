#!/bin/sh
set -e

sudo apt update && sudo apt upgrade
yes | sudo apt install openjdk-11-jdk
java -version
yes | sudo apt install nodejs
node -v
yes | sudo apt install npm
npm -v
sudo npm install n -g
sudo n stable
sudo apt purge -y nodejs npm
exec $SHELL -l