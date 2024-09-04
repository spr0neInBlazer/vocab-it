import { useAuthStore } from "@/lib/authStore"
import { BASE_URL } from "@/lib/globals";
import useVocabStore from "@/lib/store";

const useLogout = () => {
  const {setAccessToken, setIsTokenChecked} = useAuthStore(state => state);
  const {setCurrVocab} = useVocabStore(state => state);

  async function logout() {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        credentials: 'include'
      });
      setAccessToken('');
      setCurrVocab(null);
      setIsTokenChecked(false);
      console.log('signed out');
    } catch (error) {
      console.error(error);
    }
  }
  return logout;
}

export default useLogout;
