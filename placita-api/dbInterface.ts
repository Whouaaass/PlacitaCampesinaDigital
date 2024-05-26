const oracledb = require('oracledb');

// interface to connect to the database in the other modules || Interface only used here
class dbInterface {    
    constructor(        
        private db_user: string,
        private db_password: string,
        private db_connection_string: string,
        private OracleDB: any,
        
    ) {}
    async connect() {
        try {
            console.log("conectando a la base de datos...");
            const connection = await this.OracleDB.getConnection({
                user: this.db_user,
                password: this.db_password,
                connectString: this.db_connection_string
            });
            return connection;
        } catch (err) {
            console.error(err);
        }
    } 
}

const DB_USER = process.env.DB_USER || 'demoplacita';
const DB_PASSWORD = process.env.DB_PASSWORD || 'oracle';
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'localhost:1521/xe';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const db = new dbInterface(DB_USER, DB_PASSWORD, DB_CONNECTION_STRING, oracledb);

module.exports = db;