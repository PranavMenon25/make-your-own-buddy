Idea name: AccessFlow — Agent-Assisted Accessibility Workflow Testing
Problem statement
New features and updates can introduce accessibility barriers that prevent employees with disabilities from completing everyday tasks. Checking individual pages or components can miss problems that emerge across a workflow, such as lost keyboard focus, inaccessible dialogs, or unclear validation feedback.
Manually checking these journeys requires time and accessibility expertise. Development teams need a repeatable way to identify barriers and obtain evidence they can act on.
Proposed solution
An AI-assisted testing tool that accepts a workflow in natural language:
“Check whether an employee can create an expense claim, correct a validation error, and submit it using only a keyboard.”

The tool would:
1. Translate the instruction into steps and completion conditions.
2. Execute the workflow in a test environment using explicitly permitted interactions.
3. Combine automated accessibility checks with workflow checks for keyboard navigation, focus management, control labels, and error feedback.
4. Report barriers with reproduction steps, affected elements, and screenshots or browser traces.
5. Rerun the workflow after fixes to check whether the reported barriers are resolved.
The agent handles task interpretation and exploration; deterministic checks validate supported accessibility behaviours. Results distinguish confirmed failures, suspected issues, and incomplete checks.
Beneficial for
Group	Benefit
Employees who depend on keyboard navigation, including some with motor or visual disabilities	Fewer barriers in everyday workplace workflows
Employees who use screen readers	Earlier identification of supported semantic and focus-related issues
Developers and QA engineers	Reproducible findings and faster regression testing
Accessibility specialists	Automated preliminary checks, allowing more time for complex evaluation
Product and release teams	Better evidence of whether essential workflows have been tested


The initial version focuses on keyboard and selected semantic checks; it does not cover every disability or replace testing with assistive technology and disabled users.
Measurement of success
Evaluate against manually verified workflows, including previously unseen defects and accessible examples.
Metric	How to measure
Detection precision	Proportion of reported barriers confirmed by a human reviewer
Detection coverage	Proportion of known barriers within the supported scope that the tool detects
Reproducibility	How often a reported failure can be reproduced from its recorded steps
Execution reliability	How consistently the agent completes accessible workflows without incorrectly reporting blockers
Time saved	Time to obtain an actionable report compared with the existing testing process
Added value	Workflow barriers found beyond a standard automated page scan
Fix verification	Whether reruns correctly distinguish repaired and still-broken workflows


Numerical targets should be set after establishing a baseline rather than claiming an untested accuracy rate.
Dependencies and assumptions
Type	Requirement
Test environment	A staging application with test accounts, synthetic data, and resettable state
Browser automation	Playwright or an equivalent tool for controlled interactions and evidence capture
Accessibility checks	axe-core plus custom assertions for the supported workflow behaviours
AI access	An approved model capable of structured tool calling
Task definition	A clear workflow and an observable expected outcome
Human validation	An accessibility-informed reviewer to verify findings and evaluation cases
Execution constraints	The agent cannot bypass a keyboard barrier through mouse clicks or direct JavaScript manipulation
Initial scope	Browser-based applications; desktop applications and comprehensive screen-reader testing are excluded
Interpretation	An automated pass means the specified checks passed, not that the application is fully accessible


Hackathon scope: One expense-claim workflow with three independently verified accessibility defects, evidence-based reporting, and a rerun after repair. Test an accessible version too, to demonstrate that the agent does not mistake its own navigation failures for accessibility defects.