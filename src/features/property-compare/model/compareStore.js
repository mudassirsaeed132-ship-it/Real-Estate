// PATH: src/features/property-compare/model/compareStore.js
import { useSyncExternalStore } from "react";

export const COMPARE_LIMIT = 3;
// Backwards-compat alias (older code used COMPARE_MAX)
export const COMPARE_MAX = COMPARE_LIMIT;

let state = derive({
  enabled: false,

  // ids only
  selectedIds: [],
  selectedItemsById: {},

  // UI modals
  startModalOpen: false,
  selectionModalOpen: false,
  maxSelectedModalOpen: false,

  // Backwards-compat fields
  selected: [],
  maxModalOpen: false,
});

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function derive(next) {
  const selectedIds = Array.isArray(next.selectedIds) ? next.selectedIds : [];
  const selectedItemsById =
    next.selectedItemsById && typeof next.selectedItemsById === "object"
      ? next.selectedItemsById
      : {};

  const maxSelectedModalOpen = !!(next.maxSelectedModalOpen ?? next.maxModalOpen);

  const selected = selectedIds.map((id) => {
    const key = String(id);
    return selectedItemsById[key] || { id };
  });

  return {
    ...next,
    selectedIds,
    selectedItemsById,
    selected,
    maxSelectedModalOpen,
    maxModalOpen: maxSelectedModalOpen,
  };
}

function setState(patch) {
  state = derive({ ...state, ...patch });
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useCompareStore(selector = (s) => s) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return typeof selector === "function" ? selector(snapshot) : snapshot;
}

function idKey(id) {
  return String(id);
}

function hasId(id) {
  const key = idKey(id);
  return state.selectedIds.some((x) => idKey(x) === key);
}

function removeId(id) {
  const key = idKey(id);
  if (!hasId(key)) return;

  const nextIds = state.selectedIds.filter((x) => idKey(x) !== key);
  const nextItemsById = { ...state.selectedItemsById };
  delete nextItemsById[key];

  if (nextIds.length === 0) {
    setState({
      enabled: false,
      selectedIds: [],
      selectedItemsById: {},
      startModalOpen: false,
      selectionModalOpen: false,
      maxSelectedModalOpen: false,
    });
    return;
  }

  setState({ selectedIds: nextIds, selectedItemsById: nextItemsById });
}

function addId(id, item) {
  const key = idKey(id);
  if (hasId(key)) return;

  if (state.selectedIds.length >= COMPARE_LIMIT) {
    if (!state.maxSelectedModalOpen) setState({ maxSelectedModalOpen: true });
    return;
  }

  const nextIds = [...state.selectedIds, key];
  const nextItemsById = item
    ? { ...state.selectedItemsById, [key]: { ...item, id: item?.id ?? id } }
    : state.selectedItemsById;

  setState({ selectedIds: nextIds, selectedItemsById: nextItemsById });
}

export const compareActions = {
  openStartModal() {
    if (state.startModalOpen) return;
    setState({ startModalOpen: true });
  },

  closeStartModal() {
    if (!state.startModalOpen) return;
    setState({ startModalOpen: false });
  },

  enableCompare({ clear = true } = {}) {
    setState({
      enabled: true,
      startModalOpen: false,
      ...(clear ? { selectedIds: [], selectedItemsById: {} } : null),
    });
  },

  //  FIXED: if compare OFF but we already have selections -> open selection modal
  openSelectionModal() {
    if (!state.enabled && state.selectedIds.length === 0) {
      compareActions.openStartModal();
      return;
    }
    if (state.selectionModalOpen) return;
    setState({ selectionModalOpen: true });
  },

  closeSelectionModal() {
    if (!state.selectionModalOpen) return;
    setState({ selectionModalOpen: false });
  },

  closeMaxSelectedModal() {
    if (!state.maxSelectedModalOpen) return;
    setState({ maxSelectedModalOpen: false });
  },

  toggleSelect(id, item) {
    if (id == null && item?.id == null) return;
    const key = idKey(id ?? item.id);

    // remove always allowed
    if (hasId(key)) {
      removeId(key);
      return;
    }

    // only allow adding when compare mode is enabled
    if (!state.enabled) return;
    addId(key, item);
  },

  // Backwards-compat API
  start() {
    compareActions.enableCompare({ clear: true });
  },

  stop({ clear = true } = {}) {
    if (
      !state.enabled &&
      (!clear || state.selectedIds.length === 0) &&
      !state.startModalOpen &&
      !state.selectionModalOpen &&
      !state.maxSelectedModalOpen
    ) {
      return;
    }

    setState({
      enabled: false,
      startModalOpen: false,
      selectionModalOpen: false,
      maxSelectedModalOpen: false,
      ...(clear ? { selectedIds: [], selectedItemsById: {} } : null),
    });
  },

  dismissMax() {
    compareActions.closeMaxSelectedModal();
  },

  toggle(item) {
    if (!item?.id) return;
    compareActions.toggleSelect(item.id, item);
  },

  remove(id) {
    if (id == null) return;
    removeId(id);
  },
};