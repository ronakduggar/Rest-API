const express = require("express");
const app = express();
const fs = require("fs");
const users = require("./mock_data.json");
const mongoose = require("mongoose");
const { type } = require("os");

const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/teachersdb")
  .then(() => console.log("Connected"))
  .catch((err) => console.log("MOngoDB error", err));

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
  }
});

const User = mongoose.model("user", userSchema);

//Middleware -
app.use(express.urlencoded({ extended: false }));


app.use((err, req, res, next) => {
  console.log("Hello from MIddleware 1");
  req.myName = "ROnak";
  next();
});

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

//Routes
app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app
  .route("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    return res.json({ status: "Yet to be Done." });
  })
  .delete((req, res) => {
    return res.json({ status: "Yet to be Done." });
  });

app.post("/api/users", async(req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender
  ){return res.status(400).json({msg: "All fields are required"})}

 const result =  await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
  })

  console.log("Result :", result);
  return res.status(201).json({msg: "user aa gaya"});
  //   users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./mock_data.json", JSON.stringify(users), (err, data) => {
  //   return res.json({ status: "Successfully user Added" });
  // });
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
