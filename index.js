const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/payment.routes")(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
