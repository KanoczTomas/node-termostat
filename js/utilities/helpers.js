var TermostatModel = require('../models/termostat.js');
var Promise = require('bluebird');

module.exports = {
  variableChangeHelper: function variableChangeHelper(var1, var2){//return true if variable changed, else false
    if(var1 === var2)return false;
    return true;
  },
  mongodbWriteHelper: function mongodbWriteHelper(object, varToSave){
    return new Promise(function(resolve, reject){
      if (object._id === undefined) reject(Error('No _id property of object'));
      else{
        TermostatModel.findById(object._id, function (err, doc){
          doc[varToSave] = object[varToSave];
          doc.save(function (err){
            if(err) reject(err);
            else resolve();
          });
        });
      }
    });
  }
}
