import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // System mode
  currentMode: 'normal', // normal | event | emergency

  // Ward data
  wards: [],
  selectedWard: null,

  // Priority data
  priorities: [],

  // Recommendations
  recommendations: [],

  // Filters
  filters: {
    searchQuery: '',
    pressureLevel: 'all', // all | high | medium | low
    zone: 'all',
  },

  // UI state
  viewMode: 'map', // map | list
  isLoading: false,
  lastUpdated: null,

  // Alerts
  activeAlerts: [],

  // Statistics
  stats: {
    totalWards: 0,
    highPriorityWards: 0,
    activeEvents: 0,
    emergencyZones: 0,
  },
};

const wasteSlice = createSlice({
  name: 'waste',
  initialState,
  reducers: {
    // Mode management
    setMode: (state, action) => {
      state.currentMode = action.payload;
    },

    // Ward management
    setWards: (state, action) => {
      state.wards = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    selectWard: (state, action) => {
      state.selectedWard = action.payload;
    },

    clearSelectedWard: (state) => {
      state.selectedWard = null;
    },

    // Priority management
    setPriorities: (state, action) => {
      state.priorities = action.payload;
    },

    // Recommendations
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },

    // Filters
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Alerts
    setAlerts: (state, action) => {
      state.activeAlerts = action.payload;
    },

    addAlert: (state, action) => {
      state.activeAlerts.push(action.payload);
    },

    removeAlert: (state, action) => {
      state.activeAlerts = state.activeAlerts.filter(
        alert => alert.id !== action.payload
      );
    },

    // Statistics
    setStats: (state, action) => {
      state.stats = action.payload;
    },

    // Refresh all data
    refreshData: (state, action) => {
      state.wards = action.payload.wards || state.wards;
      state.priorities = action.payload.priorities || state.priorities;
      state.recommendations =
        action.payload.recommendations || state.recommendations;
      state.stats = action.payload.stats || state.stats;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

// Actions
export const {
  setMode,
  setWards,
  selectWard,
  clearSelectedWard,
  setPriorities,
  setRecommendations,
  setFilter,
  resetFilters,
  setViewMode,
  setLoading,
  setAlerts,
  addAlert,
  removeAlert,
  setStats,
  refreshData,
} = wasteSlice.actions;

// Selectors
export const selectCurrentMode = (state) => state.waste.currentMode;
export const selectWards = (state) => state.waste.wards;
export const selectSelectedWard = (state) => state.waste.selectedWard;
export const selectPriorities = (state) => state.waste.priorities;
export const selectRecommendations = (state) => state.waste.recommendations;
export const selectFilters = (state) => state.waste.filters;
export const selectViewMode = (state) => state.waste.viewMode;
export const selectIsLoading = (state) => state.waste.isLoading;
export const selectActiveAlerts = (state) => state.waste.activeAlerts;
export const selectStats = (state) => state.waste.stats;
export const selectLastUpdated = (state) => state.waste.lastUpdated;

// Filtered selectors
export const selectFilteredWards = (state) => {
  const { wards, filters } = state.waste;

  return wards.filter((ward) => {
    const matchesSearch =
      !filters.searchQuery ||
      ward.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ward.id.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesPressure =
      filters.pressureLevel === 'all' ||
      ward.pressureLevel === filters.pressureLevel;

    const matchesZone =
      filters.zone === 'all' || ward.zone === filters.zone;

    return matchesSearch && matchesPressure && matchesZone;
  });
};

export default wasteSlice.reducer;
