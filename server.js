const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "frontend/build")));

mongoose.connect(
  "mongodb+srv://admin:root@cluster0.915yr.mongodb.net/books?retryWrites=true&w=majority", 
  { useNewUrlParser: true, useUnifiedTopology: true }, error => {
    console.log(error);
});

mongoose.connection.on("open", () => {
  console.log("Connected to database!");
});

const BookSchema = mongoose.Schema({ title: "string", author: "string", description: "string" });
const Book = mongoose.model("books", BookSchema);

app.post("/api", async (req, res) => {
  const body = req.body;
  const book = new Book(body);
  await book.save(error => {
    if (error) {
      res.status(400);
      res.send("Failed to add a book to the database");
    } else {
      res.status(200);
      res.send("Successfully added book to database!");
    }
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log("Our app is running on port 3000");
});
