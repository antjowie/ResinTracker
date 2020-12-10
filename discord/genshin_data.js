const puppeteer = require("puppeteer");

// Returns the following object
// {
//     "chars": {
//         "keqing": {
//             "talent": "book1"
//         }
//     }
//     "talents": {
//         "book1": 0,
//         "book1": 1
//     },
// }

const getGenshinDatabase = async () => {
    // Scrape website
    const url = "https://genshin.gg/farming";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // page.on("console", (msg) => console.log("PAGE ", msg.text()));

    await page.goto(url);
    
    // Create books array
    const db = await page.evaluate(() => {
        let db = {"chars": {}, "talents": {}};

        // const selector = "#root > div > section > div.row > main > div:nth-child(4) > div > div.rt-table > div.rt-tbody > div:nth-child(1)"
        const selector =
            "#root > div > section > div.row > main > div:nth-child(4) > div > div.rt-table > div.rt-tbody > div";

        // Iterate over each row of the site
        document.querySelectorAll(selector).forEach((row) => {
            // Temp vars that keep updating in the loop
            let talent;
            let day;
            let chars = [];
            let eof = false;

            // Iterate over each column in a row
            row.querySelectorAll("div.rt-td").forEach((elem, column) => {
                if (column === 0) {
                    // console.log(`Book ${elem.innerText}`);
                    talent = elem.innerText;
                } else if (column === 1) {
                    // console.log(`Days ${elem.innerText}`);
                    day = elem.innerText;
                    if (day.startsWith("Monday")) day = 0;
                    else if (day.startsWith("Tuesday")) day = 1;
                    else if (day.startsWith("Wednesday")) day = 2;
                    else return (eof = true);
                } else if (column === 2) {
                    elem.children.forEach((a) => {
                        chars.push(a.querySelector("h2").innerText);
                    });
                    // console.log(`Characters ${chars}`);
                }
            });

            // If we don't have a standard date anymore, we return
            if (eof) return;

            // Add current row to the character database
            chars.forEach((name) => {
                db.chars[name] = {"talent": talent};
            })

            // Add current row to talent database
            db.talents[talent] = day;
        });
        
        return db;
    });

    await browser.close();
    // console.log(data);
    return db;
};

module.exports = getGenshinDatabase;