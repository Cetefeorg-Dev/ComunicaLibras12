import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://play.google.com/store/search?q=VLibras&c=apps', { waitUntil: 'networkidle2' });
  const hrefs = await page.$$eval('a', anchors => anchors.map(a => a.href));
  const packageHrefs = hrefs.filter(h => h.includes('/apps/details?id='));
  console.log(packageHrefs.slice(0, 5));
  await browser.close();
})();
