const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const CircularJSON = require('circular-json');
const { parse, stringify } = require('flatted');




// const url = 'https://www.primevideo.com/';
// const url = 'https://www.netflix.com/'
const url = 'https://stackoverflow.com/'
// const url = 'https://slack.com/intl/en-in/'
// const url = 'https://www.skype.com/'
// const url = 'https://www.adobe.com/'
// const url = 'https://www.airbnb.co.in/'
// const url  = 'https://brightdata.com/'
// const url = 'https://www.appventurez.com/'
// const url  = 'https://zoom.us/'

const scrapeData = async (req, res) => {
  try {
    // Fetch the HTML from the URL
    const { data } = await axios.get(url);
    let $ = cheerio.load(data);

    const siteName = $('meta[property="og:site_name"]').attr('content') ||
                     $('meta[name="application-name"]').attr('content') ||
                     $('meta[property="og:title"]').attr('content') ||
                     $('title').text();
    console.log(siteName);

    const phone_number = []
    $('a[href^="tel:"]').each((index, element) => {
      // Extract the href attribute value
      const href = $(element).attr('href');
            
      // Parse the telephone number from the href attribute
      const phoneNumber = href.replace('tel:', '').trim();
      
      console.log(phoneNumber);

  });
    console.log(phone_number);
    const address = $('[itemprop="address"]').text() || $('address').text();
    const phone = $('a[href^="tel:"]').text();
    const email = $('a[href^="mailto:"]').text();
    
    
    const htmlText = $('body').text();
    const phoneNumbers = findPhoneNumbers(htmlText);
    const emails = findEmails(htmlText);

    // return {
    //   phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : ['Phone numbers not found'],
    //   emails: emails.length > 0 ? emails : ['Emails not found'],
    // };
    
    
    
    
    
    
    
    
    const data2 = [];
    $('meta').each((i, elem) => {
      console.log(elem);
      const property = $(elem).attr('property');

      const content = $(elem).attr('content');
      data2.push({ property, content });

    });
    console.log(data2);
    return data2
    const metaData = $['meta']
    console.log(metaData[1]);
    // return $('meta');
    const name = $('meta[property="og:site_name"]').attr('content') || 'Netflix';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
    const companyLogo = $('meta[property="og:image"]').attr('content');
    // const facebookUrl = $('a[href*="facebook.com"]').attr('href');
    const linkedinUrl = $('a[href*="linkedin.com"]').attr('href');
    const twitterUrl = $('a[href*="twitter.com"]').attr('href');
    const instagramUrl = $('a[href*="instagram.com"]').attr('href');
    // const address = ''; // Netflix homepage does not have address information
    const phoneNumber = ''; // Netflix homepage does not have phone number information
    // const email = ''; // Netflix homepage does not have email information

    // Print the scraped data
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Company Logo:', companyLogo);
    console.log('Facebook URL:', facebookUrl);
    console.log('Linkedin URL:', linkedinUrl);
    console.log('Twitter URL:', twitterUrl);
    console.log('Instagram URL:', instagramUrl);
    console.log('Address:', address);
    console.log('Phone Number:', phoneNumber);
    console.log('Email:', email);

    // Take a screenshot of the homepage using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotPath = path.join(__dirname, 'homepage_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    console.log('Screenshot saved at:', screenshotPath);
  } catch (error) {
    console.error('Error scraping the website:', error);
  }
};

function findPhoneNumbers(text) {
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g;
  return text.match(phoneRegex) || [];
}

function findEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

module.exports = scrapeData;
