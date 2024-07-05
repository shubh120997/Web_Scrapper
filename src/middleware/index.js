const scrapMiddleware = require('./scrapper.middleware');
const companyMiddleware = require('./company.middleware');

module.exports = {
  ...scrapMiddleware,
  ...companyMiddleware
}