const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
let database;
const uri =
  "mongodb+srv://dharunitguy:GlDgfDqA7FeopEv2@cluster0.lkuvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function getDatabase() {
  const client = await mongoClient.connect(uri);
  database = client.db("office");

  if (!database) {
    console.log("Database Not Connected");
  }

  return database;
}
module.exports = {
  getDatabase,
  ObjectId,
};

// mongo atlas pass:GlDgfDqA7FeopEv2
// mongodb+srv://dharunitguy:<db_password>@cluster0.lkuvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
