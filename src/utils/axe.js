const { AxeBuilder } = require('@axe-core/playwright');

class AccessibilityScanner {
  constructor(browserController) {
    this.browserController = browserController;
  }

  async scan() {
    const page = await this.browserController.getPage();
    const results = await new AxeBuilder({ page }).analyze();
    return this._parse(results);
  }

  _parse(results) {
    return {
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })),
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
    };
  }
}

module.exports = AccessibilityScanner;
