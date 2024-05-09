// index.js
// Description: Main entry point for the placita-api application.
import { Express, Request, Response } from "express";
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const municipiosRouter = require('./routes/municipios');
const ofertasRouter = require('./routes/ofertas');

const PORT = process.env.PORT || '3000';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/users', usersRouter);
app.use('/municipios', municipiosRouter);
app.use('/ofertas', ofertasRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
