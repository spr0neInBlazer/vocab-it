import { useAuthStore } from '@/lib/authStore';
import { CustomPayload } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export default function RequireAuth({ allowedRoles, children }: { allowedRoles: number[], children: ReactNode}) {
  const {accessToken} = useAuthStore(state => state);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }
  
    const decoded = jwtDecode<CustomPayload>(accessToken);
    const roles = decoded?.UserInfo?.roles || [];
  
    if (!roles.find(role => allowedRoles?.includes(role))) {
      router.push('/auth/login');
    }
  }, [accessToken, allowedRoles, router]);

  return <>{children}</>;
}
