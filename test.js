var ins = require("./index");

(async function(){
  await ins("testApp", 1, [{question:"Is this a test?: ", key:"isTest"}], "local");
  var nEw = require("pid-async-class").nEw;
  var Configurator = require("./configurator");
  var con = await nEw(Configurator);
  console.log(await con.getConfiguration())
})();
