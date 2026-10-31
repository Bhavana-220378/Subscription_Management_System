# SubscriptPro AI
## Smart Subscription Management & Revenue Protection Platform

**Live Demo:** https://subscriptpro.netlify.app

**GitHub Repository:** https://github.com/Bhavana-220378/Subscription_Management_System

---

## 1. About the Project

SubscriptPro AI is a web-based platform designed to help businesses manage their subscriptions, customers, products, plans, quotations, invoices, and payments in one place.

Businesses that provide monthly or yearly subscriptions often face problems such as missed invoices, duplicate billing, incorrect payment records, overdue payments, and billing mistakes.

These problems can make subscription management difficult and may result in potential revenue loss.

To address these challenges, we developed SubscriptPro AI, which combines subscription management, billing, payment tracking, revenue leak detection, and business insights in a single platform.

Our main goal is not only to help businesses manage their subscriptions but also to help them identify possible billing problems and protect their revenue.

**Our Idea: Manage Subscriptions. Identify Revenue Leaks. Protect Business Revenue.**

---

## 2. Problem Statement

Subscription-based businesses handle many customers and recurring payments. Managing all these activities manually can create several problems:

- Missing invoices for active subscriptions.
- Duplicate invoices for the same billing period.
- Payments that are not properly linked to invoices.
- Incorrect invoice calculations.
- Invalid or incorrectly applied discounts.
- Difficulty tracking overdue payments.
- Missed subscription renewals.
- Lack of clear information about expected and collected revenue.

Businesses need a centralized system that helps them manage subscriptions and identify possible financial mistakes.

---

## 3. Proposed Solution

We propose SubscriptPro AI, a centralized platform that simplifies subscription management and provides tools to monitor billing activities.

The platform allows businesses to:

- Manage customers, products, and subscription plans.
- Create quotations and convert them into subscriptions.
- Track subscription status and billing dates.
- Generate invoices and record payments.
- Monitor outstanding and overdue balances.
- Identify possible revenue leakage through automated rule-based checks.
- Track manually recorded revenue recovery.
- Monitor subscription health.
- Explore future revenue scenarios.
- Get business insights based on application data.

---

# 4. Main Features and Modules

## 4.1 Role-Based Access

The application provides three types of demo users.

**Admin**
- Access to the complete business dashboard.
- Manage customers, products, and plans.
- Create and manage quotations and subscriptions.
- Access invoices, payments, and discounts.
- Review revenue protection alerts.
- Access forecasting and business insights.
- Manage staff demo accounts through Team & Access.

**Staff**
- Access the dashboard.
- Manage customers.
- Create quotations.
- Manage subscriptions.
- View invoices and record payments.
- Review revenue protection alerts.
- Use the forecast simulator and Business Assistant.

**Customer**
- Access a separate My Account page.
- View their own subscription details.
- View their invoices.
- Check payment history.
- Cannot access internal business management pages.

This role-based demonstration shows how different users can access different areas of the platform.

## 4.2 Dashboard

The Dashboard provides a quick overview of the business's subscription and financial activities.

It includes the following sections:

**Active Subscriptions**

Displays the number of subscriptions that currently have Active status.

**Monthly Recurring Revenue (MRR)**

Shows the estimated monthly value of active subscriptions.

The platform converts different billing frequencies into a monthly value:

- Monthly subscriptions are counted at their monthly value.
- Yearly subscriptions are divided by 12.
- Weekly subscriptions are normalized using 52 weeks per year.
- Daily subscriptions are normalized using 30 days per month.

MRR represents estimated recurring subscription value, not the amount of money already collected.

**Collected Revenue**

Displays the total amount of recorded payment transactions in the application.

**Outstanding Balance**

Displays the unpaid balance across non-cancelled invoices.

**Revenue Performance Chart**

Displays a comparison between:

- Invoiced Revenue: Invoice amounts grouped by invoice issue month.
- Collected Revenue: Recorded payments grouped by payment month.

This helps businesses understand monthly billing and collection trends.

**Revenue Protection Overview**

Displays the number of open revenue protection alerts, including their severity levels.

**Recent Invoices**

Shows recently created invoices with customer details, invoice dates, amounts, and payment status.

**Business Insight**

Displays a business-related reminder based on the available application information.

## 4.3 Customer Management

The Customer Management module helps businesses maintain customer information.

It allows users with the appropriate access to:

- Add new customers.
- Store customer names and contact information.
- View customer records.
- Use customer information while creating quotations and subscriptions.
- Track customer-related invoices and payments.

