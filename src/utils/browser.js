const { chromium } = require('playwright');

class BrowserController {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async launch(headless = false) {
    this.browser = await chromium.launch({ headless, slowMo: 300 });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async type(selector, text) {
    await this.page.fill(selector, text);
  }

  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  async moveMouse(x, y) {
    await this.page.mouse.move(x, y);
  }

  async getPage() {
    return this.page;
  }

  async close() {
    await this.browser.close();
    this.browser = null;
    this.page = null;
  }
}

module.exports = BrowserController;
