const axios = require("axios");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('http-status');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { imageUpload } = require('../utils/aws');

const scrapWebSite = async(req, res, next) => {
  try {
    const url = req.body.url;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // fetch site name
    const site_name = fetchNameOfUrl($);

    // fetch description
    const description = fetchDescriptionOfUrl($);

    // fetch icon
    const icon = fetchIcon($);

    // fetch facebook url
    const social_urls = fetchSocialUrls($);

    // fetch contact details
    const contact_details = fetchContactDetails($);

    // screenshot of homepage
    const screenshot_path = await screenshotOfHomePageOfUrl(url);

    res.scrap_data = {
      site_name, description, icon, ...social_urls, ...contact_details, screenshot_path
    }

    next();
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      return res.status(BAD_REQUEST).json({
        status: false,
        message: "The company URL could not be scrapped. Please check the URL and try again."
      });
    }

    if (error.response && error.response.status === 403) {
      return res.status(error.response.status).json({
        status: false,
        message: "Access to the website is forbidden."
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.message
    })
  }
};

const fetchNameOfUrl = ($) => {
  try {
    const siteName = 
      $('meta[property="og:site_name"]').attr('content') || 
      $('meta[name="application-name"]').attr('content') || 
      $('meta[property="og:title"]').attr('content') ||
      $('title').text();
    if (siteName) {
      return siteName.trim();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const fetchDescriptionOfUrl = ($) => {
  try {
    const description = 
      $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
    if (description) {
      return description.trim();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

const fetchIcon = ($) => {
  try {
    const icon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href')
    if (icon) return icon.trim();
    return icon;
  } catch (error) {
    throw error;
  }
}

const fetchSocialUrls = ($) => {
  try {
    let facebook_url = null, twitter_url = null, linkedin_url = null, instagram_url = null;
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!facebook_url && href?.includes('facebook.com')) {
        facebook_url = href;
      }
      if (!twitter_url && href?.includes('twitter.com')) {
        twitter_url = href;
      }
      if (!linkedin_url && href?.includes('linkedin.com')) {
        linkedin_url = href;
      }
      if (!instagram_url && href?.includes('instagram.com')) {
        instagram_url = href;
      }
    });
    return {facebook_url, twitter_url, linkedin_url, instagram_url};
  } catch (error) {
    throw error;
  }
};

const fetchContactDetails = ($) => {
  try {
    const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '').trim() || null;
    const phone_number = $('a[href^="tel:"]').attr('href')?.replace('tel:', '').trim() || null;
    const address = $('.address').first().text()?.replace(/\n\s+/g, '').trim() || null;

    return {
      email, phone_number, address
    }
  } catch (error) {
    throw error;
  }
}

const screenshotOfHomePageOfUrl = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000*2 });
    const fileName = `${Date.now()}.png`;
    const screenshotPath = path.join(__dirname, '../', `/public/screenshot/${fileName}`);
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    // Upload screenshot to S3
    const body = fs.createReadStream(screenshotPath);
    const aws_url = await imageUpload(body, fileName);

    fs.unlink(screenshotPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting the file:', unlinkErr);
      }
    });
    return aws_url;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  scrapWebSite
}