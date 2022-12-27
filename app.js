const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const date = require(__dirname + "/date.js");

mongoose.set("strictQuery", false);

const app = express();
// let items = [];
// let workItems = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect(
  "mongodb+srv://hembee:hasagbar@cluster0.pv5xecn.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

// Schemas
const itemsSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

// Collections
const Item = mongoose.model("item", itemsSchema);
const List = mongoose.model("list", listSchema);

const item1 = new Item({
  name: "Welcome to your Todolist",
});
const item2 = new Item({
  name: "Hit the + button to add item ",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item ",
});

const defaultItems = [item1, item2, item3];

// Get request
app.get("/", (req, res) => {
  // let day = date();

  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfuly Inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });
});

// express params

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// post requests

app.post("/", (req, res) => {
  // let item = req.body.newItem;
  // if (req.body.list === "Work" && req.body.newItem !== "") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else if (req.body.newItem !== "") {
  //   items.push(item);
  //   res.redirect("/");
  // } else {
  //   res.redirect("/");
  // }

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });


    item.save();
    res.redirect("/");
  
  // else {
  //   List.findOne({ name: listName }, (err, foundList) => {
  //     if (!err) {
  //       foundList.items.push(item);
  //       foundList.save();
  //       res.redirect("/" + listName);
  //     }
  //   });
  // }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully Deleted one Item");
    }
    res.redirect("/");
  });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

// app.post("/", (req, res) => {
//   let remove = req.body.removeItem;
//   items.pop(remove);
//   res.redirect("/");
// });

app.listen(3000, () => {
  console.log("Server is running!!!");
});
