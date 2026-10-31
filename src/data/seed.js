const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const createSeedData = () => ({
  customers: [
    { id: "CUS-1001", name: "Aarav Technologies", email: "finance@aaravtech.in", phone: "+91 98765 43210", company: "Aarav Technologies", createdAt: daysFromNow(-120) },
    { id: "CUS-1002", name: "BluePeak Studios", email: "accounts@bluepeak.in", phone: "+91 98765 12345", company: "BluePeak Studios", createdAt: daysFromNow(-90) },
    { id: "CUS-1003", name: "Northstar Learning", email: "admin@northstar.edu", phone: "+91 91234 56780", company: "Northstar Learning", createdAt: daysFromNow(-60) },
    { id: "CUS-1004", name: "PixelCraft Labs", email: "billing@pixelcraft.io", phone: "+91 99887 66554", company: "PixelCraft Labs", createdAt: daysFromNow(-35) }
  ],
  products: [
    { id: "PRD-101", name: "Pro Workspace", type: "Software", price: 2499, cost: 700, notes: "Team collaboration suite", variants: [{ name: "Priority support", extra: 500 }] },
    { id: "PRD-102", name: "Analytics Suite", type: "Software", price: 3999, cost: 1200, notes: "Business analytics", variants: [{ name: "Advanced reports", extra: 800 }] },
    { id: "PRD-103", name: "Cloud Storage", type: "Service", price: 999, cost: 250, notes: "Secure cloud storage", variants: [] }
  ],
  plans: [
    { id: "PLN-101", name: "Monthly Pro", frequency: "monthly", price: 2499, minQty: 1, availableFrom: daysFromNow(-180), availableTo: "", allowPause: true, allowRenew: true, allowEarlyClose: true },
    { id: "PLN-102", name: "Annual Analytics", frequency: "yearly", price: 3999, minQty: 1, availableFrom: daysFromNow(-180), availableTo: "", allowPause: false, allowRenew: true, allowEarlyClose: true },
    { id: "PLN-103", name: "Weekly Storage", frequency: "weekly", price: 999, minQty: 1, availableFrom: daysFromNow(-90), availableTo: "", allowPause: true, allowRenew: true, allowEarlyClose: true }
  ],
  subscriptions: [
    { id: "SUB-1001", customerId: "CUS-1001", planId: "PLN-101", productId: "PRD-101", quantity: 2, price: 2499, frequency: "monthly", status: "Active", startDate: daysFromNow(-60), nextBillingDate: daysFromNow(5), endDate: daysFromNow(305), taxRate: 18, discount: 0, lastInvoiceDate: daysFromNow(-25) },
    { id: "SUB-1002", customerId: "CUS-1002", planId: "PLN-102", productId: "PRD-102", quantity: 1, price: 3999, frequency: "yearly", status: "Active", startDate: daysFromNow(-45), nextBillingDate: daysFromNow(15), endDate: daysFromNow(320), taxRate: 18, discount: 10, lastInvoiceDate: daysFromNow(-20) },
    { id: "SUB-1003", customerId: "CUS-1003", planId: "PLN-101", productId: "PRD-101", quantity: 1, price: 2499, frequency: "monthly", status: "Paused", startDate: daysFromNow(-30), nextBillingDate: daysFromNow(2), endDate: daysFromNow(335), taxRate: 18, discount: 0, lastInvoiceDate: daysFromNow(-35) },
    { id: "SUB-1004", customerId: "CUS-1004", planId: "PLN-103", productId: "PRD-103", quantity: 3, price: 999, frequency: "weekly", status: "Active", startDate: daysFromNow(-20), nextBillingDate: daysFromNow(-3), endDate: daysFromNow(70), taxRate: 18, discount: 0, lastInvoiceDate: daysFromNow(-35) }
  ],
  invoices: [
    { id: "INV-2001", subscriptionId: "SUB-1001", customerId: "CUS-1001", period: "seed-2026-10", issueDate: daysFromNow(-25), dueDate: daysFromNow(-10), subtotal: 4998, discount: 0, tax: 899.64, total: 5897.64, paid: 5897.64, status: "Paid" },
    { id: "INV-2002", subscriptionId: "SUB-1002", customerId: "CUS-1002", period: "seed-2026-10", issueDate: daysFromNow(-20), dueDate: daysFromNow(-5), subtotal: 3999, discount: 399.9, tax: 647.84, total: 4246.94, paid: 2000, status: "Partially Paid" },
    { id: "INV-2003", subscriptionId: "SUB-1004", customerId: "CUS-1004", period: "seed-2026-09", issueDate: daysFromNow(-15), dueDate: daysFromNow(-1), subtotal: 2997, discount: 0, tax: 539.46, total: 3536.46, paid: 0, status: "Overdue" }
  ],
  payments: [
    { id: "PAY-3001", invoiceId: "INV-2001", amount: 5897.64, method: "UPI", date: daysFromNow(-24), note: "Demo payment" },
    { id: "PAY-3002", invoiceId: "INV-2002", amount: 2000, method: "Bank Transfer", date: daysFromNow(-18), note: "Part payment" }
  ],
  alerts: [],
  recoveryEvents: [],
  quotations: [],
  discounts: []
});