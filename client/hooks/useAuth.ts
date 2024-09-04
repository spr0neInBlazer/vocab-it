import { useAuthStore } from "@/lib/authStore";
import useRefreshToken from "./useRefreshToken"

type FetchOptions = {
  headers?: Record<string, string>;
  [key: string]: any;
}

const useAuth = () => {
  const refresh = useRefreshToken();
  const {accessToken} = useAuthStore(state => state);
  
  async function fetchWithAuth(url: string, options: FetchOptions = {}) {
    console.log(`Access token within fetchWithAuth: ${accessToken}`);
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    let res = await fetch(url, config);
    // console.log(`Access token after refresh: ${accessToken}`);

    if (res.status === 403 || res.status === 401) {
      const newAccessToken = await refresh();
      config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      res = await fetch(url, config);
    }
    return res;
  }
  return fetchWithAuth
}

export default useAuth;
