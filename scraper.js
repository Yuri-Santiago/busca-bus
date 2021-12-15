const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://moovitapp.com/index/pt-br/transporte_p%C3%BAblico-lines-Fortaleza-983-9809';
const { Client } = require('pg');

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
  var connectionString = "postgres://ooukloaj:8elvdmNLbJey2MaANlXY2-m6D4OPgZ3f@kesavan.db.elephantsql.com/ooukloaj";
  const client = new Client({
      connectionString: connectionString
  });
  client.connect();
  console.log("Database Connected!");
  console.log("Inserting Data");

  lines.forEach(line => {
    let number = line.slice(0, 3);
    let places = line.slice(4);
    var sql = "INSERT INTO linhas (numero, locais) VALUES ('"+number+"', '"+places+"')";
    client.query(sql, function (err, result) {
      if (err) throw err;
      console.log("line inserted.");
      console.log(result);
    });
  });
}

getLines().then((lines) => {
  insertLines(lines);
});
