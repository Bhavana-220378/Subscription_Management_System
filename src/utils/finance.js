export const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value || 0));

export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
export const todayISO = () => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };
export const makeId = (prefix) => `${prefix}-${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 9)}`;

export function invoiceAmounts(subscription) {
  const subtotal = round2(Number(subscription.price) * Number(subscription.quantity));
  const discount = round2(subtotal * (Number(subscription.discount || 0) / 100));
  const taxable = Math.max(0, subtotal - discount);
  const tax = round2(taxable * (Number(subscription.taxRate || 0) / 100));
  return { subtotal, discount, tax, total: round2(taxable + tax) };
}

export function invoiceStatus(invoice) {
  if (invoice.status === "Cancelled") return "Cancelled";
  if (invoice.paid >= invoice.total - 0.005) return "Paid";
  if (invoice.paid > 0) return "Partially Paid";
  if (invoice.dueDate < todayISO()) return "Overdue";
  return invoice.status === "Draft" ? "Draft" : "Confirmed";
}

export function getMetrics(data) {
  const active = data.subscriptions.filter((s) => s.status === "Active");
  const mrr = active.reduce((sum, s) => {
    const factor = s.frequency === "yearly" ? 1 / 12 : s.frequency === "weekly" ? 52 / 12 : s.frequency === "daily" ? 30 : 1;
    return sum + Number(s.price) * Number(s.quantity) * (1 - Number(s.discount || 0) / 100) * factor;
  }, 0);
  const collected = data.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const outstanding = data.invoices.filter((i) => i.status !== "Cancelled").reduce((sum, i) => sum + Math.max(0, Number(i.total) - Number(i.paid)), 0);
  const overdue = data.invoices.filter((i) => invoiceStatus(i) === "Overdue").length;
  return { active: active.length, mrr: round2(mrr), collected: round2(collected), outstanding: round2(outstanding), overdue };
}

export function healthScore(customerId, data) {
  const subs = data.subscriptions.filter((s) => s.customerId === customerId);
  const invoices = data.invoices.filter((i) => i.customerId === customerId);
  if (!subs.length) return { score: 50, band: "Needs attention", parts: { payment: 18, overdue: 12, renewal: 10, stability: 5, activity: 5 } };
  const overdueCount = invoices.filter((i) => invoiceStatus(i) === "Overdue").length;
  const paidCount = invoices.filter((i) => invoiceStatus(i) === "Paid").length;
  const payment = invoices.length ? Math.round(35 * paidCount / invoices.length) : 20;
  const overdue = Math.max(0, 25 - overdueCount * 12);
  const renewal = subs.some((s) => s.status === "Active" && s.allowRenew !== false) ? 18 : 10;
  const stability = Math.max(0, 10 - subs.filter((s) => ["Paused", "Closed"].includes(s.status)).length * 5);
  const activity = invoices.length ? 10 : 5;
  const score = Math.max(0, Math.min(100, payment + overdue + renewal + stability + activity));
  return { score, band: score >= 80 ? "Healthy" : score >= 60 ? "Needs attention" : "High risk", parts: { payment, overdue, renewal, stability, activity } };
}

export function detectRevenueLeaks(data) {
  const alerts = [];
  const today = todayISO();
  const invoiceKeys = new Set();
  data.invoices.forEach((invoice) => {
    if (invoice.status === "Cancelled") return;
    const key = `${invoice.subscriptionId}|${invoice.period}`;
    if (invoiceKeys.has(key)) {
      alerts.push({ id: `RL-DUP-${invoice.id}`, type: "Duplicate invoice", severity: "High", amount: invoice.total, entity: invoice.id, evidence: `More than one invoice exists for ${invoice.subscriptionId} in period ${invoice.period}.`, recommendation: "Review the duplicate and cancel the incorrect invoice.", status: "Open" });
    } else invoiceKeys.add(key);
    const expected = Number(invoice.subtotal) - Number(invoice.discount) + Number(invoice.tax);
    if (Math.abs(expected - Number(invoice.total)) > 0.02) {
      alerts.push({ id: `RL-TOTAL-${invoice.id}`, type: "Invoice total mismatch", severity: "High", amount: Math.abs(expected - Number(invoice.total)), entity: invoice.id, evidence: `Stored total ${invoice.total} differs from calculated total ${round2(expected)}.`, recommendation: "Recalculate the invoice and verify discount and tax.", status: "Open" });
    }
  });
  data.subscriptions.forEach((sub) => {
    if (sub.status === "Active" && sub.nextBillingDate && sub.nextBillingDate <= today) {
      const frequency = sub.frequency || "monthly";
      const expectedPeriod = frequency === "daily" || frequency === "weekly" ? sub.nextBillingDate : frequency === "yearly" ? sub.nextBillingDate.slice(0, 4) : sub.nextBillingDate.slice(0, 7);
      const hasCurrentInvoice = data.invoices.some((i) => i.subscriptionId === sub.id && i.period === expectedPeriod && i.status !== "Cancelled");
      if (!hasCurrentInvoice) alerts.push({ id: `RL-MISS-${sub.id}`, type: "Expected invoice missing", severity: "Medium", amount: Number(sub.price) * Number(sub.quantity), entity: sub.id, evidence: `Active subscription was due on ${sub.nextBillingDate}, but no invoice is recorded for that billing month.`, recommendation: "Review the subscription and generate its due invoice if appropriate.", status: "Open" });
    }
  });
  data.invoices.forEach((invoice) => {
    const sub = data.subscriptions.find((s) => s.id === invoice.subscriptionId);
    if (sub && ["Closed", "Expired"].includes(sub.status) && invoice.issueDate > (sub.endDate || today)) {
      alerts.push({ id: `RL-AFTER-${invoice.id}`, type: "Invoice after closure", severity: "High", amount: invoice.total, entity: invoice.id, evidence: `Invoice date ${invoice.issueDate} is after subscription end date ${sub.endDate}.`, recommendation: "Verify the invoice and cancel it if it is not valid.", status: "Open" });
    }
  });
  return alerts;
}