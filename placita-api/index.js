// index.js
// Description: Main entry point for the placita-api application.
import { dbInterface } from './dbInterface.js';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const oracledb = require('oracledb');

const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

const app = express();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.db = new dbInterface(PORT, DB_USER, DB_PASSWORD, DB_CONNECTION_STRING, oracledb);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));