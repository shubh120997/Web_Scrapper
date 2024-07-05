const router = require('express').Router();
const { scrapWebSite, isWebsiteScrapped, isCompanyExist } = require('../middleware');
const controller = require('../controller/company.controller');

router.post('/url', isWebsiteScrapped, scrapWebSite, controller.saveCompanyDetails);
router.get('/list', controller.getAllCompanies);
router.get('/csv', controller.exportCompaniesToCsv);
router.delete('/:id', isCompanyExist, controller.deleteCompanies);
router.get('/:id', controller.getCompanyDetails);
module.exports = router;