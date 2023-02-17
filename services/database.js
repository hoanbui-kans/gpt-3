import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
});

connection.connect(function(err) {
    if (err) throw(err);
        console.log("Connected!");
});

export default connection