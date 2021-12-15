// Importing module
var mysql = require('mysql');
const cors = require('cors');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();

var conn = mysql.createConnection({
  host:"localhost",
  user:"yuri",
  password:"12345678",
  database : "scraper"
});

function selectLines(search){
  return new Promise((resolve, reject) => {
    console.log("Database Connected");
    console.log("Search: ", search);

    conn.query("SELECT * FROM linhas WHERE numero LIKE '%"+search+"%' OR locais LIKE '%"+search+"%';", function (err, result) {
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
    res.json(lines.map(item => ({"numero": item.numero, "locais": item.locais})));
  });
});

app.listen(9001, '0.0.0.0', function() {
  console.log('Listening on port 9001');
});