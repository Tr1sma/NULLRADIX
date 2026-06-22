import puppeteer from 'puppeteer-core';

const dir = process.argv[2];
const url = 'http://localhost:4173/';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

// desktop hero with cursor near the field (show magnetic + constellation)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.mouse.move(400, 300, { steps: 12 });
  await page.mouse.move(430, 330, { steps: 8 });
  await sleep(500);
  await page.screenshot({ path: `${dir}/pp-hero-cursor.png` });
  await page.close();
}

// panel open
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('work').scrollIntoView());
  await sleep(400);
  await page.evaluate(() => document.querySelector('.open-trigger')?.click());
  await sleep(500);
  await page.screenshot({ path: `${dir}/pp-panel.png` });
  await page.close();
}

// mobile work (verify no overlapping nodes now)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('work').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: `${dir}/pp-mobile-work2.png` });
  await page.close();
}

// contact
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('contact').scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: `${dir}/pp-contact.png` });
  await page.close();
}

await browser.close();
console.log('done');
