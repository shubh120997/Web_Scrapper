const router = require("express").Router();
const scrapeData = require("../../scrapper");
const controller = require('../controller/scrapper.controller');

router.post('/url', controller.scrapWebSite);
router.post('/', scrapeData);

module.exports = router;