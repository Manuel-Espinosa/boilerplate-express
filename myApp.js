let express = require("express");
require("dotenv").config();
let bodyParser = require("body-parser");
let app = express();

let indexPath = `${__dirname}/views/index.html`;
let publicPath = `${__dirname}/public`;

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use("/public", express.static(publicPath));
app.get("/", (req, res) => res.sendFile(indexPath));
app.get("/json", (req, res) =>
  process.env.MESSAGE_STYLE === "uppercase"
    ? res.json({ message: "HELLO JSON" })
    : res.json({ message: "Hello json" })
);

app.get(
  "/now",
  (req, res, next) => {
    next();
  },
  (req, res) => {
    const date = new Date().toString();
    res.send({ time: date });
  }
);

app.get("/:word/echo", (req, res) => res.send({ echo: req.params.word }));

const nameHandler = (req, res) => {
  req.method === "POST"
    ? res.send({ name: `${req.body.first} ${req.body.last}` })
    : res.send({ name: `${req.query.first} ${req.query.last}` });
};

app
  .route("/name")
  .get((req, res) => nameHandler(req, res))
  .post((req, res) => nameHandler(req, res));

module.exports = app;
