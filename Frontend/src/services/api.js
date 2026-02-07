// Recommendations API
export const recommendationsAPI = {
    getRecommendations: (zoneId, limit = 5) => api.get(`/api/v1/recommendations/${zoneId}`, { params: { limit } }),
    runRecommendations: (mode = 'normal') => api.post('/api/v1/recommendations/run', { mode }),
};

// Feed API
export const feedAPI = {
    getFeed: (mode) => api.get('/api/v1/feed', { params: { mode } }),
};

// Signal API
export const signalAPI = {
    getSignals: (mode) => api.get('/api/v1/signals/zones', { params: { mode } }),
};

// Intelligence API (ML Hotspot/Spike Detection)
export const intelligenceAPI = {
    runHotspotDetection: () => api.post('/api/v1/intelligence/hotspots'),
    runSpikeDetection: () => api.post('/api/v1/intelligence/spikes'),
    runAll: () => api.post('/api/v1/intelligence/run'),
};
// Priority API
export const priorityAPI = {
    getPriorities: (mode) => api.get('/api/v1/priority', { params: { mode } }),
};

// Zones API
export const zonesAPI = {
    getWards: async (mode) => {
        // Use /status endpoint for live data
        const res = await api.get('/api/v1/zones/status', { params: { mode } });
        // Return the zones array in the same shape as before
        return {
            ...res,
            data: {
                ...res.data,
                data: Array.isArray(res.data?.data?.zones) ? res.data.data.zones : [],
            },
        };
    },
    setMode: (mode) => api.post('/api/v1/zones/mode', { mode }),
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true,
                });

                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token failed, clear auth and redirect
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (login_id, password) => api.post('/api/v1/auth/login', { login_id, password }),
    signup: (data) => api.post('/api/v1/auth/signup', data),
    logout: () => api.post('/api/v1/auth/logout'),
    refreshToken: () => api.post('/api/v1/auth/refresh-token'),
};

// User API
export const userAPI = {
    getCurrentUser: () => api.get('/api/v1/users/me'),
    updateProfile: (data) => api.patch('/api/v1/users/update', data),
    changePassword: (data) => api.post('/api/v1/users/change-password', data),
    getAllTechnicians: () => api.get('/api/v1/users/technicians'),
    getAll: (params) => api.get('/api/v1/users', { params }),
};

// Equipment API
export const equipmentAPI = {
    getAll: (params) => api.get('/api/v1/equipment', { params }),
    getById: (id) => api.get(`/api/v1/equipment/${id}`),
    create: (data) => api.post('/api/v1/equipment', data),
    update: (id, data) => api.put(`/api/v1/equipment/${id}`, data),
    delete: (id) => api.delete(`/api/v1/equipment/${id}`),
    scrap: (id) => api.patch(`/api/v1/equipment/${id}/scrap`),
    getRequests: (id) => api.get(`/api/v1/equipment/${id}/requests`),
};

// Team API
export const teamAPI = {
    getAll: () => api.get('/api/v1/teams'),
    getById: (id) => api.get(`/api/v1/teams/${id}`),
    create: (data) => api.post('/api/v1/teams', data),
    update: (id, data) => api.put(`/api/v1/teams/${id}`, data),
    delete: (id) => api.delete(`/api/v1/teams/${id}`),
    addTechnician: (teamId, technicianId) =>
        api.post(`/api/v1/teams/${teamId}/technicians`, { technicianId }),
    removeTechnician: (teamId, technicianId) =>
        api.delete(`/api/v1/teams/${teamId}/technicians`, { data: { technicianId } }),
};

// Request API
export const requestAPI = {
    getAll: (params) => api.get('/api/v1/requests', { params }),
    getById: (id) => api.get(`/api/v1/requests/${id}`),
    create: (data) => api.post('/api/v1/requests', data),
    update: (id, data) => api.put(`/api/v1/requests/${id}`, data),
    delete: (id) => api.delete(`/api/v1/requests/${id}`),
    updateStatus: (id, status, duration) =>
        api.patch(`/api/v1/requests/${id}/status`, { status, duration }),
    getKanban: () => api.get('/api/v1/requests/kanban'),
    getPreventive: (params) => api.get('/api/v1/requests/preventive', { params }),
};

// Waste API (Backend integration)
export const fetchZonesStatus = async (mode = 'normal') => {
    const res = await api.get(`/api/v1/zones/status?mode=${mode}`);
    return res.data;
};

export default api;