This provides a centralized place for customer information.

## 4.4 Product Management

The Product Management module allows businesses to maintain the products and services they offer.

Features include:

- Add new products.
- Set product names and prices.
- Select product categories or types.
- Add product descriptions.
- Configure product variants and additional charges.

Products can then be selected while creating subscription plans and subscriptions.

## 4.5 Plan Management

The Plan Management module allows businesses to create subscription plans with different prices and billing frequencies.

Features include:

- Create subscription plans.
- Set plan names and prices.
- Choose billing frequencies such as daily, weekly, monthly, and yearly.
- Set minimum quantities.
- Configure plan availability dates.
- Define whether pausing, renewal, and early closure are allowed.

These plans help businesses offer different subscription options to customers.

## 4.6 Quotation Management

The Quotation Management module helps businesses prepare offers for customers before activating a subscription.

The workflow includes:

1. Select a customer.
2. Select a product and subscription plan.
3. Enter the required quantity and quotation details.
4. Set the quotation validity period.
5. Create the quotation.
6. Convert the quotation into a subscription when accepted.

The application prevents an already converted quotation from being converted again.

## 4.7 Subscription Management

The Subscription Management module helps businesses manage customer subscriptions throughout their usage.

Features include:

- Create subscriptions.
- Link subscriptions with customers, products, and plans.
- Track subscription status.
- View subscription start and end dates.
- Monitor next billing dates.
- Pause subscriptions when permitted by the plan.
- Resume paused subscriptions.
- Close or expire subscriptions.
- Review subscription information for billing and revenue monitoring.

This module helps businesses keep track of their recurring customer commitments.

## 4.8 Invoices and Payments

The Invoices & Payments module manages billing records and customer payment information.

**Invoice Management**
- Generate due invoices for active subscriptions.
- Calculate subtotal, discount, tax, and total amount.
- View invoice details.
- Track invoice issue dates and due dates.
- Identify duplicate billing periods and prevent duplicate invoice generation.

**Payment Management**
- Record customer payments.
- Support partial payments.
- Record full payments.
- Track paid and unpaid amounts.
- Display payment status.
- Monitor overdue invoices.

Payments are simulated in this prototype. No actual money is transferred through a payment gateway.

Invoice generation is initiated by the user from the application. Automatic background billing is not configured in the current prototype.

## 4.9 Discount Management

The Discount Management module helps businesses configure promotional discounts.

Features include:

- Create discount codes.
- Apply fixed-amount discounts.
- Apply percentage-based discounts.
- Configure minimum purchase amounts.
- Set discount validity dates.
- Configure usage limits.
- Prevent duplicate discount codes.

The billing process checks applicable discount rules while generating invoices.

## 4.10 Revenue Leak Detection System

This is one of the key features that makes SubscriptPro AI different from a basic subscription management platform.

The Revenue Leak Detection System checks subscription, invoice, and billing records to identify possible financial inconsistencies.

The current prototype implements four rule-based detection checks:

**RL001 – Missing Invoice**

Identifies an active subscription that has reached its next billing date but does not have a corresponding invoice for the expected billing period.

**RL002 – Duplicate Invoice**

Identifies situations where multiple non-cancelled invoices exist for the same subscription and billing period.

**RL004 – Invoice After Subscription Closure**

Identifies invoices whose issue dates appear to be after the end date of a closed or expired subscription.

**RL005 – Incorrect Invoice Total**

Checks whether the stored invoice total matches the expected calculation using subtotal, discount, and tax.

These alerts help businesses identify problems that need investigation and corrective action.

**Important:** These alerts represent possible billing issues. They do not automatically confirm that money has been lost.

The additional planned checks are:

- RL003 – Unallocated Payment.
- RL006 – Invalid Discount.

These two checks are not implemented in the current prototype version.

## 4.11 Revenue Recovery Tracker

The Revenue Recovery Tracker helps businesses record the amount recovered after investigating a revenue protection alert.

It allows users to:

- Review detected alerts.
- Record the actual amount recovered.
- Add a payment reference or correction note.
- Track recorded recovery events.
- Compare potential exposure with manually recorded recovery.

Simply marking an alert as reviewed does not count as recovered revenue.

Recovery entries are manually recorded in the prototype and are not independently verified against a bank or payment gateway.

## 4.12 Subscription Health Score

The Subscription Health feature provides a score to help businesses understand which customers may need additional attention.

