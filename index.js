
/*
  Github: renzbobz
  10/17/20
*/

const { MongoClient } = require("mongodb");

module.exports = {
  
  database: null,
  
  mongodb_uri: null,
  
  mongodb_client: null,
  
  client: function(mongodb_uri) {
    this.mongodb_uri = mongodb_uri;
    const c = new MongoClient(this.mongodb_uri, { useUnifiedTopology: true });
    this.mongodb_client = c;
    return c;
  },
  
  open: function(dbName, callback) {
  
    return new Promise(async (resolve, reject) => {
  
      try {
        
        const _this = module.exports;
        
        const methods = {
          collection: (c) => {
            return {
              select: (query)              => _this.select(c, query),
              selectAll: (query)           => _this.selectAll(c, query),
              insert: (data, options)      => _this.insert(c, data, options),
              insertAll: (data, options)   => _this.insertAll(c, data, options),
              update: (query, data)        => _this.update(c, query, data),
              updateAll: (query, data)     => _this.updateAll(c, query, data),
              delete: (query)              => _this.delete(c, query),
              deleteAll: (query)           => _this.deleteAll(c, query),
              distinct: (fieldName, query) => _this.distinct(c, fieldName, query),
              count: (query)               => _this.count(c, query)
            };
          }
        };
        
        await _this.mongodb_client.connect();
        
        _this.database = _this.mongodb_client.db(dbName);
        
        resolve(methods);
        
        if (callback) callback(null, methods);
        
      } catch(err) {
        
        reject(err);
        if (callback) callback(err);
        console.error("Failed to connect to database !");
        throw new Error(err);
        
      }
  
    });
  
  },
  
  close: async function() {
    try {
      await this.mongodb_client.close();
    } catch(err) {
      console.error("Failed to close database");
      throw new Error(err);
    }
  },
  
  
  select: function(collectionName, query={}) {
    return this.database.collection(collectionName).findOne(query);
  },
  
  
  selectAll: function(collectionName, query={}) {
    return this.database.collection(collectionName).find(query).toArray();
  },
    
    
  delete: function(collectionName, query) {
    return this.database.collection(collectionName).deleteOne(query);
  },
  

  deleteAll: function(collectionName, query) {
    return this.database.collection(collectionName).deleteMany(query);
  },
  

  insert: function(collectionName, query, options) {
    return this.database.collection(collectionName).insertOne(query, options);
  },
    
    
  insertAll: function(collectionName, query, options) {
    return this.database.collection(collectionName).insertMany(query, options);
  },
  
  
  update: function(collectionName, query, data) {
    return this.database.collection(collectionName).updateOne(query, data);
  },
  
  
  updateAll: function(collectionName, query, data) {
    return this.database.collection(collectionName).updateMany(query, data);
  },
  
  
  distinct: function(collectionName, fieldName, query) {
    return this.database.collection(collectionName).distinct(fieldName, query);
  },
  
  count: function(collectionName, query) {
    const c = this.database.collection(collectionName);
    return query ?
        c.countDocuments(query)
      :
        c.estimatedDocumentCount();
  },
    
  
  getNextSequence: async function(name) {
    const res = await this.database.collection("counters").findOneAndUpdate(
        {
          _id: name
        },
        {
          $inc: { 
            seq: 1 
          } 
        }
    );
    return res.value.seq;
  }
  
  
};
  





