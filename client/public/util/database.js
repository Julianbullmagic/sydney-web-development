const mysql = require('mysql2');

const config = require('../config/config.json');

var pool

createconn()
function createconn(){
  pool=mysql.createPool(`mysql://bd603eb6dfd5cd:5d409dee@us-cdbr-east-04.cleardb.com/heroku_955146f8da20aaa?reconnect=true`)
  pool.on('error', createconn)

}

module.exports = pool.promise();
