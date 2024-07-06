const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = require('http-status');
const { CompanyModel } = require('../model');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const saveCompanyDetails = async(req, res) => {
  try {
    const { site_name, description, icon, facebook_url, twitter_url, linkedin_url, instagram_url, email, phone_number, address, screenshot_path } = res.scrap_data;
    const payload = {
      companyUrl: req.body.url,
      name: site_name,
      description: description,
      logo: icon,
      facebook: facebook_url,
      linkedin: linkedin_url,
      twitter: twitter_url,
      instagram: instagram_url,
      address: address,
      phone: phone_number,
      email: email,
      screenshot: screenshot_path,
      isDeleted: false
    }

    let company;
    if (res.companyDetails) {
      fs.unlink(res.companyDetails.screenshot, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting the file:', unlinkErr);
        }
      });
      const condition = { _id: res.companyDetails._id };
      const options = { new: true, lean: true };
      company = await CompanyModel.findOneAndUpdate(condition, { $set: payload }, options);
    } else {
      company = await new CompanyModel(payload).save();
    }
    
    return res.status(OK).json({
      status: true,
      message: 'Company details fetched successfully.',
      data: company
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const projection = { isDeleted: 0, createdAt: 0 };
    
    const condition = { isDeleted: false };
    const count = await CompanyModel.countDocuments(condition);
    const totalPages = Math.ceil(count / limit);

    const rows = await CompanyModel.find(condition, projection).skip(skip)
    .limit(limit).sort({ updatedAt: -1 }).lean();

    if (rows.length === 0) {
      return res.status(OK).json({
        status: true,
        message: 'No data found',
        data: {
          count,
          totalPages,
          currentPage: page,
          rows
        }
      });
    }
    return res.status(OK).json({
      status: true,
      message: 'Company list fetched successfully.',
      data: {
        count,
        totalPages,
        currentPage: page,
        rows
      }
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
};

const exportCompaniesToCsv = async (req, res) => {
  try {
    const projection = { _id: 0, isDeleted: 0, createdAt: 0 }
    const companies = await CompanyModel.find({isDeleted: false}, projection).sort({ updatedAt: -1 }).lean();

    const csvData = companies.map((company, index) => ({
      index: index + 1,
      ...company
    }));

    const filename = `${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../', `/public/csv/${filename}`);

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'index', title: 'S.No' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'logo', title: 'Logo' },
        { id: 'facebook', title: 'Facebook' },
        { id: 'linkedin', title: 'LinkedIn' },
        { id: 'twitter', title: 'Twitter' },
        { id: 'instagram', title: 'Instagram' },
        { id: 'address', title: 'Address' },
        { id: 'phone', title: 'Phone' },
        { id: 'email', title: 'Email' },
        { id: 'screenshot', title: 'Screenshot' },
      ]
    });

    await csvWriter.writeRecords(csvData);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file');
      } else {
        // Delete the CSV file after download
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting the file:', unlinkErr);
          }
        });
      }
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
};

const deleteCompanies = async (req, res) => {
  try {
    await CompanyModel.updateMany(
      { _id: { $in: req.body.ids } },
      { $set: { isDeleted: true } }
    );
    return res.status(OK).json({
      status: true,
      message: 'Company deleted successfully.'
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
};

const getCompanyDetails = async (req, res) => {
  try {
    const condition = {
      _id: req.params.id,
      isDeleted: false
    }
    const projection = { createdAt: 0, updatedAt: 0, isDeleted: 0 };

    const company = await CompanyModel.findOne(condition, projection).lean();

    if (!company) {
      return res.status(NOT_FOUND).json({
        status: true,
        message: 'Company details not found.',
      });
    }
    return res.status(OK).json({
      status: true,
      message: 'Company details fetched successfully.',
      data: company
    });
  } catch (error) {
    console.log("🚀 ~ getCompanyDetails ~ error:", error)
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong'
    });
  }
}

module.exports = {
  saveCompanyDetails,
  getAllCompanies,
  exportCompaniesToCsv,
  deleteCompanies,
  getCompanyDetails
}