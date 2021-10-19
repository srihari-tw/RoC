'use strict';

const express = require("express");

const PORT = 8000;
const HOST = '0.0.0.0';

const app = express();
const os = require('os');
const hostname = os.hostname;

app.get('/', (req,res)=>{
    res.send('Hello world from docker container!<br/>' + hostname);
});

app.listen(PORT,HOST);
console.log(`running on http://${HOST}:${PORT}`)