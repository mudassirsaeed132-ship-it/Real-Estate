import { useSyncExternalStore } from "react";

let state = {
  step: 1, // 1..3
  tab: "recent", // recent | search

  recentItems: [],
  searchItems: [],
  searchQuery: "",

  selected: null, // selected property object
  propertyPrice: "",

  form: {
    income: "5645",
    equity: "565",
    includePension: true,
    monthlyExpenses: "4644",
    employment: "employed", // employed | self
  },

  uploads: [],
  result: null,

  shareConsent: false,

  loading: {
    recent: false,
    search: false,
    calc: false,
    share: false,
  },

  error: "",
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

const setState = (patch) => {
  state = { ...state, ...patch };
  emit();
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export function usePrecheckStore(selector = (s) => s) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return typeof selector === "function" ? selector(snap) : snap;
}

export const precheckActions = {
  resetAll() {
    setState({
      step: 1,
      tab: "recent",
      selected: null,
      propertyPrice: "",
      result: null,
      shareConsent: false,
      error: "",
      uploads: [],
    });
  },

  setStep(step) {
    setState({ step });
  },

  setTab(tab) {
    setState({ tab });
  },

  setRecentItems(items) {
    setState({ recentItems: items || [] });
  },

  setSearchItems(items) {
    setState({ searchItems: items || [] });
  },

  setSearchQuery(v) {
    setState({ searchQuery: v ?? "" });
  },

  selectProperty(item) {
    setState({
      selected: item || null,
      propertyPrice: item?.price?.replace(/[^0-9.]/g, "") || "45000",
    });
  },

  clearSelected() {
    setState({ selected: null, propertyPrice: "" });
  },

  setPropertyPrice(v) {
    setState({ propertyPrice: v });
  },

  setForm(patch) {
    setState({ form: { ...state.form, ...(patch || {}) } });
  },

  setUploads(files) {
    setState({ uploads: Array.isArray(files) ? files : [] });
  },

  setResult(result) {
    setState({ result });
  },

  setShareConsent(v) {
    setState({ shareConsent: !!v });
  },

  setLoading(key, value) {
    setState({ loading: { ...state.loading, [key]: !!value } });
  },

  setError(msg) {
    setState({ error: msg || "" });
  },
};
