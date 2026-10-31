import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BadgeIndianRupee, BarChart3,
  Bell, MessageSquareText, BriefcaseBusiness, Building2, CheckCircle2, ChevronDown, CircleHelp,
  CreditCard, FileText, Gauge, LayoutDashboard, LifeBuoy, Menu, Package, Plus,
  RefreshCw, Search, Settings, ShieldCheck, Lightbulb, Users, Wallet, X
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Modal from "./components/Modal";
import StatCard from "./components/StatCard";
import { loadData, saveData } from "./utils/storage";
import { detectRevenueLeaks, getMetrics, healthScore, invoiceAmounts, invoiceStatus, makeId, money, round2, todayISO } from "./utils/finance";

const nav = [
  { group: "Workspace", items: [
    ["Dashboard", LayoutDashboard], ["Customers", Users], ["Products", Package], ["Plans", BriefcaseBusiness], ["Quotations", FileText], ["Subscriptions", RefreshCw]
  ]},
  { group: "Finance", items: [["Invoices & Payments", FileText], ["Discounts", BadgeIndianRupee], ["Revenue Protection", ShieldCheck], ["Forecast & Simulator", BarChart3]] },
  { group: "Intelligence", items: [["Business Assistant", MessageSquareText]] }
];

const initialForm = {
  customerId: "", planId: "", productId: "", quantity: 1, price: "", taxRate: 18, discount: 0, variantExtra: 0, variantName: "", startDate: todayISO(), nextBillingDate: todayISO(), endDate: ""
};

