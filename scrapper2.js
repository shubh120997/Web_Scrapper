// index.js

const cheerio = require("cheerio")
const axios = require("axios")

async function performScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const url = 'https://www.netflix.com/in/';
    // const url = 'https://brightdata.com';

    const axiosResponse = await axios.request({
        method: "GET",
        url,
    //     headers: {
    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    //     }
    });

    const $ = cheerio.load(axiosResponse.data)
    console.log($);
    const htmlElement = $(".elementClass")
    console.log(htmlElement);
}

performScraping();

// parsing the HTML source of the target web page with Cheerio
