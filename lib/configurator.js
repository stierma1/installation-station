var nEw = require("pid-async-class").nEw;
//This file should not be used stand alone

class Configurator extends BaseAsync{
  constructor(){
    super(true);
    this.storage = null;
    this.appName = "replaceMe";
    nEw(Storage).then((store) =>{
      this.storage = store;
      this.__completeConstruction();
    })
  }

  getConfiguration(){
    return this.storage.get(this.appName);
  }
}

module.exports = Configurator;
