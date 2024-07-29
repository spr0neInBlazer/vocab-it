import { useAuthStore } from "@/lib/authStore";
import { BASE_URL } from "@/lib/globals";
import { CustomPayload } from "@/lib/types";
import { jwtDecode } from 'jwt-decode';

const useRefreshToken = () => {
  const {setAccessToken, setStoredUsername} = useAuthStore(state => state);

  async function refresh() {
    try {
      const res = await fetch(`${BASE_URL}/refresh`, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      const decoded = jwtDecode<CustomPayload>(data.accessToken);
      setStoredUsername(decoded.UserInfo.username);
      console.log({accessToken: data.accessToken});
      return data.accessToken;
    } catch (error) {
      console.error(error);
      
    }
  }
  return refresh;
}

export default useRefreshToken;
