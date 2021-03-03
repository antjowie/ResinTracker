const puppeteer = require("puppeteer");

const getTime = async (time) => {
    let url = "https://www.starts-at.com/e/?t="+time;
    // url = encodeURI(url);
    console.log("URL " + url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage(url);
    await page.emulateTimezone("Europe/Amsterdam");
    await page.goto(url);

    const text = await page.evaluate(() => {
        const tag = document.querySelector("#big_datetime_display");
        return tag.innerHTML;
    });

    browser.close();
    // text = )
    return text.trim() ? text.replace("<br>", " ") : "Could not parse time. Examples: \n" +
    "8 UTC\n" +
    "Tomorrow 9 EST\n" +
    "August 13 2020 at 11am PDT";
};

module.exports = getTime;

if (require.main !== module) return;
const test = async () => {
    console.log(await getTime("10UTC"));
    console.log(await getTime("Tomorrow 9 EST"));
};
test();
