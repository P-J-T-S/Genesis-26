// Custom hooks for BMC Waste Management System
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setWards,
  setPriorities,
  setRecommendations,
  setAlerts,
  setStats,
  setLoading,
  refreshData,
  selectCurrentMode,
  selectWards,
  selectPriorities,
  selectRecommendations,
  selectActiveAlerts,
  selectStats,
  selectIsLoading,
  selectLastUpdated,
} from '../store/slices/wasteSlice';
import demoAPI from '../data/demoData';

/**
 * Hook to fetch and manage ward data
 */
export const useWards = () => {
  const dispatch = useDispatch();
  const wards = useSelector(selectWards);
  const isLoading = useSelector(selectIsLoading);
  const currentMode = useSelector(selectCurrentMode);
  
  const fetchWards = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await demoAPI.getWards(currentMode);
      if (response.success) {
        dispatch(setWards(response.data));
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, currentMode]);
  
  useEffect(() => {
    fetchWards();
  }, [fetchWards]);
  
  return { wards, isLoading, refetch: fetchWards };
};

/**
 * Hook to fetch and manage priority data
 */
export const usePriorities = () => {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);
  const isLoading = useSelector(selectIsLoading);
  
  const fetchPriorities = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await demoAPI.getPriorities();
      if (response.success) {
        dispatch(setPriorities(response.data));
      }
    } catch (error) {
      console.error('Error fetching priorities:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchPriorities();
  }, [fetchPriorities]);
  
  return { priorities, isLoading, refetch: fetchPriorities };
};

/**
 * Hook to fetch and manage recommendations
 */
export const useRecommendations = () => {
  const dispatch = useDispatch();
  const recommendations = useSelector(selectRecommendations);
  const isLoading = useSelector(selectIsLoading);
  const currentMode = useSelector(selectCurrentMode);
  
  const fetchRecommendations = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await demoAPI.getRecommendations(currentMode);
      if (response.success) {
        dispatch(setRecommendations(response.data));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, currentMode]);
  
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);
  
  return { recommendations, isLoading, refetch: fetchRecommendations };
};

/**
 * Hook to fetch and manage alerts
 */
export const useAlerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(selectActiveAlerts);
  const isLoading = useSelector(selectIsLoading);
  
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await demoAPI.getAlerts();
      if (response.success) {
        dispatch(setAlerts(response.data));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  
  return { alerts, isLoading, refetch: fetchAlerts };
};

/**
 * Hook to fetch and manage statistics
 */
export const useStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const isLoading = useSelector(selectIsLoading);
  
  const fetchStats = useCallback(async () => {
    try {
      const response = await demoAPI.getStats();
      if (response.success) {
        dispatch(setStats(response.data));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  return { stats, isLoading, refetch: fetchStats };
};

/**
 * Hook to refresh all data at once
 */
export const useRefreshAll = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectCurrentMode);
  const lastUpdated = useSelector(selectLastUpdated);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    dispatch(setLoading(true));
    try {
      const response = await demoAPI.refreshAll(currentMode);
      if (response.success) {
        dispatch(refreshData(response.data));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, currentMode]);
  
  return { refresh, isRefreshing, lastUpdated };
};

/**
 * Hook for auto-refresh functionality
 */
export const useAutoRefresh = (interval = 60000) => { // default 60 seconds
  const { refresh } = useRefreshAll();
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const intervalId = setInterval(() => {
      refresh();
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [isEnabled, interval, refresh]);
  
  const enable = useCallback(() => setIsEnabled(true), []);
  const disable = useCallback(() => setIsEnabled(false), []);
  const toggle = useCallback(() => setIsEnabled(prev => !prev), []);
  
  return { isEnabled, enable, disable, toggle };
};

/**
 * Hook for managing filters
 */
export const useWardFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.waste.filters);
  const wards = useSelector(selectWards);
  
  const [filteredWards, setFilteredWards] = useState([]);
  
  useEffect(() => {
    let result = [...wards];
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(ward => 
        ward.name.toLowerCase().includes(query) ||
        ward.id.toLowerCase().includes(query) ||
        ward.zone.toLowerCase().includes(query)
      );
    }
    
    // Apply pressure level filter
    if (filters.pressureLevel !== 'all') {
      result = result.filter(ward => ward.pressureLevel === filters.pressureLevel);
    }
    
    // Apply zone filter
    if (filters.zone !== 'all') {
      result = result.filter(ward => ward.zone === filters.zone);
    }
    
    setFilteredWards(result);
  }, [wards, filters]);
  
  return filteredWards;
};

/**
 * Hook for debounced search
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * Hook for window dimensions (responsive design)
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

/**
 * Hook for local storage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
};

export default {
  useWards,
  usePriorities,
  useRecommendations,
  useAlerts,
  useStats,
  useRefreshAll,
  useAutoRefresh,
  useWardFilters,
  useDebounce,
  useWindowSize,
  useLocalStorage,
};
