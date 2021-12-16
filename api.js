// Importing module
const cors = require('cors');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();

const { Client } = require('pg');
var connectionString = "";
const client = new Client({
    connectionString: connectionString
});
client.connect();

function selectLines(search){
  return new Promise((resolve, reject) => {
    console.log("Database Connected");
    console.log("Search: ", search);

    client.query("SELECT * FROM linhas WHERE numero LIKE '%"+search+"%' OR locais LIKE '%"+search+"%';", function (err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/linhas/:search", function(req, res) {
  var search = req.params.search;
  selectLines(search).then((lines) => {
    res.json(lines.rows.map(item => ({"numero": item.numero, "locais": item.locais})));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
