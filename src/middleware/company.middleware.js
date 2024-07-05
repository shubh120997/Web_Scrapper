const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const { CompanyModel } = require('../model');
const { Types } = require('mongoose');

const isWebsiteScrapped = async(req, res, next) => {
  try {
    const url = req.body.url;
    if (!url) {
      return res.status(BAD_REQUEST).json({
        status: false,
        message: "Please input a webiste url to scrap."
      });
    }
    const condition = { companyUrl: url };
    const projection = { _id: 1, isDeleted: 1, screenshot: 1 };
    const isCompanyFound = await CompanyModel.findOne(condition, projection).lean();

    res.companyDetails = isCompanyFound;
    next();
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
};

const isCompanyExist = async(req, res, next) => {
  try {
    const ids = req.body.ids;
    if (!ids || ids.length === 0) {
      return res.status(BAD_REQUEST).json({
        status: false,
        message: "Company id is required."
      });
    } else if (!ids.every(id => Types.ObjectId.isValid(id))) {
      return res.status(BAD_REQUEST).json({
        status: false,
        message: "Company id is not a valid mongoose id."
      });
    } else {
      const foundCompanies = await CompanyModel.find({ _id: { $in: ids } }, {_id: 1}).lean();
      const foundIds = foundCompanies.map(company => company._id.toString());
      const missingIds = ids.filter(id => !foundIds.includes(id.toString()));
      if(missingIds?.length > 0) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "Company ids is not exists.",
          data: missingIds
        });
      }
      next();
    }
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
}

module.exports = {
  isWebsiteScrapped,
  isCompanyExist
}