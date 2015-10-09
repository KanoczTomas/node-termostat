echo updating repositary
sudo apt-get update
echo imstalling mongodb
sudo apt-get install mongodb -y
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
