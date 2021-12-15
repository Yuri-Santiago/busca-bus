const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://moovitapp.com/index/pt-br/transporte_p%C3%BAblico-lines-Fortaleza-983-9809';
var mysql = require('mysql');

function getLines(){
  return new Promise((resolve, reject) =>{
    axios(url).then(response => {
      const html = response.data;
      const $ = cheerio.load(html)
      const linesString = $('.line-title-wrapper').text();
      var lines = [];
      linesString.split("\n").forEach(element => {
        if(element.trim() != ""){
          lines.push(element.trim());
        }
      });
      resolve(lines);
    }).catch(console.error);
  });
}

function insertLines(lines){
  var conn = mysql.createConnection({
    host: "localhost",
    user: "yuri",
    password: "12345678",
    database: "scraper"
  });

  conn.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");

    lines.forEach(line => {
      let number = line.slice(0, 3);
      let places = line.slice(4);
      var sql = "INSERT INTO linhas (numero, locais) VALUES ('"+number+"', '"+places+"')";
      conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted.");
        console.log(result);
      });
    });
  });
}

getLines().then((lines) => {
  insertLines(lines);
});

// USE scraper;
// CREATE TABLE IF NOT EXISTS linhas 
// (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
// numero VARCHAR(3) NOT NULL, 
// locais VARCHAR(100) NOT NULL);