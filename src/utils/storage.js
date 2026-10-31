import { createSeedData } from "../data/seed";

const STORAGE_KEY = "subscriptpro-ai-v1";

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed = JSON.parse(raw);
    const required = ["customers", "products", "plans", "subscriptions", "invoices", "payments", "alerts", "recoveryEvents", "quotations", "discounts"];
    if (!required.every((key) => Array.isArray(parsed[key]))) return createSeedData();
    return parsed;
  } catch {
    return createSeedData();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Unable to save app data:", error);
  }
}