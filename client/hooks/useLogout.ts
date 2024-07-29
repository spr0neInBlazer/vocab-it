import { useAuthStore } from "@/lib/authStore"
import { BASE_URL } from "@/lib/globals";

const useLogout = () => {
  const {setAccessToken, setStoredUsername} = useAuthStore(state => state);

  async function logout() {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        credentials: 'include'
      });
      setAccessToken('');
      setStoredUsername('');
      console.log('singed out');
    } catch (error) {
      console.error(error);
    }
  }
  return logout;
}

export default useLogout;
