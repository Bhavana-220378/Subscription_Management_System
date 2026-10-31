# Final review changes

- Added hash-based sidebar navigation so the selected section updates the URL and can be restored on refresh.
- Added explicit button types, accessible active-navigation state, keyboard focus outlines and sidebar scrolling.
- Added an access fallback for unavailable pages and role-restricted routes.
- Added separate customer demo accounts for the seeded customers and a customer payment-history view.
- Added a recovery-event tracker with an explicit amount and reference/note; reviewed alerts and recorded recoveries are kept distinct.
- Added an explainable health-score component breakdown on hover in the customer directory.
- Added staff password complexity validation matching the stated password rule.
- Added a visible admin reset-demo control in the top bar.
- Corrected local date handling and made the missing-invoice detector use the same billing-period convention as invoice generation.
- Adjusted normalized MRR to account for the subscription percentage discount.
- Added Windows launcher/build batch files and clarified that the React app must run through Vite rather than opening `index.html` directly.

## Validation performed

- Node syntax checks passed for `src/utils/finance.js`, `src/utils/storage.js` and `src/data/seed.js`.
- Static feature checks passed for login, role-aware navigation, customer payment history, staff password validation, invoice generation, payment recording, leak detection, forecasting and the assistant.
- A full Vite production build was not completed in this environment because `npm install` timed out while fetching packages. Run `START_APP.bat` or `npm.cmd install` locally, then test the full application before submission.
