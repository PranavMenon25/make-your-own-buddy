const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  const url = 'file://' + path.resolve(__dirname, 'demo_page.html');
  await page.goto(url);
  console.log('Opened demo page');

  // Move mouse to the form heading
  await page.mouse.move(300, 200);
  console.log('Mouse moved to form area');

  // Fill in the form using mouse clicks + typing
  await page.click('#name');
  await page.type('#name', 'Jane Smith');
  console.log('Typed name');

  await page.click('#amount');
  await page.type('#amount', '42.50');
  console.log('Typed amount');

  await page.selectOption('#category', 'travel');
  console.log('Selected category');

  await page.click('#description');
  await page.type('#description', 'Train ticket to London');
  console.log('Typed description');

  // Submit with keyboard — Tab to button then Enter
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  console.log('Submitted form via keyboard');

  // Wait so you can see the result
  await page.waitForTimeout(3000);
  await browser.close();
  console.log('Done');
})();
