var PromptAsync = require("pid-async-class").PromptAsync;
var Storage = require("./dbs/storage");
var nEw = require("pid-async-class").nEw;
var fs = require("fs");
var path = require("path");

class Installer extends PromptAsync{
  constructor(appName, questions, configLocation, installDir){
    super();
    this.appName = appName;
    this.questions = questions;
    this.configLocation = configLocation;
    this.installDir = installDir;
    this.storage = null;
    this.connectionString = null;
    this.answers = {};
  }

  async install(){

    if(this.configLocation !== "local"){
      this.connectionString = await this.prompt("Please Enter Connection String for config database");
    }
    for(var i in this.questions){
      var key = this.questions[i].key;
      var question = this.questions[i].question;
      var silent = this.questions[i].hideAnswer || false;
      var replace = undefined;
      if(silent){
        replace = "*"
      }
      this.answers[key] = await this.prompt(question, silent, replace);
    }
    this.storage = await nEw(Storage, this.connectionString || "local-config");
    
    var doc = this.formDocument();
    await this.storage.upsert(this.appName, doc);
    var configuratorCode = this._constructConfigurator();
    fs.writeFileSync(this.installDir + "/configurator.js", configuratorCode);
  }

  formDocument(){
    var doc = {
      _id: this.appName
    }

    for(var i in this.answers){
      doc[i] = this.answers[i]
    }

    return doc;
  }

  _constructConfigurator(){
    var StorageFile = fs.readFileSync(path.join(__dirname, "./dbs/storage.js"), "utf8");
    StorageFile = StorageFile.replace("config;", this.connectionString || "\"local-config\"");
    StorageFile = StorageFile.replace("module.exports = Storage;", "");
    var ConfiguratorFile = fs.readFileSync(path.join(__dirname, "./configurator.js"), "utf8");
    ConfiguratorFile = ConfiguratorFile.replace('replaceMe', this.appName);
    return StorageFile + "\n\n" + ConfiguratorFile;
  }

}

module.exports = Installer;
