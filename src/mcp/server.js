const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const path = require('path');
const BrowserController = require('../utils/browser');
const AccessibilityScanner = require('../utils/axe');
const Schemas = require('./schemas');

const server = new McpServer({ name: 'accessflow', version: '1.0.0' });
const browser = new BrowserController();
let launched = false;

function toToolResult(data) {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

async function ensureBrowser() {
  if (!launched) {
    await browser.launch(true);
    launched = true;
  }
}

server.registerTool('navigate', {
  description: 'Navigate the browser to a URL',
  inputSchema: Schemas.input.navigate,
  outputSchema: Schemas.output.navigate,
  annotations: {
    readOnlyHint: false,
    idempotentHint: true,   // same URL always lands on the same page
    destructiveHint: false,
    openWorldHint: true,
  },
}, async ({ url }) => {
  await ensureBrowser();
  await browser.navigate(url);
  return toToolResult({ url, message: `Navigated to ${url}` });
});

server.registerTool('keyboard_workflow', {
  description: 'Execute a sequence of keyboard and interaction steps on the current page',
  inputSchema: Schemas.input.keyboardWorkflow,
  outputSchema: Schemas.output.keyboardWorkflow,
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,  // replaying steps could re-submit forms or change state
    destructiveHint: true,
    openWorldHint: true,
  },
}, async ({ steps }) => {
  await ensureBrowser();
  const page = await browser.getPage();
  const results = [];

  for (const step of steps) {
    try {
      switch (step.action) {
        case 'tab':
          await browser.pressKey('Tab');
          break;
        case 'press':
          await browser.pressKey(step.value);
          break;
        case 'type':
          await page.keyboard.type(step.value);
          break;
        case 'click':
          await browser.click(step.value);
          break;
      }
      results.push({ action: step.action, value: step.value, status: 'ok' });
    } catch (err) {
      results.push({ action: step.action, value: step.value, status: 'error', error: err.message });
    }
  }

  return toToolResult({ results });
});

server.registerTool('run_accessibility_scan', {
  description: 'Run an axe-core accessibility scan on the current page and return structured results',
  inputSchema: Schemas.input.runScan,
  outputSchema: Schemas.output.runScan,
  annotations: {
    readOnlyHint: true,     // scan never modifies the page
    idempotentHint: true,   // same page always produces the same results
    destructiveHint: false,
    openWorldHint: false,
  },
}, async () => {
  await ensureBrowser();
  const scanner = new AccessibilityScanner(browser);
  const results = await scanner.scan();
  return toToolResult(results);
});

server.registerTool('take_screenshot', {
  description: 'Take a full-page screenshot of the current page',
  inputSchema: Schemas.input.takeScreenshot,
  outputSchema: Schemas.output.takeScreenshot,
  annotations: {
    readOnlyHint: true,     // does not modify page state
    idempotentHint: true,   // same filename just overwrites with identical content
    destructiveHint: false,
    openWorldHint: false,
  },
}, async ({ filename = 'screenshot.png' }) => {
  await ensureBrowser();
  const page = await browser.getPage();
  const outPath = path.resolve(process.cwd(), filename);
  await page.screenshot({ path: outPath, fullPage: true });
  return toToolResult({ path: outPath });
});

process.on('SIGINT', async () => {
  if (launched) await browser.close();
  process.exit(0);
});

const transport = new StdioServerTransport();
server.connect(transport);
