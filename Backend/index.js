require("dotenv").config();

const connectwithDB = require("./config/db");
const app = require("./app");

//connect MongoDB
connectwithDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
