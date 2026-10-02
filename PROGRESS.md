# AccessFlow — Build Progress

## Stages

### Stage 1: Browser Control Basics
Goal: Get Playwright running, move the mouse, click, type — prove we can drive a browser.
- [x] Set up Node.js project with Playwright
- [x] Open a browser and navigate to a test page
- [x] Move mouse to elements, click, keyboard navigation
> Screenshots deferred — no multimodal model available yet

### Stage 2: Accessibility Checks
Goal: Run axe-core on a page and get structured results.
- [ ] Integrate axe-core into the Playwright session
- [ ] Run a scan and parse violations
- [ ] Custom checks: tab order, focus visibility, label presence

### Stage 3: MCP Tool Layer
Goal: Wrap browser control + a11y checks as MCP tools an AI agent can call.
- [ ] Define MCP tool: `navigate(url)`
- [ ] Define MCP tool: `keyboard_workflow(steps[])`
- [ ] Define MCP tool: `run_accessibility_scan()`
- [ ] Define MCP tool: `take_screenshot()`
- [ ] Local MCP server wiring

### Stage 4: Agent Workflow Interpreter
Goal: Accept a natural-language workflow and translate it to MCP tool calls.
- [ ] Prompt design for step decomposition
- [ ] Claude calling MCP tools in sequence
- [ ] Completion condition detection

### Stage 5: Evidence & Reporting
Goal: Output a structured barrier report with reproduction steps.
- [ ] Attach screenshots to findings
- [ ] Record step-by-step reproduction path
- [ ] Classify: confirmed failure / suspected issue / incomplete check

### Stage 6: Fix Verification
Goal: Rerun the same workflow after a fix and diff the results.
- [ ] Rerun logic
- [ ] Compare old vs new findings
- [ ] Mark resolved vs still-broken

---

## Log

### 2026-10-02
- Project kicked off for accessibility hackathon
- Idea doc reviewed: `agent.md`
- Decided to build incrementally starting with basic mouse/browser control
- Stage 1 complete: Playwright running, mouse movement, form fill, keyboard nav all working on local demo page (`stage1_ideation/`)
