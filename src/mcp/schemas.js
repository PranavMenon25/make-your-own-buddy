const { z } = require('zod');

// --- Shared sub-schemas ---

const StepSchema = z.object({
  action: z.enum(['tab', 'press', 'type', 'click']).describe(
    'tab: press Tab key, press: press a named key, type: type text into focused element, click: click a CSS selector'
  ),
  value: z.string().optional().describe('Key name, text, or CSS selector — required for press / type / click'),
});

const StepResultSchema = z.object({
  action: z.string(),
  value: z.string().optional(),
  status: z.enum(['ok', 'error']),
  error: z.string().optional(),
});

const ViolationNodeSchema = z.object({
  html: z.string(),
  target: z.array(z.string()),
  failureSummary: z.string(),
});

const ViolationSchema = z.object({
  id: z.string(),
  impact: z.enum(['minor', 'moderate', 'serious', 'critical']).nullable(),
  description: z.string(),
  helpUrl: z.string(),
  nodes: z.array(ViolationNodeSchema),
});

// --- Schema registry ---

class Schemas {
  static input = {
    navigate: z.object({
      url: z.string().url().describe('The URL to navigate to'),
    }),

    keyboardWorkflow: z.object({
      steps: z.array(StepSchema).describe('Ordered list of interaction steps to execute'),
    }),

    runScan: z.object({}),

    takeScreenshot: z.object({
      filename: z.string().optional().describe('Output filename relative to cwd (default: screenshot.png)'),
    }),
  };

  static output = {
    navigate: z.object({
      url: z.string(),
      message: z.string(),
    }),

    keyboardWorkflow: z.object({
      results: z.array(StepResultSchema),
    }),

    runScan: z.object({
      violations: z.array(ViolationSchema),
      passes: z.number(),
      incomplete: z.number(),
      inapplicable: z.number(),
    }),

    takeScreenshot: z.object({
      path: z.string(),
    }),
  };

  // Throws on invalid data — use at trust boundaries
  static parse(schema, data) {
    return schema.parse(data);
  }

  // Returns { success, data, error } — use when you want to handle failures gracefully
  static safeParse(schema, data) {
    return schema.safeParse(data);
  }
}

module.exports = Schemas;
