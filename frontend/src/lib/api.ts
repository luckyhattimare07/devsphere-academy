import axios from 'axios';

export const api = axios.create({
   baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('devsphere-auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.accessToken) config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch {}
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
          .then((token) => { orig.headers.Authorization = `Bearer ${token}`; return api(orig); });
      }
      orig._retry = true;
      isRefreshing = true;
      try {
        const raw = localStorage.getItem('devsphere-auth');
        if (raw) {
          const { state } = JSON.parse(raw);
          if (state?.refreshToken) {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, { refreshToken: state.refreshToken });
            const { accessToken, refreshToken } = res.data.data;
            const stored = JSON.parse(raw);
            stored.state.accessToken = accessToken;
            stored.state.refreshToken = refreshToken;
            localStorage.setItem('devsphere-auth', JSON.stringify(stored));
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            orig.headers.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
            return api(orig);
          }
        }
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem('devsphere-auth');
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const apiGet  = <T>(url: string, params?: any) => api.get<{success:boolean;data:T}>(url,{params}).then(r=>r.data.data);
export const apiPost = <T>(url: string, data?: any)  => api.post<{success:boolean;data:T}>(url,data).then(r=>r.data.data);
export const apiPut  = <T>(url: string, data?: any)  => api.put<{success:boolean;data:T}>(url,data).then(r=>r.data.data);
export const apiPatch= <T>(url: string, data?: any)  => api.patch<{success:boolean;data:T}>(url,data).then(r=>r.data.data);
export const apiDel  = <T>(url: string)              => api.delete<{success:boolean;data:T}>(url).then(r=>r.data.data);
