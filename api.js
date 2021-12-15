// Importing module
const cors = require('cors');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();

const { Client } = require('pg');
var connectionString = "postgres://ooukloaj:8elvdmNLbJey2MaANlXY2-m6D4OPgZ3f@kesavan.db.elephantsql.com/ooukloaj";
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

// app.listen(9001, '0.0.0.0', function() {
//   console.log('Listening on port 9001');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});