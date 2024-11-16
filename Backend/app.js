const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
//middlewares

app.use(express.json());

//cookies
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5000","https://ocms.vercel.app"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//morgan middleware
app.use(morgan("tiny"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require("./routes/user");
const delivery = require("./routes/delivery");
const count = require("./routes/count");
//middleware routes
app.use("/api/v1", user);
app.use("/api/v1", delivery);
app.use("/api/v1", count);

module.exports = app;
