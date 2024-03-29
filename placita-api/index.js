// index.js
// Description: Main entry point for the placita-api application.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const oracledb = require('oracledb');
const usersRouter = require('./routes/users');

class dbInterface {
    constructor(port, db_user, db_password, db_connection_string, OracleDB) {
        this.port = port;
        this.db_user = db_user;
        this.db_password = db_password;
        this.db_connection_string = db_connection_string;
        this.OracleDB = OracleDB;
        this.connection = null;
    }    
    async connect() {
        try {
            console.log("conectando a la base de datos...");
            this.connection = await this.OracleDB.getConnection({
                user: this.db_user,
                password: this.db_password,
                connectString: this.db_connection_string
            });
            return this.connection;
        } catch (err) {
            console.error(err);
        }
    }
    async close() {
        try {
            await this.connection.close();
        } catch (err) {
            console.error(err);
        }
    }    
}



const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER || 'demoplacita';
const DB_PASSWORD = process.env.DB_PASSWORD || 'oracle';
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'localhost:1521/xe';

const app = express();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.db = new dbInterface(PORT, DB_USER, DB_PASSWORD, DB_CONNECTION_STRING, oracledb);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/users', usersRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
