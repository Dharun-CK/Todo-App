const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb+srv://dharunitguy:GlDgfDqA7FeopEv2@cluster0.lkuvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Use .env for security
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connect() {
  if (!database) {
    await client.connect();
    database = client.db("office"); // Replace with your actual database name
    console.log("Connected to MongoDB Atlas");
  }
  return database;
}

async function getDatabase() {
  return await connect();
}

module.exports = { getDatabase, ObjectId };