The score is based on five factors:

| Factor | Weight |
|---|---:|
| Payment consistency | 35% |
| Overdue history | 25% |
| Renewal behavior | 20% |
| Subscription stability | 10% |
| Recent activity | 10% |
| **Total** | **100%** |

The displayed score is calculated using the application's available subscription and invoice records.

The health categories are:

- **80–100:** Healthy.
- **60–79:** Needs Attention.
- **0–59:** High Risk.

This is a rule-based indicator, not a machine-learning prediction or credit score.

## 4.13 Forecast and What-If Simulator

The Forecast & Simulator module helps businesses explore how different business situations could affect recurring revenue.

Users can change assumptions such as:

**Customer Growth**

Explore how increasing or decreasing the customer base may affect revenue.

**Price Increase**

Check how changing subscription prices may affect recurring revenue.

**Customer Churn**

Understand how customer cancellations may reduce recurring revenue.

The simulator displays:

- Current MRR.
- Projected MRR.
- Monthly revenue difference.
- Annualized projected revenue.

These calculations are based on the selected assumptions.

The simulator does not change actual subscription, invoice, or payment records.

Forecast values are estimates and are not guaranteed future collections.

## 4.14 Business Assistant

The Business Assistant helps users understand business information using the records available in the application.

Users can ask questions such as:

- What is our MRR?
- How much revenue is overdue?
- Which customers are at high risk?
- How many subscriptions are expiring?
- How many revenue protection alerts are open?

The assistant provides answers using predefined rules and current application data.

The current prototype uses rule-based responses and is not connected to an external generative AI service.

---

# 5. Complete Application Workflow

The typical workflow of SubscriptPro AI is:

1. The business logs in as Admin or Staff.
2. Customer information is added or selected.
3. Admin creates products and subscription plans.
4. A quotation is prepared for the customer.
5. The quotation is converted into a subscription.
6. The subscription becomes active.
7. The business generates due invoices.
8. Customer payments are recorded.
9. The application updates payment and outstanding balances.
10. Revenue Protection checks the records for possible billing issues.
11. Users investigate alerts and record recovery events when appropriate.
12. Subscription Health helps identify customers who may need attention.
13. Forecast & Simulator helps explore possible revenue scenarios.
14. Business Assistant provides insights based on available business data.

---

# 6. Technology Stack

The project is developed using the following technologies:

| Technology | Purpose |
|---|---|
| React.js | Builds the user interface and reusable components. |
| JavaScript | Implements application logic and calculations. |
| HTML5 | Provides the basic web application structure. |
| CSS3 | Handles styling, layouts, and responsive design. |
| Vite | Provides the development server and production build. |
| Recharts | Displays revenue charts and visualizations. |
| Lucide React | Provides icons throughout the application. |
| LocalStorage | Stores prototype data in the browser. |
| Git | Tracks code changes. |
| GitHub | Hosts the project source code and supports team collaboration. |
| Netlify | Hosts the public demonstration website. |

---

# 7. Project Structure

The main project structure is:

```text
SubscriptProAI/
│
├── src/
│   ├── components/
│   │   ├── Modal.jsx
│   │   └── StatCard.jsx
│   │
│   ├── data/
│   │   └── seed.js
│   │
│   ├── utils/
│   │   ├── finance.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── netlify.toml
├── README.md
├── DEPLOYMENT.md
└── JUDGE_DEMO_SCRIPT.md
```

### Important Files

- **App.jsx:** Contains the main application pages, navigation, role handling, and application workflows.
- **main.jsx:** Starts the React application.
- **styles.css:** Contains the application styling.
- **seed.js:** Provides initial demo customers, products, plans, subscriptions, invoices, and payments.
- **finance.js:** Contains financial calculations, invoice status, health scoring, and revenue leak detection logic.
- **storage.js:** Handles browser-based data storage.
- **package.json:** Contains project dependencies and development commands.
- **netlify.toml:** Contains Netlify deployment configuration.

---

# 8. How to Run the Project Locally

## Requirements

Before running the project, install:

- Node.js (LTS version recommended).
- npm.
- Git (if cloning the repository).

## Step 1: Clone the GitHub Repository

Open the terminal and run:

```bash
git clone https://github.com/Bhavana-220378/Subscription_Management_System.git
```

## Step 2: Open the Project Folder

```bash
cd Subscription_Management_System
```

## Step 3: Install Dependencies

```bash
npm install
```

On Windows PowerShell, if required, use:

