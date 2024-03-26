const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

router.get("/", (req, res) => {
    const users = req.app;
});