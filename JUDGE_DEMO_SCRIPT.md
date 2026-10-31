# 5-minute judge walkthrough

## Login checks

Start the app with `START_APP.bat`. On the login screen, select a demo account row and press **Sign in**. Test all three roles:

- Admin: `admin@subscriptpro.demo` / `Admin@123`
- Staff: `staff@subscriptpro.demo` / `Staff@123`
- Customer: `customer@subscriptpro.demo` / `Customer@123`

Additional customer-isolation accounts are listed in `README.md`.

## Admin walkthrough

1. Dashboard: explain MRR, recorded collections, outstanding balances and revenue-protection alerts.
2. Click each sidebar item. Navigation also updates the URL hash, so a page can be refreshed and reopened at the same section.
3. Team & Access: create a staff demo account. The password must be longer than 8 characters and include uppercase, lowercase and a special character.
4. Products and Plans: show catalogue pricing, product variants, billing frequency and plan permissions.
5. Quotations: create an offer and accept/convert it into a subscription.
6. Subscriptions: pause, resume (set status back to Active), close or expire a subscription.
7. Discounts: create a fixed or percentage discount with a minimum purchase and usage limit.
8. Invoices & Payments: generate due invoices. Show duplicate billing-period prevention. Record a partial payment, then the remaining balance.
9. Revenue Protection: inspect evidence and recommended actions for detected billing anomalies.
10. Forecast & Simulator: change growth, price and churn assumptions. Show that the projection does not mutate actual records.
11. Business Assistant: ask “What is our MRR?”, “How much is overdue?” or “Which customers are high risk?”.

## Staff walkthrough

1. Sign out and sign in as Staff.
2. Verify that Dashboard, Customers, Quotations, Subscriptions, Invoices & Payments, Revenue Protection, Forecast & Simulator and Business Assistant are available.
3. Verify that Products, Plans, Discounts and Team & Access are not in the Staff sidebar.

## Customer walkthrough

1. Sign out and sign in as Customer.
2. Verify that only My Account is available.
3. Show that the portal displays the signed-in demo customer's subscriptions, invoices and payment history.
4. Sign in with another customer account to show that the displayed records are scoped to a different customer ID.

## Demo integrity

Payments are simulated. The assistant and health scoring are rule-based. Revenue projections are estimates. Demo credentials and role checks run in the browser and are not production security. Data is stored locally in each browser and does not sync between judges' devices.
