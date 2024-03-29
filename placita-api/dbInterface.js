
export class dbInterface {
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
    async query(query) {
        try {
            const result = await this.connection.execute(query);
            return result;
        } catch (err) {
            
            console.error(err);
        }
    }
}
