const path = require('path');
const BrowserController = require('../utils/browser');
const AccessibilityScanner = require('../utils/axe');

(async () => {
  const browser = new BrowserController();
  await browser.launch(); // headless — no window needed for a scan

  const url = 'file://' + path.resolve(__dirname, '../../stage1_ideation/demo_page.html');
  await browser.navigate(url);
  console.log('Page loaded, running axe scan...\n');

  const scanner = new AccessibilityScanner(browser);
  const results = await scanner.scan();

  console.log(`Passes:      ${results.passes}`);
  console.log(`Incomplete:  ${results.incomplete}`);
  console.log(`Inapplicable:${results.inapplicable}`);
  console.log(`Violations:  ${results.violations.length}\n`);

  if (results.violations.length === 0) {
    console.log('No violations found.');
  } else {
    results.violations.forEach((v, i) => {
      console.log(`[${i + 1}] ${v.id} (${v.impact})`);
      console.log(`    ${v.description}`);
      console.log(`    ${v.helpUrl}`);
      v.nodes.forEach(n => {
        console.log(`    Element: ${n.html.slice(0, 100)}`);
        console.log(`    Fix:     ${n.failureSummary}`);
      });
      console.log();
    });
  }

  await browser.close();
})();
