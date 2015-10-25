var TermostatModel = require('../models/termostat.js');

module.exports = {
  variableChangeHelper: function variableChangeHelper(var1, var2){//return true if variable changed, else false
    if(var1 === var2)return false;
    return true;
  },
  mongodbWriteHelper: function mongodbWriteHelper(object, varToSave){
    TermostatModel.findById(object._id, function (err, doc){
      doc[varToSave] = object[varToSave];
      doc.save(function (err){
        if(err) throw err;
      });
    });
  }
}
