import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/lib/authStore';
import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CustomPayload } from '@/lib/types';
import { BASE_URL } from '@/lib/globals';

const Login: NextPageWithLayout = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);
  const [user, setUser] = useState<string>('');
  const [userFocus, setUserFocus] = useState(false);
  const [pwd, setPwd] = useState<string>('');
  const [errMsg, setErrMsg] = useState('');
  const {setAccessToken, setStoredUsername} = useAuthStore(state => state);
  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, pwd }),
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 400) {
          setErrMsg('Missing Username or Password');
        } else if (res.status === 401) {
          setErrMsg('Incorrect username or password');
        } else if (res.status === 500) {
          setErrMsg('Internal Server Error');
        } else {
          setErrMsg('Login Failed');
        }
        return;
      }

      const data = await res.json();
      const accessToken = data.accessToken;
      if (!accessToken) {
        setErrMsg('Invalid credentials');
        return
      }

      const decoded = jwtDecode<CustomPayload>(accessToken);
      const roles: number[] = decoded?.UserInfo?.roles || [];
      if (roles.length === 0) {
        setErrMsg('No valid roles provided');
        return;
      }

      setAccessToken(accessToken);
      setStoredUsername(decoded.UserInfo.username);
      setUser('');
      setPwd('');
      router.push('/profile');
      console.log({ accessToken });
    } catch (error) {
      setErrMsg('No Server Response');
      errRef.current?.focus();
      console.error(error);
    }
  }

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <section>
        <p
          className="text-red-400"
          ref={errRef}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          <h1>Sign In Form</h1>
          <label htmlFor="username">Username:</label>
          <input
            ref={userRef}
            type="text"
            id="username"
            required
            onChange={(e) => setUser(e.target.value)}
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button>Sign In</button>
        </form>
        <p>
          Don&#39;t have an account?<br />
          <span>
            <Link href="auth/register">Sign Up</Link>
          </span>
        </p>
      </section>
      <Footer />
    </>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Login;