const DEMO_USERS = [
  { email: "admin@subscriptpro.demo", password: "Admin@123", name: "Aarav Mehta", role: "Admin" },
  { email: "staff@subscriptpro.demo", password: "Staff@123", name: "Riya Sharma", role: "Staff" },
  { email: "customer@subscriptpro.demo", password: "Customer@123", name: "Aarav Technologies", role: "Customer", customerId: "CUS-1001" },
  { email: "bluepeak@subscriptpro.demo", password: "Bluepeak@123", name: "BluePeak Studios", role: "Customer", customerId: "CUS-1002" },
  { email: "northstar@subscriptpro.demo", password: "Northstar@123", name: "Northstar Learning", role: "Customer", customerId: "CUS-1003" },
  { email: "pixelcraft@subscriptpro.demo", password: "Pixelcraft@123", name: "PixelCraft Labs", role: "Customer", customerId: "CUS-1004" }
];
function loadDemoUsers(){ try { const saved=JSON.parse(localStorage.getItem("subscriptpro-demo-users")||"null"); return Array.isArray(saved)?[...DEMO_USERS,...saved]:DEMO_USERS; } catch { return DEMO_USERS; } }
export default function App() {
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem("subscriptpro-session") || "null"); } catch { return null; } });
  function login(email, password) {
    const user = loadDemoUsers().find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!user) return false;
    const safe = { email:user.email, name:user.name, role:user.role, customerId:user.customerId || null };
    localStorage.setItem("subscriptpro-session", JSON.stringify(safe)); setSession(safe); return true;
  }
  function logout() { localStorage.removeItem("subscriptpro-session"); setSession(null); }
  return session ? <WorkspaceApp user={session} onLogout={logout}/> : <LoginScreen onLogin={login}/>;
}
function WorkspaceApp({ user, onLogout }) {
  const role = user.role;
  const [data, setData] = useState(loadData);
  const [teamUsers, setTeamUsers] = useState(loadDemoUsers);
  const [page, setPage] = useState(() => {
    const requested = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    return requested || (role === "Customer" ? "My Account" : "Dashboard");
  });
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [scenario, setScenario] = useState({ growth: 10, priceIncrease: 5, churn: 3 });
  const [form, setForm] = useState(initialForm);

  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const metrics = useMemo(() => getMetrics(data), [data]);
  const customersById = useMemo(() => Object.fromEntries(data.customers.map((c) => [c.id, c])), [data.customers]);
  const plansById = useMemo(() => Object.fromEntries(data.plans.map((p) => [p.id, p])), [data.plans]);
  const productsById = useMemo(() => Object.fromEntries(data.products.map((p) => [p.id, p])), [data.products]);
  const alerts = useMemo(() => detectRevenueLeaks(data), [data]);
  const openAlerts = alerts.filter((a) => !data.alerts.some((stored) => stored.id === a.id && stored.status === "Resolved"));
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const notify = (message) => setToast(message);
  const changePage = (name) => {
    setPage(name);
    setQuery("");
    window.location.hash = encodeURIComponent(name);
  };
  const customerData = role === "Customer" ? { ...data, customers:data.customers.filter(c=>c.id===user.customerId), subscriptions:data.subscriptions.filter(x=>x.customerId===user.customerId), invoices:data.invoices.filter(x=>x.customerId===user.customerId), payments:data.payments.filter(p=>data.invoices.some(i=>i.id===p.invoiceId&&i.customerId===user.customerId)), alerts:[], recoveryEvents:[] } : data;
  const adminNav = nav.map(g=>g.group === "Workspace" ? {...g,items:[...g.items,["Team & Access",Settings]]} : g);
  const allowedNav = role === "Admin" ? adminNav : role === "Staff" ? nav.map(g=>({...g,items:g.items.filter(([n])=>!["Products","Plans","Discounts"].includes(n))})) : [{group:"Customer Portal",items:[["My Account",Users]]}];
  const allowedPages = allowedNav.flatMap(group => group.items.map(([name]) => name));

  useEffect(() => {
    const syncPageFromHash = () => {
      const requested = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (requested && allowedPages.includes(requested)) setPage(requested);
      else if (!allowedPages.includes(page)) setPage(role === "Customer" ? "My Account" : "Dashboard");
    };
    window.addEventListener("hashchange", syncPageFromHash);
    syncPageFromHash();
    return () => window.removeEventListener("hashchange", syncPageFromHash);
  }, [role, page, allowedPages.join("|")]);

  function resetDemo() {
    if (!window.confirm("Reset all SubscriptPro demo data to the original sample records?")) return;
    localStorage.removeItem("subscriptpro-ai-v1");
    setData(loadData());
    notify("Demo data has been reset.");
  }

  function addStaffAccount(payload) {
    const email=payload.email.trim().toLowerCase();
    const strongPassword = payload.password.length > 8 && /[A-Z]/.test(payload.password) && /[a-z]/.test(payload.password) && /[^A-Za-z0-9]/.test(payload.password);
    if(!email || !email.includes("@") || !strongPassword) return notify("Use a valid email and a password longer than 8 characters with uppercase, lowercase and a special character.");
    if(teamUsers.some(u=>u.email.toLowerCase()===email)) return notify("An account with this email already exists.");
    const newUser={email,password:payload.password,name:payload.name.trim(),role:"Staff"};
    const custom=[...teamUsers.filter(u=>!DEMO_USERS.some(d=>d.email===u.email)),newUser];
    localStorage.setItem("subscriptpro-demo-users",JSON.stringify(custom));
    setTeamUsers(loadDemoUsers()); notify("Staff demo account created.");
  }

  function addCustomer(payload) {
    if (!payload.name.trim() || !payload.email.trim()) return notify("Customer name and email are required.");
    if (data.customers.some((c) => c.email.toLowerCase() === payload.email.toLowerCase())) return notify("A customer with this email already exists.");
    setData((d) => ({ ...d, customers: [...d.customers, { ...payload, id: makeId("CUS"), createdAt: todayISO() }] }));
    setModal(null); notify("Customer added.");
  }

  function addProduct(payload) {
    if (!payload.name.trim() || Number(payload.price) <= 0) return notify("Enter a product name and a valid price.");
    setData((d) => ({ ...d, products: [...d.products, { ...payload, id: makeId("PRD"), price: Number(payload.price), cost: Number(payload.cost || 0), variants: payload.variantName?.trim() ? [{ name: payload.variantName.trim(), extra: Number(payload.variantExtra || 0) }] : [] }] }));
    setModal(null); notify("Product added.");
  }

  function addPlan(payload) {
    if (!payload.name.trim() || Number(payload.price) <= 0) return notify("Enter a plan name and a valid price.");
    setData((d) => ({ ...d, plans: [...d.plans, { ...payload, id: makeId("PLN"), price: Number(payload.price), minQty: Number(payload.minQty || 1), allowPause: payload.allowPause !== false, allowRenew: payload.allowRenew !== false, allowEarlyClose: payload.allowEarlyClose !== false, autoClose: !!payload.autoClose }] }));
    setModal(null); notify("Plan added.");
  }

  function addSubscription() {
    if (!form.customerId || !form.planId || !form.productId) return notify("Select a customer, plan and product.");
    const plan = plansById[form.planId];
    const product = productsById[form.productId];
    if (plan.availableFrom && plan.availableFrom > todayISO()) return notify("This plan is not available yet.");
    if (plan.availableTo && plan.availableTo < todayISO()) return notify("This plan is no longer available.");
    const subscription = {
      id: makeId("SUB"), customerId: form.customerId, planId: form.planId, productId: form.productId,
      quantity: Math.max(Number(form.quantity), Number(plan.minQty || 1)), price: Number(form.price || plan.price || product.price) + Number(form.variantExtra || 0), variantName: form.variantName || "",
      frequency: plan.frequency, taxRate: Number(form.taxRate), discount: Number(form.discount),
      status: "Active", startDate: form.startDate, nextBillingDate: form.nextBillingDate, endDate: form.endDate || "",
      lastInvoiceDate: ""
    };
    setData((d) => ({ ...d, subscriptions: [...d.subscriptions, subscription] }));
    setModal(null); setForm(initialForm); notify("Subscription created and activated.");
  }

  function changeSubscriptionStatus(id, status) {
    const sub=data.subscriptions.find(s=>s.id===id), plan=plansById[sub?.planId];
    if(status==="Paused" && plan?.allowPause===false) return notify("The selected plan does not allow pausing.");
    if(status==="Closed" && plan?.allowEarlyClose===false && sub?.endDate && sub.endDate>todayISO()) return notify("The selected plan does not allow early closure.");
    setData((d) => ({ ...d, subscriptions: d.subscriptions.map((s) => s.id === id ? { ...s, status } : s) }));
    notify(`Subscription marked ${status.toLowerCase()}.`);
  }

  function generateDueInvoices() {
    const due = data.subscriptions.filter((s) => s.status === "Active" && s.nextBillingDate && s.nextBillingDate <= todayISO());
    if (!due.length) return notify("No active subscriptions are due for billing today.");
    const newInvoices = [];
    const usedDiscountIds = [];
    due.forEach((s) => {
      const frequency = s.frequency || "monthly";
      const period = frequency === "daily" || frequency === "weekly" ? s.nextBillingDate : frequency === "yearly" ? s.nextBillingDate.slice(0,4) : s.nextBillingDate.slice(0,7);
      const exists = data.invoices.some((i) => i.subscriptionId === s.id && i.period === period && i.status !== "Cancelled");
      if (exists) return;
      const amounts = invoiceAmounts(s);
      const rule = (data.discounts || []).find(x => x.active && todayISO() >= (x.startDate || "0000-01-01") && todayISO() <= (x.endDate || "9999-12-31") && (!x.usageLimit || x.used + usedDiscountIds.filter(id=>id===x.id).length < x.usageLimit) && amounts.subtotal >= Number(x.minPurchase || 0));
      if (rule) {
        const extra = rule.type === "Fixed" ? Math.min(amounts.subtotal - amounts.discount, Number(rule.value)) : round2(amounts.subtotal * Number(rule.value) / 100);
        amounts.discount = round2(Math.min(amounts.subtotal, amounts.discount + extra));
        const taxable = Math.max(0, amounts.subtotal - amounts.discount);
        amounts.tax = round2(taxable * Number(s.taxRate || 0) / 100);
        amounts.total = round2(taxable + amounts.tax);
        usedDiscountIds.push(rule.id);
      }
      newInvoices.push({ id: makeId("INV"), subscriptionId: s.id, customerId: s.customerId, period, issueDate: todayISO(), dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), ...amounts, paid: 0, status: "Confirmed" });
    });
    if (!newInvoices.length) return notify("Due invoices already exist. Duplicate generation was prevented.");
    const generatedSubscriptionIds = new Set(newInvoices.map((invoice) => invoice.subscriptionId));
    setData((d) => ({
      ...d,
      invoices: [...d.invoices, ...newInvoices],
      discounts: (d.discounts || []).map(x => usedDiscountIds.includes(x.id) ? {...x, used:x.used + usedDiscountIds.filter(id=>id===x.id).length} : x),
      subscriptions: d.subscriptions.map((s) => generatedSubscriptionIds.has(s.id) ? { ...s, lastInvoiceDate: todayISO(), nextBillingDate: nextDate(s.nextBillingDate, s.frequency || "monthly") } : s)
    }));
    notify(`${newInvoices.length} invoice(s) generated.`);
  }

  function addQuotation(payload) {
    if (!payload.customerId || !payload.planId || !payload.productId) return notify("Select a customer, plan and product.");
    const plan = plansById[payload.planId];
    const quote = { id: makeId("QUO"), ...payload, quantity: Math.max(1, Number(payload.quantity || 1)), unitPrice: Number(plan.price), status: "Sent", createdAt: todayISO(), validUntil: new Date(Date.now() + Number(payload.validDays || 15) * 86400000).toISOString().slice(0,10) };
    setData(d => ({ ...d, quotations: [...(d.quotations || []), quote] }));
    notify("Quotation created.");
  }
  function convertQuotation(quote) {
    if (quote.status === "Converted") return notify("This quotation has already been converted.");
    const plan = plansById[quote.planId];
    const sub = { id: makeId("SUB"), customerId: quote.customerId, planId: quote.planId, productId: quote.productId, quantity: quote.quantity, price: quote.unitPrice, frequency: plan.frequency, status: "Active", startDate: todayISO(), nextBillingDate: todayISO(), endDate: "", taxRate: 18, discount: 0, lastInvoiceDate: "" };
    setData(d => ({ ...d, subscriptions: [...d.subscriptions, sub], quotations: d.quotations.map(q => q.id === quote.id ? {...q,status:"Converted",subscriptionId:sub.id} : q) }));
    notify("Quotation converted into an active subscription.");
  }
  function addDiscount(payload) {
    if (!payload.code.trim() || Number(payload.value) <= 0) return notify("Enter a discount code and positive value.");
    if ((data.discounts || []).some(x => x.code.toLowerCase() === payload.code.trim().toLowerCase())) return notify("Discount code already exists.");
    const discount = { ...payload, id: makeId("DSC"), code: payload.code.trim().toUpperCase(), value: Number(payload.value), minPurchase: Number(payload.minPurchase || 0), usageLimit: Number(payload.usageLimit || 0), used: 0, active: true };
    setData(d => ({ ...d, discounts: [...(d.discounts || []), discount] }));
    notify("Discount rule created.");
  }

  function nextDate(date, frequency) {
    const d = new Date(`${date}T00:00:00`);
    if (frequency === "daily") d.setDate(d.getDate() + 1);
    else if (frequency === "weekly") d.setDate(d.getDate() + 7);
    else if (frequency === "yearly") d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  }

  function recordPayment(invoice, payload) {
    const amount = Number(payload.amount);
    const balance = round2(invoice.total - invoice.paid);
    if (!Number.isFinite(amount) || amount <= 0 || amount > balance + 0.005) return notify(`Enter an amount between ₹0.01 and ${money(balance)}.`);
    const payment = { id: makeId("PAY"), invoiceId: invoice.id, amount: round2(amount), method: payload.method, date: payload.date || todayISO(), note: payload.note || "Demo payment" };
    setData((d) => ({
      ...d,
      payments: [...d.payments, payment],
      invoices: d.invoices.map((i) => i.id === invoice.id ? { ...i, paid: round2(i.paid + amount), status: round2(i.paid + amount) >= i.total ? "Paid" : "Partially Paid" } : i)
    }));
    setModal(null); notify("Simulated payment recorded.");
  }

  function resolveAlert(alert) {
    setData((d) => ({ ...d, alerts: [...d.alerts.filter((a) => a.id !== alert.id), { ...alert, status: "Resolved", resolvedAt: todayISO() }] }));
    notify("Alert marked as reviewed. This does not count as recovered revenue.");
  }

  function recordRecovery(alert) {
    const rawAmount = window.prompt(`Enter the actual amount recovered for ${alert.id} (₹). This should reflect a completed payment or documented correction.`);
    if (rawAmount === null) return;
    const amount = round2(Number(rawAmount));
    if (!Number.isFinite(amount) || amount <= 0) return notify("Enter a valid recovered amount greater than zero.");
    const note = window.prompt("Enter the payment reference or correction note:") || "Recovery recorded in demo";
    const event = { id: makeId("REC"), alertId: alert.id, amount, date: todayISO(), note };
    setData((d) => ({
      ...d,
      recoveryEvents: [...(d.recoveryEvents || []), event],
      alerts: [...d.alerts.filter((a) => a.id !== alert.id), { ...alert, status: "Resolved", resolvedAt: todayISO(), recoveryEventId: event.id }]
    }));
    notify(`Recorded ${money(amount)} as recovered revenue.`);
  }

  function askAssistant() {
    const q = assistantQuery.toLowerCase();
    const overdue = data.invoices.filter((i) => invoiceStatus(i) === "Overdue");
    const expiring = data.subscriptions.filter((s) => s.status === "Active" && s.endDate && (new Date(s.endDate) - new Date()) / 86400000 <= 30);
    const highRisk = data.customers.map((c) => ({ c, h: healthScore(c.id, data) })).filter((x) => x.h.score < 60);
    let answer;
    if (q.includes("mrr") || q.includes("monthly recurring")) answer = `Your estimated Monthly Recurring Revenue is ${money(metrics.mrr)} from ${metrics.active} active subscriptions. Yearly plans are normalized to one-twelfth and weekly plans to 52/12.`;
    else if (q.includes("overdue")) answer = `${overdue.length} invoice(s) are overdue, with ${money(overdue.reduce((s, i) => s + Math.max(0, i.total - i.paid), 0))} outstanding. Review due dates and payment follow-ups.`;
    else if (q.includes("expir")) answer = `${expiring.length} active subscription(s) have an end date within the next 30 days. Contact those customers before renewal.`;
    else if (q.includes("risk") || q.includes("health")) answer = highRisk.length ? `${highRisk.length} customer(s) currently score below 60: ${highRisk.map((x) => `${x.c.name} (${x.h.score}/100)`).join(", ")}.` : "No customers currently fall below the high-risk score threshold.";
    else if (q.includes("leak") || q.includes("alert")) answer = `There are ${openAlerts.length} open revenue-protection alert(s). Potential exposure is ${money(openAlerts.reduce((s, a) => s + Number(a.amount || 0), 0))}. This is an estimate, not confirmed lost revenue.`;
    else if (q.includes("collect") || q.includes("revenue")) answer = `Recorded collections total ${money(metrics.collected)}. Outstanding invoice balance is ${money(metrics.outstanding)}. Collections are based only on payment records.`;
    else if (q.includes("product")) {
      const totals = data.products.map((p) => ({ name: p.name, count: data.subscriptions.filter((s) => s.productId === p.id && s.status === "Active").length })).sort((a,b) => b.count-a.count);
      answer = totals.length ? `Active subscriptions by product: ${totals.map((x) => `${x.name}: ${x.count}`).join("; ")}.` : "No product data is available.";
    } else answer = "I can answer questions about MRR, collected revenue, outstanding or overdue invoices, expiring subscriptions, customer health risk, products, and revenue-protection alerts. Try asking one of those.";
    setAssistantAnswer(answer);
  }

  const chartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleString("en-IN", { month: "short" });
      const collected = data.payments.filter((p) => p.date?.slice(0, 7) === key).reduce((s, p) => s + Number(p.amount), 0);
      const billed = data.invoices.filter((x) => x.issueDate?.slice(0, 7) === key && x.status !== "Cancelled").reduce((s, x) => s + Number(x.total), 0);
      months.push({ month: label, Collected: round2(collected), Invoiced: round2(billed) });
    }
    return months;
  }, [data.payments, data.invoices]);

  const filtered = (items, fields) => items.filter((item) => fields(item).toLowerCase().includes(query.toLowerCase()));
  const headerTitle = page === "Invoices & Payments" ? "Invoices & Payments" : page;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={21} /></div><div><strong>SubscriptPro</strong><span>AI revenue protection</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      {allowedNav.map((group) => <div className="nav-group" key={group.group}>
        <div className="nav-group-title">{group.group}</div>
        {group.items.map(([name, Icon]) => <button type="button" key={name} aria-current={page === name ? "page" : undefined} className={`nav-item ${page === name ? "active" : ""}`} onClick={() => changePage(name)}><Icon size={17} /><span>{name}</span>{name === "Revenue Protection" && openAlerts.length > 0 && <em>{openAlerts.length}</em>}</button>)}
      </div>)}
      <div className="sidebar-bottom">{role !== "Customer" && <div className="help-card"><div className="help-icon"><LifeBuoy size={17}/></div><strong>Need a hand?</strong><span>Explore the demo workflow and insights.</span><button type="button" onClick={() => changePage("Business Assistant")}>Open assistant <ArrowUpRight size={13}/></button></div>}<div className="profile"><div className="avatar">{user.name.slice(0,1)}</div><div><strong>{user.name}</strong><span>{role} access</span></div><button type="button" className="icon-button" onClick={onLogout} title="Sign out"><X size={15}/></button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><strong>{headerTitle}</strong></div>
        <div className="top-actions">{role !== "Customer" && <div className="searchbox"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search current page..." /></div>}{role !== "Customer" && <button type="button" className="icon-button notification" onClick={() => changePage("Revenue Protection")} title="Revenue alerts"><Bell size={18}/>{openAlerts.length > 0 && <i/>}</button>}{role === "Admin" && <button type="button" className="icon-button" onClick={resetDemo} title="Reset demo data"><RefreshCw size={16}/></button>}<div className="role-select"><span>{role}</span></div></div>
      </header>
      <div className="page-content">
        {page === "My Account" && <CustomerPortal data={customerData} user={user}/>}
        {role !== "Customer" && page === "Dashboard" && <Dashboard data={data} metrics={metrics} alerts={openAlerts} chartData={chartData} customersById={customersById} onNavigate={changePage} />}
        {role !== "Customer" && page === "Customers" && <Customers data={data} items={filtered(data.customers, (x) => `${x.name} ${x.email} ${x.company}`)} onAdd={() => setModal({ type: "customer" })} />}
        {role === "Admin" && page === "Products" && <Products data={data} items={filtered(data.products, (x) => `${x.name} ${x.type}`)} onAdd={() => setModal({ type: "product" })} />}
        {role === "Admin" && page === "Plans" && <Plans data={data} items={filtered(data.plans, (x) => `${x.name} ${x.frequency}`)} onAdd={() => setModal({ type: "plan" })} />}
        {role !== "Customer" && page === "Quotations" && <QuotationsPage data={data} customers={data.customers} plans={data.plans} products={data.products} onAdd={addQuotation} onConvert={convertQuotation} />}
        {role === "Admin" && page === "Team & Access" && <TeamManagement users={teamUsers} onAdd={addStaffAccount} />}
        {role === "Admin" && page === "Discounts" && <DiscountsPage discounts={data.discounts || []} onAdd={addDiscount} />}
        {role !== "Customer" && page === "Subscriptions" && <Subscriptions data={data} items={filtered(data.subscriptions, (x) => `${x.id} ${customersById[x.customerId]?.name || ""} ${x.status}`)} customers={customersById} plans={plansById} products={productsById} onAdd={() => setModal({ type: "subscription" })} onStatus={changeSubscriptionStatus} />}
        {role !== "Customer" && page === "Invoices & Payments" && <Invoices data={data} items={filtered(data.invoices, (x) => `${x.id} ${customersById[x.customerId]?.name || ""} ${x.status}`)} customers={customersById} subscriptions={data.subscriptions} onGenerate={generateDueInvoices} onPay={(invoice) => setModal({ type: "payment", invoice })} />}
        {role !== "Customer" && page === "Revenue Protection" && <RevenueProtection alerts={openAlerts} data={data} customers={customersById} onResolve={resolveAlert} onRecover={recordRecovery} />}
        {role !== "Customer" && page === "Forecast & Simulator" && <Forecast data={data} metrics={metrics} scenario={scenario} setScenario={setScenario} chartData={chartData} />}
        {role !== "Customer" && page === "Business Assistant" && <Assistant query={assistantQuery} setQuery={setAssistantQuery} answer={assistantAnswer} onAsk={askAssistant} metrics={metrics} />}
        {!allowedPages.includes(page) && <section className="panel access-fallback"><ShieldCheck size={22}/><h2>Page unavailable</h2><p>This page is not available for the current role. Choose an item from the sidebar to continue.</p><button className="button primary" type="button" onClick={() => changePage(role === "Customer" ? "My Account" : "Dashboard")}>Go to dashboard</button></section>}
      </div>
    </main>
    {role !== "Customer" && modal && <Modal title={modal.type === "customer" ? "Add customer" : modal.type === "product" ? "Add product" : modal.type === "plan" ? "Create plan" : modal.type === "subscription" ? "Create subscription" : `Record payment · ${modal.invoice.id}`} onClose={() => setModal(null)}>
      {modal.type === "customer" && <CustomerForm onSubmit={addCustomer}/>}
      {modal.type === "product" && <ProductForm onSubmit={addProduct}/>}
      {modal.type === "plan" && <PlanForm onSubmit={addPlan}/>}
      {modal.type === "subscription" && <SubscriptionForm customers={data.customers} plans={data.plans} products={data.products} form={form} update={update} onSubmit={addSubscription}/>}
      {modal.type === "payment" && <PaymentForm invoice={modal.invoice} onSubmit={(payload) => recordPayment(modal.invoice, payload)}/>}
    </Modal>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}


function LoginScreen({onLogin}) {
 const [email,setEmail]=useState("admin@subscriptpro.demo"),[password,setPassword]=useState("Admin@123"),[error,setError]=useState(""),[show,setShow]=useState(false);
 const submit=e=>{e.preventDefault();if(!onLogin(email,password))setError("Incorrect email or password. Select a demo account below.");};
 return <div className="login-screen"><section className="login-card"><div className="login-brand"><div className="brand-mark"><Activity size={22}/></div><div><strong>SubscriptPro AI</strong><span>Smart subscription management</span></div></div><div className="login-intro"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to your workspace</h1><p>Manage recurring revenue, billing and revenue protection in one place.</p></div><form onSubmit={submit} className="login-form"><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<div className="password-wrap"><input type={show?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div></label>{error&&<div className="login-error">{error}</div>}<button className="button primary login-submit" type="submit">Sign in <ArrowUpRight size={16}/></button></form><div className="demo-accounts"><strong>Judge demo accounts</strong><p>Use these accounts to test role-based screens.</p>{[["Admin","admin@subscriptpro.demo","Admin@123"],["Staff","staff@subscriptpro.demo","Staff@123"],["Customer","customer@subscriptpro.demo","Customer@123"],["Customer","bluepeak@subscriptpro.demo","Bluepeak@123"],["Customer","northstar@subscriptpro.demo","Northstar@123"],["Customer","pixelcraft@subscriptpro.demo","Pixelcraft@123"]].map(([r,e,p])=><button key={e} type="button" onClick={()=>{setEmail(e);setPassword(p);setError("");}}><b>{r}</b><span>{e}</span><small>{p}</small></button>)}</div><div className="login-foot"><ShieldCheck size={14}/> Demo environment · Payments are simulated</div></section></div>;
}
function CustomerPortal({data,user}) {
 const customer=data.customers[0],outstanding=data.invoices.reduce((s,i)=>s+Math.max(0,Number(i.total)-Number(i.paid)),0);
 return <><PageHeading eyebrow="CUSTOMER PORTAL" title={`Welcome, ${customer?.name||user.name}`} description="View only your own subscriptions, invoices and payment history."/><div className="stat-grid"><StatCard label="My subscriptions" value={data.subscriptions.length} icon={RefreshCw} tone="blue"/><StatCard label="Active subscriptions" value={data.subscriptions.filter(s=>s.status==="Active").length} icon={CheckCircle2} tone="green"/><StatCard label="Outstanding balance" value={money(outstanding)} icon={Wallet} tone="orange"/><StatCard label="My invoices" value={data.invoices.length} icon={FileText}/></div><section className="panel table-panel"><div className="panel-head"><div><h3>My subscriptions</h3><p>Your current and previous subscription agreements</p></div></div><div className="table-scroll"><table><thead><tr><th>Subscription</th><th>Plan</th><th>Start date</th><th>Next billing</th><th>Status</th></tr></thead><tbody>{data.subscriptions.map(s=><tr key={s.id}><td><strong>{s.id}</strong></td><td>{data.plans.find(p=>p.id===s.planId)?.name||"Subscription plan"}</td><td>{s.startDate}</td><td>{s.nextBillingDate||"—"}</td><td><StatusPill status={s.status}/></td></tr>)}{!data.subscriptions.length&&<EmptyRow text="No subscriptions found." cols={5}/>}</tbody></table></div></section><section className="panel table-panel"><div className="panel-head"><div><h3>My invoices</h3><p>Invoice status and payment balances</p></div></div><div className="table-scroll"><table><thead><tr><th>Invoice</th><th>Issue date</th><th>Due date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead><tbody>{data.invoices.map(i=><tr key={i.id}><td><strong>{i.id}</strong></td><td>{i.issueDate}</td><td>{i.dueDate}</td><td>{money(i.total)}</td><td>{money(i.paid)}</td><td>{money(Math.max(0,i.total-i.paid))}</td><td><StatusPill status={invoiceStatus(i)}/></td></tr>)}{!data.invoices.length&&<EmptyRow text="No invoices found." cols={7}/>}</tbody></table></div></section><section className="panel table-panel"><div className="panel-head"><div><h3>My payment history</h3><p>Payments recorded against your invoices</p></div></div><div className="table-scroll"><table><thead><tr><th>Payment</th><th>Invoice</th><th>Date</th><th>Method</th><th>Amount</th></tr></thead><tbody>{data.payments.map(p=><tr key={p.id}><td><strong>{p.id}</strong></td><td>{p.invoiceId}</td><td>{p.date}</td><td>{p.method}</td><td>{money(p.amount)}</td></tr>)}{!data.payments.length&&<EmptyRow text="No payment records found." cols={5}/>}</tbody></table></div></section><div className="notice"><ShieldCheck size={16}/><p>This portal displays records linked to the signed-in demo customer only.</p></div></>;
}



function TeamManagement({users,onAdd}) {
 const [v,setV]=useState({name:"",email:"",password:""});
 const set=(k,x)=>setV(o=>({...o,[k]:x}));
 return <><PageHeading eyebrow="ADMINISTRATION" title="Team & access" description="Only administrators can create internal staff demo accounts. Customers cannot access team records."/><section className="panel table-panel"><div className="panel-head"><div><h3>Create staff account</h3><p>New staff members receive operational access, not catalogue or discount administration.</p></div></div><form className="form-grid" onSubmit={e=>{e.preventDefault();onAdd(v);setV({name:"",email:"",password:""});}}><FormField label="Staff name"><input required value={v.name} onChange={e=>set("name",e.target.value)}/></FormField><FormField label="Email"><input required type="email" value={v.email} onChange={e=>set("email",e.target.value)}/></FormField><FormField label="Temporary password (min 9 characters)"><input required minLength="9" value={v.password} onChange={e=>set("password",e.target.value)}/></FormField><div className="form-actions"><button className="button primary" type="submit">Create staff account</button></div></form></section><section className="panel table-panel"><div className="panel-head"><div><h3>Workspace accounts</h3><p>Demo account directory</p></div></div><div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th></tr></thead><tbody>{users.map(u=><tr key={u.email}><td><strong>{u.name}</strong></td><td>{u.email}</td><td><StatusPill status={u.role}/></td><td>{u.role==="Admin"?"Full administration":u.role==="Staff"?"Daily operations":"Own customer records only"}</td></tr>)}</tbody></table></div></section><div className="notice"><ShieldCheck size={16}/><p>Demo-only: accounts are stored in this browser and passwords are not protected by a server. Do not use real credentials. Production authentication must be implemented on a backend.</p></div></>;
}

function QuotationsPage({data,customers,plans,products,onAdd,onConvert}) {
 const [v,setV]=useState({customerId:"",planId:"",productId:"",quantity:1,validDays:15});
 const set=(k,x)=>setV(o=>({...o,[k]:x}));
 return <><PageHeading eyebrow="SALES WORKFLOW" title="Quotations" description="Create time-limited subscription offers and convert accepted quotations into subscriptions."/><section className="panel table-panel"><div className="panel-head"><div><h3>Create quotation</h3><p>Select a customer, plan and product to prepare an offer.</p></div></div><form className="form-grid quote-form" onSubmit={e=>{e.preventDefault();onAdd(v);}}><FormField label="Customer"><select required value={v.customerId} onChange={e=>set("customerId",e.target.value)}><option value="">Select customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField><FormField label="Plan"><select required value={v.planId} onChange={e=>set("planId",e.target.value)}><option value="">Select plan</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}</select></FormField><FormField label="Product"><select required value={v.productId} onChange={e=>set("productId",e.target.value)}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FormField><FormField label="Quantity"><input type="number" min="1" value={v.quantity} onChange={e=>set("quantity",e.target.value)}/></FormField><FormField label="Validity (days)"><input type="number" min="1" max="90" value={v.validDays} onChange={e=>set("validDays",e.target.value)}/></FormField><div className="form-actions"><button className="button primary" type="submit">Create quotation</button></div></form></section><section className="panel table-panel"><div className="panel-head"><div><h3>Quotation register</h3><p>{(data.quotations||[]).length} quotation(s)</p></div></div><div className="table-scroll"><table><thead><tr><th>Quotation</th><th>Customer</th><th>Plan / Product</th><th>Quantity</th><th>Valid until</th><th>Status</th><th>Action</th></tr></thead><tbody>{(data.quotations||[]).map(q=><tr key={q.id}><td><strong>{q.id}</strong></td><td>{customers.find(c=>c.id===q.customerId)?.name||"—"}</td><td>{plans.find(p=>p.id===q.planId)?.name||"—"}<small className="subline">{products.find(p=>p.id===q.productId)?.name||"—"}</small></td><td>{q.quantity}</td><td>{q.validUntil}</td><td><StatusPill status={q.status}/></td><td>{q.status!=="Converted"?<button className="small-action" onClick={()=>onConvert(q)}>Accept & convert</button>:<span className="muted">{q.subscriptionId}</span>}</td></tr>)}{!(data.quotations||[]).length&&<EmptyRow text="No quotations yet. Create the first offer above." cols={7}/>}</tbody></table></div></section></>;
}
function DiscountsPage({discounts,onAdd}) {
 const [v,setV]=useState({code:"",type:"Percentage",value:10,minPurchase:0,usageLimit:0,startDate:todayISO(),endDate:""});
 const set=(k,x)=>setV(o=>({...o,[k]:x}));
 return <><PageHeading eyebrow="PRICING CONTROLS" title="Discount rules" description="Create time-bound fixed or percentage discounts with minimum purchase and usage limits."/><section className="panel table-panel"><div className="panel-head"><div><h3>New discount rule</h3><p>Eligible active rules are automatically applied to generated invoices.</p></div></div><form className="form-grid" onSubmit={e=>{e.preventDefault();onAdd(v);}}><FormField label="Discount code"><input required value={v.code} onChange={e=>set("code",e.target.value)} placeholder="WELCOME10"/></FormField><FormField label="Discount type"><select value={v.type} onChange={e=>set("type",e.target.value)}><option>Percentage</option><option>Fixed</option></select></FormField><FormField label={v.type==="Fixed"?"Amount (₹)":"Percentage (%)"}><input type="number" min="0.01" step="0.01" value={v.value} onChange={e=>set("value",e.target.value)}/></FormField><FormField label="Minimum purchase (₹)"><input type="number" min="0" value={v.minPurchase} onChange={e=>set("minPurchase",e.target.value)}/></FormField><FormField label="Usage limit (0 = unlimited)"><input type="number" min="0" value={v.usageLimit} onChange={e=>set("usageLimit",e.target.value)}/></FormField><FormField label="Starts on"><input type="date" value={v.startDate} onChange={e=>set("startDate",e.target.value)}/></FormField><FormField label="Expires on"><input type="date" value={v.endDate} onChange={e=>set("endDate",e.target.value)}/></FormField><div className="form-actions"><button className="button primary" type="submit">Save discount</button></div></form></section><section className="panel table-panel"><div className="panel-head"><div><h3>Discount register</h3><p>{discounts.length} configured rule(s)</p></div></div><div className="table-scroll"><table><thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Minimum</th><th>Usage</th><th>Validity</th><th>Status</th></tr></thead><tbody>{discounts.map(d=><tr key={d.id}><td><strong>{d.code}</strong></td><td>{d.type}</td><td>{d.type==="Fixed"?money(d.value):`${d.value}%`}</td><td>{money(d.minPurchase)}</td><td>{d.used}/{d.usageLimit||"∞"}</td><td>{d.startDate||"—"} → {d.endDate||"No expiry"}</td><td><StatusPill status={d.active&&(!d.usageLimit||d.used<d.usageLimit)?"Active":"Closed"}/></td></tr>)}{!discounts.length&&<EmptyRow text="No discount rules created yet." cols={7}/>}</tbody></table></div></section></>;
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Dashboard({ data, metrics, alerts, chartData, customersById, onNavigate }) {
  const recent = [...data.invoices].sort((a,b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 5);
  return <>
    <PageHeading eyebrow="OVERVIEW" title="Good morning, Admin" description="Here is what is happening across your subscription business today." action={<button className="button secondary" onClick={() => onNavigate("Revenue Protection")}><ShieldCheck size={16}/> View protection center</button>}/>
    <div className="stat-grid">
      <StatCard label="Active subscriptions" value={metrics.active} note="Currently generating recurring revenue" icon={RefreshCw} tone="blue"/>
      <StatCard label="Monthly recurring revenue" value={money(metrics.mrr)} note="Normalized monthly subscription value" icon={BadgeIndianRupee} tone="violet"/>
      <StatCard label="Collected revenue" value={money(metrics.collected)} note="Recorded payment transactions" icon={Wallet} tone="green"/>
      <StatCard label="Outstanding balance" value={money(metrics.outstanding)} note={`${metrics.overdue} overdue invoice(s)`} icon={CreditCard} tone="orange"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><h3>Revenue performance</h3><p>Recorded collections vs invoices issued</p></div><span className="period-chip">Last 6 months</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={7}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf3"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 11 }} tickFormatter={(v) => `₹${Math.round(v/1000)}k`}/><Tooltip formatter={(v) => money(v)}/><Legend iconType="circle"/><Bar dataKey="Collected" fill="#27b58a" radius={[5,5,0,0]} maxBarSize={24}/><Bar dataKey="Invoiced" fill="#6478ed" radius={[5,5,0,0]} maxBarSize={24}/></BarChart></ResponsiveContainer></div></section>
      <section className="panel protection-panel"><div className="panel-head"><div><h3>Revenue protection</h3><p>Potential issues that need attention</p></div><ShieldCheck size={20} className="muted-icon"/></div><div className="risk-number">{alerts.length}<span>open alerts</span></div><div className="risk-meter"><div style={{ width: `${Math.min(100, alerts.length * 13)}%` }}/></div><div className="risk-breakdown"><div><span className="dot red"/>High severity <strong>{alerts.filter(a => a.severity === "High").length}</strong></div><div><span className="dot amber"/>Medium severity <strong>{alerts.filter(a => a.severity === "Medium").length}</strong></div></div><button className="text-button" onClick={() => onNavigate("Revenue Protection")}>Review alerts <ArrowUpRight size={14}/></button></section>
    </div>
    <section className="panel table-panel"><div className="panel-head"><div><h3>Recent invoices</h3><p>Latest billing activity across customers</p></div><button className="text-button" onClick={() => onNavigate("Invoices & Payments")}>View all <ArrowUpRight size={14}/></button></div><InvoiceTable invoices={recent} customers={customersById}/></section>
    <div className="insight-strip"><div className="insight-icon"><Lightbulb size={19}/></div><div><strong>Business insight</strong><p>Keep an eye on overdue balances and expected billing dates. Revenue protection alerts are evidence-based estimates, not confirmed financial losses.</p></div><button className="text-button" onClick={() => onNavigate("Business Assistant")}>Ask assistant <ArrowUpRight size={14}/></button></div>
  </>;
}

function Customers({ data, items, onAdd }) {
  return <><PageHeading eyebrow="RELATIONSHIPS" title="Customers" description="Manage customer accounts and monitor their subscription health." action={<button className="button primary" onClick={onAdd}><Plus size={16}/> Add customer</button>}/><div className="stat-grid compact"><StatCard label="Total customers" value={data.customers.length} icon={Users}/><StatCard label="Active accounts" value={data.customers.filter(c => data.subscriptions.some(s => s.customerId === c.id && s.status === "Active")).length} icon={Building2} tone="green"/><StatCard label="High-risk customers" value={data.customers.filter(c => healthScore(c.id, data).score < 60).length} icon={AlertTriangle} tone="orange"/></div><section className="panel table-panel"><div className="panel-head"><div><h3>Customer directory</h3><p>{items.length} customer records</p></div></div><div className="table-scroll"><table><thead><tr><th>Customer</th><th>Company</th><th>Contact</th><th>Subscriptions</th><th>Health score</th><th>Created</th></tr></thead><tbody>{items.map(c => { const h = healthScore(c.id, data); return <tr key={c.id}><td><div className="person-cell"><div className="avatar small">{c.name.slice(0,1)}</div><div><strong>{c.name}</strong><small>{c.id}</small></div></div></td><td>{c.company || "—"}</td><td>{c.email}<small className="subline">{c.phone || "No phone"}</small></td><td>{data.subscriptions.filter(s => s.customerId === c.id).length}</td><td><HealthPill score={h.score} band={h.band} parts={h.parts}/></td><td>{c.createdAt}</td></tr>})}{items.length === 0 && <EmptyRow text="No customers found. Add your first customer." cols={6}/>}</tbody></table></div></section></>;
}

function Products({ data, items, onAdd }) {
  return <><PageHeading eyebrow="CATALOGUE" title="Products" description="Maintain the products and services offered through subscriptions." action={<button className="button primary" onClick={onAdd}><Plus size={16}/> Add product</button>}/><section className="catalog-grid">{items.map(p => <div className="panel product-card" key={p.id}><div className="product-symbol"><Package size={21}/></div><span className="status-pill neutral">{p.type}</span><h3>{p.name}</h3><p>{p.notes || "No description provided."}</p>{p.variants?.length>0&&<div className="permission-row">{p.variants.map(v=><span key={v.name} className="yes">{v.name} +{money(v.extra)}</span>)}</div>}<div className="product-price">{money(p.price)}<small> / billing unit</small></div><div className="product-footer"><span>Cost: {money(p.cost)}</span><span>Margin: {p.price ? Math.round((p.price-p.cost)/p.price*100) : 0}%</span></div></div>)}{items.length === 0 && <div className="empty-card">No products found.</div>}</section></>;
}

function Plans({ data, items, onAdd }) {
  return <><PageHeading eyebrow="BILLING CONFIGURATION" title="Plans" description="Configure recurring price, billing frequency and subscription permissions." action={<button className="button primary" onClick={onAdd}><Plus size={16}/> Create plan</button>}/><section className="catalog-grid">{items.map(p => <div className="panel plan-card" key={p.id}><div className="plan-top"><div className="product-symbol"><BriefcaseBusiness size={20}/></div><span className="status-pill success">Available</span></div><h3>{p.name}</h3><div className="plan-price">{money(p.price)}<small> / {p.frequency}</small></div><div className="plan-meta"><span>Minimum quantity</span><strong>{p.minQty}</strong></div><div className="plan-meta"><span>Available from</span><strong>{p.availableFrom || "Anytime"}</strong></div><div className="permission-row"><span className={p.allowPause ? "yes" : ""}>Pause</span><span className={p.allowRenew ? "yes" : ""}>Renew</span><span className={p.allowEarlyClose ? "yes" : ""}>Early close</span></div></div>)}{items.length === 0 && <div className="empty-card">No plans found.</div>}</section></>;
}

function Subscriptions({ data, items, customers, plans, products, onAdd, onStatus }) {
  return <><PageHeading eyebrow="RECURRING BUSINESS" title="Subscriptions" description="Track subscription lifecycle, billing dates and customer commitments." action={<button className="button primary" onClick={onAdd}><Plus size={16}/> New subscription</button>}/><section className="panel table-panel"><div className="panel-head"><div><h3>Subscription register</h3><p>{items.length} subscription records</p></div></div><div className="table-scroll"><table><thead><tr><th>Subscription</th><th>Customer</th><th>Product / Plan</th><th>Value</th><th>Next billing</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(s => <tr key={s.id}><td><strong>{s.id}</strong><small className="subline">Started {s.startDate}</small></td><td>{customers[s.customerId]?.name || "Unknown"}</td><td>{products[s.productId]?.name || "—"}<small className="subline">{plans[s.planId]?.name || "—"}</small></td><td>{money(s.price * s.quantity)}<small className="subline">{s.frequency || plans[s.planId]?.frequency || "monthly"}</small></td><td>{s.nextBillingDate || "—"}</td><td><StatusPill status={s.status}/></td><td><select className="table-select" value={s.status} onChange={e => onStatus(s.id, e.target.value)}><option>Active</option><option>Paused</option><option>Closed</option><option>Expired</option></select></td></tr>)}{items.length === 0 && <EmptyRow text="No subscriptions found." cols={7}/>}</tbody></table></div></section></>;
}

function Invoices({ data, items, customers, subscriptions, onGenerate, onPay }) {
  return <><PageHeading eyebrow="ACCOUNTS RECEIVABLE" title="Invoices & Payments" description="Generate due invoices, record simulated payments and monitor outstanding balances." action={<button className="button primary" onClick={onGenerate}><RefreshCw size={16}/> Generate due invoices</button>}/><div className="stat-grid compact"><StatCard label="Invoices" value={data.invoices.length} icon={FileText}/><StatCard label="Outstanding" value={money(data.invoices.reduce((s,i) => s + Math.max(0,i.total-i.paid),0))} icon={Wallet} tone="orange"/><StatCard label="Payments recorded" value={data.payments.length} icon={CreditCard} tone="green"/></div><section className="panel table-panel"><div className="panel-head"><div><h3>Invoice register</h3><p>Payments are simulated and do not collect real money.</p></div></div><div className="table-scroll"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Period</th><th>Issue / Due</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map(i => { const status = invoiceStatus(i); return <tr key={i.id}><td><strong>{i.id}</strong><small className="subline">{i.subscriptionId}</small></td><td>{customers[i.customerId]?.name || "Unknown"}</td><td>{i.period}</td><td>{i.issueDate}<small className="subline">Due {i.dueDate}</small></td><td>{money(i.total)}</td><td>{money(i.paid)}</td><td><strong>{money(Math.max(0,i.total-i.paid))}</strong></td><td><StatusPill status={status}/></td><td>{status !== "Paid" && status !== "Cancelled" ? <button className="small-action" onClick={() => onPay(i)}>Record payment</button> : <span className="muted">—</span>}</td></tr>})}{items.length === 0 && <EmptyRow text="No invoices found. Generate due invoices from active subscriptions." cols={9}/>}</tbody></table></div></section><section className="panel table-panel"><div className="panel-head"><div><h3>Payment ledger</h3><p>Payment records linked to invoices</p></div></div><div className="table-scroll"><table><thead><tr><th>Payment</th><th>Invoice</th><th>Method</th><th>Date</th><th>Note</th><th>Amount</th></tr></thead><tbody>{data.payments.map(p => <tr key={p.id}><td><strong>{p.id}</strong></td><td>{p.invoiceId}</td><td>{p.method}</td><td>{p.date}</td><td>{p.note}</td><td>{money(p.amount)}</td></tr>)}{data.payments.length === 0 && <EmptyRow text="No payments recorded." cols={6}/>}</tbody></table></div></section></>;
}

function RevenueProtection({ alerts, data, customers, onResolve, onRecover }) {
  const exposure = alerts.reduce((s,a) => s + Number(a.amount || 0), 0);
  const resolved = data.alerts.filter(a => a.status === "Resolved").length;
  const recovered = (data.recoveryEvents || []).reduce((s, event) => s + Number(event.amount || 0), 0);
  return <><PageHeading eyebrow="REVENUE INTELLIGENCE" title="Revenue Protection Center" description="Detect billing anomalies early and track the review of potential revenue leakage." action={<div className="status-pill success"><ShieldCheck size={13}/> Monitoring active</div>}/><div className="stat-grid"><StatCard label="Open alerts" value={alerts.length} icon={AlertTriangle} tone="orange"/><StatCard label="Potential exposure" value={money(exposure)} note="Estimated value, not confirmed loss" icon={BadgeIndianRupee} tone="red"/><StatCard label="Reviewed alerts" value={resolved} icon={CheckCircle2} tone="green"/><StatCard label="Recovered revenue" value={money(recovered)} note="Recorded payment/correction events" icon={Wallet} tone="green"/><StatCard label="Active subscriptions" value={data.subscriptions.filter(s => s.status === "Active").length} icon={RefreshCw}/></div><section className="panel alert-panel"><div className="panel-head"><div><h3>Detected revenue risks</h3><p>Each alert includes a reason and suggested next action.</p></div><span className="period-chip">{alerts.length} open</span></div>{alerts.length ? <div className="alert-list">{alerts.map(a => <div className="alert-row" key={a.id}><div className={`alert-icon ${a.severity === "High" ? "high" : "medium"}`}><AlertTriangle size={18}/></div><div className="alert-main"><div className="alert-title-row"><strong>{a.type}</strong><span className={`severity ${a.severity.toLowerCase()}`}>{a.severity} severity</span></div><p>{a.evidence}</p><div className="alert-meta">Reference: {a.entity} · Alert ID: {a.id}</div><div className="recommendation"><Lightbulb size={14}/><span>{a.recommendation}</span></div></div><div className="alert-side"><strong>{money(a.amount)}</strong><div className="alert-actions"><button className="small-action" onClick={() => onRecover(a)}>Record recovery</button><button className="small-action secondary-action" onClick={() => onResolve(a)}>Mark reviewed</button></div></div></div>)}</div> : <div className="success-empty"><div><CheckCircle2 size={25}/></div><strong>No open alerts</strong><p>Current records have no detected issues under the configured demo rules.</p></div>}</section><section className="panel table-panel"><div className="panel-head"><div><h3>Recovery tracker</h3><p>Amounts entered after a completed payment or documented correction</p></div><strong>{money(recovered)} recovered</strong></div><div className="table-scroll"><table><thead><tr><th>Recovery</th><th>Alert</th><th>Date</th><th>Reference / note</th><th>Amount</th></tr></thead><tbody>{(data.recoveryEvents || []).map(event=><tr key={event.id}><td><strong>{event.id}</strong></td><td>{event.alertId}</td><td>{event.date}</td><td>{event.note}</td><td>{money(event.amount)}</td></tr>)}{!(data.recoveryEvents || []).length&&<EmptyRow text="No recovery events recorded yet." cols={5}/>}</tbody></table></div></section><div className="notice"><CircleHelp size={17}/><p><strong>How to interpret this page:</strong> an alert is a potential issue based on available records. Marking it reviewed does not mean money has been recovered. Use Record recovery only after a payment or correction is completed, and enter the actual amount with its reference.</p></div></>;
}

function Forecast({ data, metrics, scenario, setScenario, chartData }) {
  const baseline = metrics.mrr;
  const projected = baseline * (1 + scenario.growth/100) * (1 + scenario.priceIncrease/100) * (1 - scenario.churn/100);
  const diff = projected - baseline;
  const forecastRows = [
    ["Current MRR", money(baseline), "Current normalized subscription value"],
    ["Projected MRR", money(projected), "Scenario estimate based on your assumptions"],
    ["Monthly difference", `${diff >= 0 ? "+" : ""}${money(diff)}`, `${diff >= 0 ? "Increase" : "Decrease"} vs current MRR`],
    ["Annualized run rate", money(projected * 12), "Projected MRR × 12"]
  ];
  return <><PageHeading eyebrow="PLANNING & ANALYTICS" title="Forecast & What-If Simulator" description="Explore how pricing, customer growth and churn assumptions could affect recurring revenue."/><div className="forecast-grid"><section className="panel simulator-panel"><div className="panel-head"><div><h3>Scenario assumptions</h3><p>Adjust the sliders to model a possible future.</p></div><div className="sim-icon"><Gauge size={19}/></div></div><ScenarioSlider label="Customer growth" value={scenario.growth} min={-20} max={50} onChange={v => setScenario(s => ({...s,growth:v}))} suffix="%"/><ScenarioSlider label="Price increase" value={scenario.priceIncrease} min={-20} max={30} onChange={v => setScenario(s => ({...s,priceIncrease:v}))} suffix="%"/><ScenarioSlider label="Customer churn" value={scenario.churn} min={0} max={30} onChange={v => setScenario(s => ({...s,churn:v}))} suffix="%"/><button className="button secondary full" onClick={() => setScenario({growth:10,priceIncrease:5,churn:3})}><RefreshCw size={15}/> Reset assumptions</button></section><section className="panel projection-panel"><div className="panel-head"><div><h3>Revenue projection</h3><p>Scenario output compared with current baseline</p></div><span className={`change-chip ${diff >= 0 ? "positive" : "negative"}`}>{diff >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {baseline ? `${Math.abs(diff/baseline*100).toFixed(1)}%` : "0%"}</span></div><div className="projection-amount">{money(projected)}<span>Projected monthly recurring revenue</span></div><div className="comparison"><div><span>Current MRR</span><strong>{money(baseline)}</strong></div><div><span>Projected change</span><strong className={diff >= 0 ? "green-text" : "red-text"}>{diff >= 0 ? "+" : ""}{money(diff)}</strong></div></div><div className="projection-bar"><div style={{width:`${baseline+projected ? Math.min(100, projected/(baseline+projected)*100) : 50}%`}}/></div><div className="projection-legend"><span><i className="dot blue"/> Current</span><span><i className="dot green"/> Scenario</span></div></section></div><section className="panel table-panel"><div className="panel-head"><div><h3>Forecast summary</h3><p>Illustrative estimates; not guaranteed collections.</p></div></div><div className="forecast-summary">{forecastRows.map(([a,b,c]) => <div key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</div></section><section className="panel chart-panel"><div className="panel-head"><div><h3>Recorded billing history</h3><p>Actual demo invoices and payment records, not forecast values</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf3"/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={v => `₹${Math.round(v/1000)}k`}/><Tooltip formatter={v => money(v)}/><Legend/><Bar dataKey="Collected" fill="#27b58a" radius={[5,5,0,0]}/><Bar dataKey="Invoiced" fill="#6478ed" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></section><div className="notice"><CircleHelp size={17}/><p>The simulator changes no customer, subscription, invoice or payment records. The calculation applies customer growth, price change and churn sequentially to current MRR. It is a simple scenario model, not a statistical prediction.</p></div></>;
}

function Assistant({ query, setQuery, answer, onAsk, metrics }) {
  const examples = ["What is our current MRR?", "How much revenue is overdue?", "Show open revenue leak alerts", "Which customers are high risk?", "How much have we collected?"];
  return <><PageHeading eyebrow="AI-ASSISTED ANALYTICS" title="Business Assistant" description="Ask questions about the live demo records. Answers are calculated from your current workspace data."/><div className="assistant-layout"><section className="assistant-card"><div className="assistant-brand"><div className="assistant-orb"><MessageSquareText size={25}/></div><div><h2>SubscriptPro Assistant</h2><p>Business data assistant · Demo mode</p></div><span className="online-dot">● Online</span></div><div className="assistant-welcome"><div className="assistant-avatar"><Lightbulb size={18}/></div><div><strong>What would you like to understand?</strong><p>I can summarize recurring revenue, payment status, subscription risk and detected billing issues using the records currently saved in this browser.</p></div></div><div className="example-questions"><span>TRY ASKING</span>{examples.map(x => <button key={x} onClick={() => setQuery(x)}>{x}<ArrowUpRight size={13}/></button>)}</div><form className="assistant-input" onSubmit={e => {e.preventDefault();onAsk();}}><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask about your subscription business..." /><button className="button primary" type="submit" disabled={!query.trim()}>Ask <ArrowUpRight size={15}/></button></form>{answer && <div className="assistant-answer"><div className="assistant-avatar"><MessageSquareText size={17}/></div><div><strong>Analysis from your workspace</strong><p>{answer}</p></div></div>}</section><aside className="assistant-side"><div className="panel"><h3>Available data</h3><p className="side-desc">The assistant reads these current workspace metrics.</p><div className="data-point"><span>Active subscriptions</span><strong>{metrics.active}</strong></div><div className="data-point"><span>Current MRR</span><strong>{money(metrics.mrr)}</strong></div><div className="data-point"><span>Collected</span><strong>{money(metrics.collected)}</strong></div><div className="data-point"><span>Outstanding</span><strong>{money(metrics.outstanding)}</strong></div></div><div className="notice vertical"><CircleHelp size={17}/><p>This is a rule-based assistant, not a general-purpose generative AI model. It does not invent answers for unsupported questions.</p></div></aside></div></>;
}

function InvoiceTable({ invoices, customers }) {
  return <div className="table-scroll"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Issue date</th><th>Due date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{invoices.map(i => <tr key={i.id}><td><strong>{i.id}</strong><small className="subline">{i.subscriptionId}</small></td><td>{customers[i.customerId]?.name || "Unknown"}</td><td>{i.issueDate}</td><td>{i.dueDate}</td><td><strong>{money(i.total)}</strong></td><td><StatusPill status={invoiceStatus(i)}/></td></tr>)}{!invoices.length && <EmptyRow text="No invoices yet." cols={6}/>}</tbody></table></div>;
}
function StatusPill({ status }) {
  const cls = status === "Paid" || status === "Active" ? "success" : status === "Overdue" || status === "Closed" || status === "Expired" ? "danger" : status === "Paused" || status === "Partially Paid" ? "warning" : "neutral";
  return <span className={`status-pill ${cls}`}>{status}</span>;
}
function HealthPill({ score, band, parts = {} }) { const detail = `Payment ${parts.payment ?? 0}/35 · Overdue ${parts.overdue ?? 0}/25 · Renewal ${parts.renewal ?? 0}/20 · Stability ${parts.stability ?? 0}/10 · Activity ${parts.activity ?? 0}/10`; return <span title={detail} className={`health-pill ${score >= 80 ? "healthy" : score >= 60 ? "attention" : "risk"}`}><b>{score}</b> {band}</span>; }
function EmptyRow({ text, cols }) { return <tr><td colSpan={cols} className="empty-row">{text}</td></tr>; }
function ScenarioSlider({ label, value, min, max, onChange, suffix }) { return <div className="slider-field"><div><label>{label}</label><strong>{value > 0 && label !== "Customer churn" ? "+" : ""}{value}{suffix}</strong></div><input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}/><div className="range-labels"><span>{min}{suffix}</span><span>{max}{suffix}</span></div></div>; }

function FormField({ label, children }) { return <label className="form-field"><span>{label}</span>{children}</label>; }
function CustomerForm({ onSubmit }) {
  const [v,setV] = useState({name:"",email:"",phone:"",company:""});
  const set = (k,x) => setV(o=>({...o,[k]:x}));
  return <form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit(v);}}><FormField label="Customer name"><input required value={v.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Acme Technologies"/></FormField><FormField label="Email address"><input required type="email" value={v.email} onChange={e=>set("email",e.target.value)} placeholder="accounts@company.com"/></FormField><FormField label="Phone"><input value={v.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91..."/></FormField><FormField label="Company"><input value={v.company} onChange={e=>set("company",e.target.value)} placeholder="Company name"/></FormField><div className="form-actions"><button className="button primary" type="submit">Save customer</button></div></form>;
}
function ProductForm({ onSubmit }) {
  const [v,setV] = useState({name:"",type:"Software",price:"",cost:"",notes:"",variantName:"",variantExtra:0});
  const set = (k,x) => setV(o=>({...o,[k]:x}));
  return <form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit(v);}}><FormField label="Product name"><input required value={v.name} onChange={e=>set("name",e.target.value)}/></FormField><FormField label="Type"><select value={v.type} onChange={e=>set("type",e.target.value)}><option>Software</option><option>Service</option><option>Physical product</option></select></FormField><FormField label="Sales price (₹)"><input required type="number" min="0.01" step="0.01" value={v.price} onChange={e=>set("price",e.target.value)}/></FormField><FormField label="Cost price (₹)"><input type="number" min="0" step="0.01" value={v.cost} onChange={e=>set("cost",e.target.value)}/></FormField><FormField label="Notes"><textarea value={v.notes} onChange={e=>set("notes",e.target.value)} rows="3"/></FormField><FormField label="Optional variant name"><input value={v.variantName} onChange={e=>set("variantName",e.target.value)} placeholder="Priority support"/></FormField><FormField label="Variant additional charge (₹)"><input type="number" min="0" value={v.variantExtra} onChange={e=>set("variantExtra",e.target.value)}/></FormField><div className="form-actions"><button className="button primary" type="submit">Save product</button></div></form>;
}
function PlanForm({ onSubmit }) {
  const [v,setV] = useState({name:"",frequency:"monthly",price:"",minQty:1,availableFrom:todayISO(),availableTo:"",allowPause:true,allowRenew:true,allowEarlyClose:true,autoClose:false});
  const set = (k,x) => setV(o=>({...o,[k]:x}));
  return <form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit(v);}}><FormField label="Plan name"><input required value={v.name} onChange={e=>set("name",e.target.value)}/></FormField><FormField label="Billing frequency"><select value={v.frequency} onChange={e=>set("frequency",e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></FormField><FormField label="Price (₹)"><input required type="number" min="0.01" step="0.01" value={v.price} onChange={e=>set("price",e.target.value)}/></FormField><FormField label="Minimum quantity"><input type="number" min="1" value={v.minQty} onChange={e=>set("minQty",e.target.value)}/></FormField><FormField label="Available from"><input type="date" value={v.availableFrom} onChange={e=>set("availableFrom",e.target.value)}/></FormField><FormField label="Available until (optional)"><input type="date" value={v.availableTo} onChange={e=>set("availableTo",e.target.value)}/></FormField><FormField label="Allow pause"><select value={String(v.allowPause)} onChange={e=>set("allowPause",e.target.value==="true")}><option value="true">Yes</option><option value="false">No</option></select></FormField><FormField label="Allow renewal"><select value={String(v.allowRenew)} onChange={e=>set("allowRenew",e.target.value==="true")}><option value="true">Yes</option><option value="false">No</option></select></FormField><FormField label="Allow early close"><select value={String(v.allowEarlyClose)} onChange={e=>set("allowEarlyClose",e.target.value==="true")}><option value="true">Yes</option><option value="false">No</option></select></FormField><FormField label="Auto-close at end date"><select value={String(v.autoClose)} onChange={e=>set("autoClose",e.target.value==="true")}><option value="false">No</option><option value="true">Yes</option></select></FormField><div className="form-actions"><button className="button primary" type="submit">Create plan</button></div></form>;
}
function SubscriptionForm({ customers, plans, products, form, update, onSubmit }) {
  const selectedPlan = plans.find(p=>p.id===form.planId);
  const selectedProduct = products.find(p=>p.id===form.productId);
  return <form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit();}}><FormField label="Customer"><select required value={form.customerId} onChange={e=>update("customerId",e.target.value)}><option value="">Select customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField><FormField label="Plan"><select required value={form.planId} onChange={e=>{const p=plans.find(x=>x.id===e.target.value);update("planId",e.target.value);if(p)update("price",p.price);}}><option value="">Select plan</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)} / {p.frequency}</option>)}</select></FormField><FormField label="Product"><select required value={form.productId} onChange={e=>update("productId",e.target.value)}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FormField><FormField label="Product variant"><select value={form.variantName || ""} onChange={e=>{const v=selectedProduct?.variants?.find(x=>x.name===e.target.value);update("variantName",e.target.value);update("variantExtra",v?.extra||0);}}><option value="">Standard</option>{(selectedProduct?.variants||[]).map(v=><option key={v.name} value={v.name}>{v.name} · +{money(v.extra)}</option>)}</select></FormField><FormField label="Quantity"><input type="number" min={selectedPlan?.minQty || 1} value={form.quantity} onChange={e=>update("quantity",e.target.value)}/></FormField><FormField label="Unit price (₹)"><input type="number" min="0.01" step="0.01" value={form.price} onChange={e=>update("price",e.target.value)}/></FormField><FormField label="Tax (%)"><input type="number" min="0" max="100" value={form.taxRate} onChange={e=>update("taxRate",e.target.value)}/></FormField><FormField label="Discount (%)"><input type="number" min="0" max="100" value={form.discount} onChange={e=>update("discount",e.target.value)}/></FormField><FormField label="Start date"><input type="date" value={form.startDate} onChange={e=>update("startDate",e.target.value)}/></FormField><FormField label="Next billing date"><input required type="date" value={form.nextBillingDate} onChange={e=>update("nextBillingDate",e.target.value)}/></FormField><FormField label="End date (optional)"><input type="date" value={form.endDate} onChange={e=>update("endDate",e.target.value)}/></FormField><div className="form-actions"><button className="button primary" type="submit">Create subscription</button></div></form>;
}
function PaymentForm({ invoice, onSubmit }) {
  const [v,setV] = useState({amount:round2(invoice.total-invoice.paid),method:"UPI",date:todayISO(),note:""});
  const set = (k,x) => setV(o=>({...o,[k]:x}));
  return <form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit(v);}}><div className="payment-summary"><span>Invoice total</span><strong>{money(invoice.total)}</strong><span>Outstanding balance</span><strong>{money(invoice.total-invoice.paid)}</strong></div><FormField label="Payment amount (₹)"><input required type="number" min="0.01" max={round2(invoice.total-invoice.paid)} step="0.01" value={v.amount} onChange={e=>set("amount",e.target.value)}/></FormField><FormField label="Payment method"><select value={v.method} onChange={e=>set("method",e.target.value)}><option>UPI</option><option>Card (simulated)</option><option>Cash</option><option>Bank Transfer</option></select></FormField><FormField label="Payment date"><input type="date" value={v.date} onChange={e=>set("date",e.target.value)}/></FormField><FormField label="Note / reference"><input value={v.note} onChange={e=>set("note",e.target.value)} placeholder="Optional reference"/></FormField><div className="form-actions"><button className="button primary" type="submit">Record simulated payment</button></div></form>;
}