```powershell
npm.cmd install
```

## Step 4: Start the Development Server

```bash
npm run dev
```

On Windows PowerShell, use:

```powershell
npm.cmd run dev
```

## Step 5: Open the Application

Open the local URL displayed in the terminal.

Usually:

```text
http://localhost:5173
```

Do not open `index.html` directly from the file manager. The React application must run through the Vite development server.

## Step 6: Create a Production Build

To check whether the project builds successfully:

```bash
npm run build
```

On Windows PowerShell:

```powershell
npm.cmd run build
```

The generated production files will be available in the `dist` folder.

---

# 9. Demo Login Credentials

The application provides demo accounts for testing different roles.

| Role | Email | Password |
|---|---|---|
| Admin | admin@subscriptpro.demo | Admin@123 |
| Staff | staff@subscriptpro.demo | Staff@123 |
| Customer – Aarav Technologies | customer@subscriptpro.demo | Customer@123 |
| Customer – BluePeak Studios | bluepeak@subscriptpro.demo | Bluepeak@123 |
| Customer – Northstar Learning | northstar@subscriptpro.demo | Northstar@123 |
| Customer – PixelCraft Labs | pixelcraft@subscriptpro.demo | Pixelcraft@123 |

The login page also provides quick-select demo accounts. Select an account and press **Sign in**.

These are public demonstration credentials. Do not use real customer information or personal passwords in the prototype.

---

# 10. Deployment

SubscriptPro AI is deployed using Netlify.

**Live Application:**

https://subscriptpro.netlify.app

**GitHub Repository:**

https://github.com/Bhavana-220378/Subscription_Management_System

The project uses the following Netlify build settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Deployment branch:** `main`

When GitHub is connected to Netlify, pushing new changes to the configured branch can automatically trigger a new deployment.

---

# 11. Current Prototype Limitations

SubscriptPro AI is currently a hackathon demonstration prototype.

The following limitations should be considered:

**Browser-Based Storage**

The application uses browser LocalStorage. Data is stored separately in each browser and does not automatically synchronize across different devices.

**Demo Authentication**

The demo login system and role checks are implemented on the client side. They are not production-grade secure authentication or server-side authorization.

**Simulated Payments**

Payments are recorded for demonstration purposes. No real money is transferred.

**No Connected Email Service**

Password reset and email delivery are not connected to an external email provider.

**Manual Invoice Generation**

Invoice generation is initiated from the application interface. A background billing scheduler is not configured.

**Rule-Based Revenue Detection**

Revenue protection alerts are generated using predefined rules. They identify possible billing inconsistencies but do not independently confirm actual financial losses.

**Manual Recovery Records**

Recovery events are entered by users and are not verified through a payment gateway or bank connection.

**Estimated Forecasts**

Forecast results are based on scenario assumptions. They are not guaranteed future revenue predictions.

**No Shared Backend**

The current project does not include a configured production backend or shared database.

---

# 12. Future Enhancements

The following improvements can make SubscriptPro AI more suitable for real-world business use:

- Develop a secure backend and shared database.
- Implement server-side authentication and role-based authorization.
- Add customer registration and email verification.
- Add password reset through email.
- Integrate real payment gateways.
- Implement automatic recurring invoice generation.
- Add payment reminders and email notifications.
- Implement the remaining revenue leak detection rules.
- Improve payment reconciliation and recovery verification.
- Add detailed financial reports and analytics.
- Conduct performance and security testing.
- Add audit logs and data backup facilities.

---

# 13. Expected Impact

SubscriptPro AI aims to help subscription-based businesses:

- Reduce manual subscription management work.
- Organize customer and subscription information.
- Improve invoice and payment tracking.
- Identify possible billing mistakes.
- Monitor outstanding and overdue balances.
- Investigate potential revenue leakage.
- Track manually recorded revenue recovery.
- Understand subscription health.
- Explore future revenue scenarios.
- Make better business decisions using available business information.

---

# 14. Our Vision

Our vision is to make subscription management easier and financial monitoring smarter.

Instead of only recording subscriptions and payments, SubscriptPro AI aims to help businesses identify possible billing problems, investigate revenue leakage, and understand their recurring revenue more clearly.

**SubscriptPro AI – Manage Subscriptions. Identify Revenue Leaks. Protect Business Revenue.**

---

## Project Links

**Live Demo:** https://subscriptpro.netlify.app

**GitHub Repository:** https://github.com/Bhavana-220378/Subscription_Management_System