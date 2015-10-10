# node-termostat
A customised termostat written in NodeJS, having a nice UI leveraging AngularJS&amp;Bootstrap

Warning this is still a work in progress.
Things that are working:
* ui for controlling and reading termostat details
* switching on/off pins

What still needs to be done:
* termostat logic has to be programmed (auto mode)
* user authentication has to be added
* easy web customisation of used pins to switch has to be added
* need to make sure the termostat object is only once in the database
* need to document how to set up confif.txt (sample file included to the commit)
* bootstrap is browserified through a transform & url, want it to be loaded entirely from ghe device and not from web
* need to add maximum/minimum value sanitiser for termostat and hystereses
* need to make sure when setting the termostat it is not skipping between values = read from the server only after set add the api tombe able to pull values separately, not the whole state ...  -- done
* no idea right now :)
