const router = require('express').Router();

router.use('/scrape', require('./scrapper.routes'));
router.use('/company', require('./company.routes'));

module.exports = router;