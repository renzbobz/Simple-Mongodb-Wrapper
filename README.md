# Simple mongodb wrapper
10/17/20

## Getting started
Install
```js
npm install simple-mongodb-wrapper
```
then require it:
```js
const mongo = require("simple-mongodb-wrapper");
```
and now its ready to use!

## Usage

**Tip: Use async/await**

#### Notice:
```js
  // You must set your mongodb connection uri
  mongo.client("YOUR_MONGDB_URI");
```

### Working with one db
```js
try {
  
  // opens db connection
  const db = await mongo.open("DBName");
  
  // select collection
  const collection = db.collection("viewers");
  
  // return all viewers
  const viewers = await collection.selectAll();
  
  /*
    # Shorthand method
    # mongo.selectAll(collectionName)
    const viewers = await mongo.selectAll("viewers");
  */

} catch(err) {
  console.log(err);
} finally {
  // to close all db connection
  mongo.close();
}
```

### Working with multiple db
```js
try {

  // opens db connection
  const db1 = await mongo.open("Db1");
  const db2 = await mongo.open("Db2");
  
  // select collection
  const users = db1.collection("users");
  const users2 = db2.collection("users");
  
  // perform commands
  await users.selectAll();
  await users2.selectAll();
  
} catch(err) {
  console.log(err);
} finally {
  mongo.close();
}
```


### Find
```js
collection.select([filter]);

collection.selectAll([filter]);
```

```js
try {

  // returns only one
  const user = await collection.select();
  
  // returns all users
  const users = await collection.selectAll();
  
  // with filters
  // returns only renz
  const renz = await collection.select({username:"renz"});
  
  // returns all online users
  const onlineUsers = await collection.selectAll({is_online:true})
  
} catch(err) {
  console.log(err);
}
```

### Insert
```js
collection.insert(<data>, [options]);

collection.insertAll(<data(array)>, [options]);
```

```js
try {

  // inserts renz
  await collection.insert({username:"renz",user_id:1});
  
  // inserts 3 users
  await collection.insertAll([
    { username: "abcd", user_id: 2 },
    { username: "efgh", user_id: 3 },
    { username: "ijkl", user_id: 4 }
  ]);
  
} catch(err) {
  console.log(err);
}
```


### Update
```js
collection.update(<filter>, <data>);

collection.updateAll(<filter>, <data>);
```

```js
try {

  const filter = { username: "renz" };
  const data = { 
    $set: {
      is_online: false
    }
  };
  
  /*
    # Shorthand method
    const data = { 
      is_online: false
    };
    # it will auto add $set
    # this will work only for $set
  */
  
  // updates renz is_online status
  await collection.update(filter, data);
  
  
  const filter2 = { is_blacklisted: true };
  const data2 = { is_blacklisted: false };
  
  // unblacklist all blacklisted user
  await collection.updateAll(filter2, data2);
  
} catch(err) {
  console.log(err);
}
```


### Delete
```js
collection.delete([filter]);

collection.deleteAll([filter]);
```

```js
try {
  
  const filter = { username: "renz" };
  
  // deletes renz
  await collection.delete(filter);
  
  const filter2 = { is_blacklisted: true };
  
  // deletes all blacklisted users
  await collection.deleteAll(filter2);
  
} catch(err) {
  console.log(err);
}
```

### Distinct
```js
collection.distinct(<field_name>, [filter]);
```

```js
try {
  
  await collection.distinct(fieldName, filter);
 
} catch(err) {
  console.log(err);
}
```

### Count
```js
collection.count([filter]);
```

```js
try {
  
  const totalUsers = await collection.count();
  
  // with filter
  const filter = { is_online: true };
  const totalOnlineUsers = await collection.count(filter);
  
} catch(err) {
  console.log(err);
}
```


### Auto increment ID
```js
mongo.getNextSequence(<counter_name>);
```

#### Notice: This will create "counters" collection

```js
try {

  const userId = await mongo.getNextSequence("userId");
  
  await collection.insert({
    username: "doe",
    user_id: userId
  });
  
} catch(err) {
  console.log(err);
}
```




