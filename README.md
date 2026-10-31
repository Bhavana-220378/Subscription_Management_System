# SubscriptPro AI

**Smart Subscription Management & Revenue Protection Platform**

A hackathon-ready React + Vite demonstration covering subscription operations, billing workflows and revenue intelligence.

## Run on Windows

1. Install Node.js LTS.
2. Extract this ZIP.
3. Double-click `START_APP.bat`, or open this folder in VS Code and run:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

4. Open the localhost URL printed in the terminal (normally `http://localhost:5173`).

Do not double-click `index.html` to run the React application. It must be served by Vite.

## Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | `admin@subscriptpro.demo` | `Admin@123` |
| Staff | `staff@subscriptpro.demo` | `Staff@123` |
| Customer – Aarav Technologies | `customer@subscriptpro.demo` | `Customer@123` |
| Customer – BluePeak Studios | `bluepeak@subscriptpro.demo` | `Bluepeak@123` |
| Customer – Northstar Learning | `northstar@subscriptpro.demo` | `Northstar@123` |
| Customer – PixelCraft Labs | `pixelcraft@subscriptpro.demo` | `Pixelcraft@123` |

The login screen has quick-select demo accounts. Select an account row, then press **Sign in**.

## Role permissions

### Admin
- Dashboard and customer management
- Product and plan catalogue
- Quotations and subscription lifecycle
- Invoices and simulated payment recording
- Discounts and team/staff demo account creation
- Revenue Protection with alert review and a manual recovery-event tracker, Forecast & Simulator, Business Assistant
- Reset demo data using the reset icon in the top bar

### Staff
- Dashboard, customers, quotations, subscriptions, invoices and payments
- Revenue Protection, Forecast & Simulator and Business Assistant
- Cannot access product/plan administration, discounts or Team & Access

### Customer
- Can view only the customer record linked to the signed-in demo account
- Can view that customer's subscriptions, invoices and payment history
- Cannot access internal workspace pages

## Main workflows

1. Add or select a customer.
2. Admin creates products and plans.
3. Staff or admin creates a quotation and converts it into a subscription.
4. Generate due invoices from the Invoices & Payments page.
5. Record partial or full simulated payments.
6. Review potential revenue-leak alerts and customer health indicators.
7. Use Forecast & Simulator to model growth, pricing and churn assumptions.
8. Ask the Business Assistant supported questions about the current demo records.

## Deployment

Run `BUILD_FOR_DEPLOYMENT.bat` or `npm.cmd run build`. Upload the **contents** of the generated `dist` folder to Netlify, Vercel or another static hosting provider. `DEPLOYMENT.md` has the hosting steps.

For a GitHub submission, push this entire source folder (not `node_modules` or `dist`) to your public repository, unless the event specifies otherwise.

## Important prototype limitations

- This is a browser-based hackathon prototype. Demo credentials and role checks are implemented in client-side code and localStorage; they are **not secure production authentication or server-side authorization**.
- Each browser/device has its own local data. Different judges will not share live changes unless the app is connected to a shared backend.
- Payments are simulated. No money is transferred.
- Password reset and email delivery are not connected to an email provider.
- Invoice generation is initiated from the UI; it is not a background scheduler.
- Revenue leak alerts are rule-based signals, not proof of financial loss. Marking an alert reviewed does not count as recovered revenue. Recovery events are manually recorded demo attestations with a note/reference; they are not independently verified against a payment gateway.
- Forecasts are scenario estimates, not guaranteed revenue or a trained ML prediction.

For production deployment, add a backend such as Supabase with server-enforced authentication, row-level security, shared database tables, audit logging and real payment/email integrations.
