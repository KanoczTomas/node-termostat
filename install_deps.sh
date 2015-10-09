echo updating repositary
sudo apt-get update
echo imstalling mongodb
sudo apt-get install mongodb -y
echo updating rpi firmware
sudo rpi-update
echo *** installing nodejs
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
echo "http://vorboss.dl.sourceforge.net/project/webiopi/WebIOPi-0.7.1.tar.gz">
echo installing quickwire-gpio-admin
cd dependencies
tar xvf quick2wire-gpio-admin.tar.gz
cd quick2wire-gpio-admin
make
sudo make install
cd ..
echo installing bcm2835
tar xvf bcm2835-1.46.tar.gz
cd bcm2835-1.46
./configure
make
sudo make test
sudo make install
echo done!
