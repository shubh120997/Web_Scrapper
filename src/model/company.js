const { dbConn, mongoose } = require("../config/database");
const { COMPANY } = require('../constant/model_name');

const company_schema = new mongoose.Schema(
  {
    companyUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    },
    facebook: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    },
    twitter: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    screenshot: {
      type: String,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Company = dbConn.model(COMPANY, company_schema);

module.exports = Company;
