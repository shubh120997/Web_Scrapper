const router = require('express').Router();

router.use('/company', require('./company.routes'));

module.exports = router;