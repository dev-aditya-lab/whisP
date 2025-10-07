

import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { getAuthToken } from './AuthToken';
import { getUserId } from './saveUserID';

// Create instance
export const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});

// Simple request interceptor (kept minimal)
api.interceptors.request.use(async (config) => {
    // Only add headers if not explicitly disabled
    if (!config.headers) config.headers = {};

    // If caller set config._authRequired = true add token + user id
    if (config._authRequired) {
        const [token] = await Promise.all([getAuthToken()]);
        if (token) config.headers.Authorization = `Bearer ${token}`;

    }

    // Default content type for JSON requests
    if (!config.headers['Content-Type'] && config.method !== 'get') {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

// Basic error normalization (optional)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        const message = err?.response?.data?.message || err.message || 'Request failed';
        return Promise.reject({ status, message, raw: err });
    }
);

/**
 * Helper wrappers
 * path: string (e.g. `/users/123`)
 * auth: boolean (true = add token + user id)
 * params/body as needed
 */
/**
 * Generic GET helper.
 * @param {string} path - Relative API path starting with '/'
 * @param {boolean} auth - Whether to attach Authorization header
 * @param {object} [params] - Query params
 */
export async function apiGet(path, auth = false, params) {
    const res = await api.get(path, { params, _authRequired: auth });
    return res.data;
}

/**
 * Generic POST helper.
 */
export async function apiPost(path, body, auth = false) {
    const res = await api.post(path, body, { _authRequired: auth });
    return res.data;
}

/**
 * Generic PATCH helper.
 */
export async function apiPatch(path, body, auth = false) {
    const res = await api.patch(path, body, { _authRequired: auth });
    return res.data;
}

/**
 * Generic DELETE helper.
 */
export async function apiDelete(path, auth = false) {
    const res = await api.delete(path, { _authRequired: auth });
    return res.data;
}

// Example specific calls (add more if you like)
/**
 * POST /auth/send-otp
 * Body: { phone: string } (or other identifier)
 * Public (no auth)
 */
export function sendOtp(payload) {
    return apiPost(API_CONFIG.ENDPOINTS.SEND_OTP, payload, false);
}

/**
 * POST /auth/authintication
 * Body: { phone, otp }
 * Returns accessToken + user object (expected)
 * Public (no auth at call time)
 */
export function authenticate(payload) {
    return apiPost(API_CONFIG.ENDPOINTS.AUTHENTICATE, payload, false);
}



/**
 * GET /users/{userId}
 * Auth required.
 */
export async function getMyProfile() {
    const uid = await getUserId();
    if (!uid) throw new Error('No stored user id');
    return apiGet(`${API_CONFIG.ENDPOINTS.USER_PROFILE}/${uid}`, true);
}

/**
 * PATCH /users/{userId}
 * Auth required.
 */
export async function updateMyProfile(data) {
    const uid = await getUserId();
    if (!uid) throw new Error('No stored user id');
    return apiPatch(`${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}/${uid}`, data, true);
}


export default {
    api,
    apiGet,
    apiPost,
    apiPatch,
    apiDelete,
    sendOtp,
    authenticate,
    getMyProfile,
    updateMyProfile,
};