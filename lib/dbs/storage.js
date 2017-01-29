var PouchDB = require("pouchdb");
var BaseAsync = require("pid-async-class").BaseAsync;

class Storage extends BaseAsync{
  constructor(config){
    super();
    this.config = config; //Dont Change this line
    this.__PouchDB = PouchDB;
    this.db = null;
  }

  _initialize(){
    if(this.db === null);
      this.db = new PouchDB(this.config);
  }

  async upsert(id, newDoc){
    this._initialize();
    var [status, doc] = await this.aPass(["get", id]);
    if(status !== "OK" || doc === null){
      return await this.insert(id, newDoc);
      return;
    } else {
      return await this.overwrite(doc._id, doc._rev, newDoc)
    }
  }

  async update(id, deltaAdds, deltaSub){
    this._initialize();
    var doc = await this.get(id);

    for(var i in deltaAdds){
      doc[i] = deltaAdds[i];
    }
    for(var i in deltaSub){
      delete doc[i]
    }

    return await this.db.put(doc)
  }

  async overwrite(id, rev, doc){
    this._initialize();
    var cpDoc = {};
    for(var i in doc){
      cpDoc[i] = doc[i];
    }
    cpDoc._rev = rev;
    cpDoc._id = id;
    return await this.db.put(cpDoc);
  }

  async insert(id, doc){
    this._initialize();
    var cpDoc = {};
    for(var i in doc){
      cpDoc[i] = doc[i];
    }
    cpDoc._id = id;
    return await this.db.put(cpDoc);
  }

  async get(id){
    this._initialize();
    return await this.db.get(id)
  }

  async allDocs(options){
    options = options || {};
    this._initialize();
    if(options.include_docs !== false){
      options.include_docs = true;
    }
    return await this.db.allDocs(options);
  }

  async delete(id){
    this._initialize();
    var doc = await this.get(id);
    doc._deleted = true;
    return await this.db.put(doc);
  }

}

module.exports = Storage;
