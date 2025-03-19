const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const exhbs = require("express-handlebars");
const dbo = require("./db");
const { Collection } = require("mongodb");
const { redirect, status } = require("express/lib/response");
const urlencoded = require("body-parser/lib/types/urlencoded");
const ObjectId = dbo.ObjectId;
app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "index", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");

//app.use(bodyParser, bodyparser.urlencoded({ extended }));
app.use(bodyparser.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("movie");
  const cursor = collection.find();
  let employees = await cursor.toArray();
  let message = "";
  let edit_id, edit_book, delete_id;

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_book = await collection.findOne({ _id: new ObjectId(edit_id) });
  }
  if (req.query.delete_id) {
    delete_id = req.query.delete_id;
    await collection.deleteOne({ _id: new ObjectId(delete_id) });
    return res.redirect("/?status=3");
  }

  switch (req.query.status) {
    case "1":
      message = "Inserted Successfully";
      break;
    case "2":
      message = "Updated Successfully";
      break;

    case "3":
      message = "Deleted Successfully";
      break;

    default:
      break;
  }

  res.render("main", {
    message,
    employees,
    edit_id,
    edit_book,
    delete_id,
  });
});

app.post("/store_book", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("movie");
  let book = { title: req.body.title, author: req.body.author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});

app.post("/update_book/:edit_id", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("movie");
  let book = { title: req.body.title, author: req.body.author };
  let edit_id = req.params.edit_id;

  await collection.updateOne({ _id: new ObjectId(edit_id) }, { $set: book });
  return res.redirect("/?status=2");
});

app.listen(8002, () => console.log("Listening to 8002 Port"));
