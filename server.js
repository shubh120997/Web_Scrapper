const express = require('express');
const config = require('./src/config/config');
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConn } = require('./src/config/database');
const scrapeData = require('./scrapper');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/scrape", scrapeData);
app.use("/api", require('./src/routes'));

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});