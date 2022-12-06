const puppeteer = require("puppeteer-extra");
const { executablePath } = require("puppeteer");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  page.on("console", async (msg) => {
    console.log("msg.text()", msg.text());
  });

  const getResult = async (jobSectors) => {
    const results = await Promise.all(
      [1, 2].map(async (i) => {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await page.goto("https://www.google.com/", {
              waitUntil: "networkidle2",
            });
            const result = await page.evaluate(() => {
              return i;
            });
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
        return promise;
      })
    );

    return results;
  };
  try {
    console.log(await getResult());
  } catch (err) {
    console.log("OKOKOK", err.message);
  }

  setTimeout(async () => {
    await browser.close();
  }, 3000);
})();
