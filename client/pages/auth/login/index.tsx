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
import { BASE_URL, PWD_MAX_LENGTH, PWD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '@/lib/globals';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: NextPageWithLayout = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);
  const [user, setUser] = useState<string>('');
  const [userFocus, setUserFocus] = useState<boolean>(false);
  const [pwd, setPwd] = useState<string>('');
  const [showPwd, setShowPwd] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const { setStoredUsername } = usePreferencesStore(state => state);
  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    try {
      const trimmedUsername = user.trim();
      const trimmedPwd = pwd.trim();
      const res = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: trimmedUsername, pwd: trimmedPwd }),
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
        return;
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
        <title>Log in | Vocab-It</title>
      </Head>
      <section className="w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          <h1 className='text-2xl mobile:text-3xl md:text-4xl text-center font-semibold dark:text-customText-dark mb-2'>Log in to your account</h1>
          <p
            className="text-red-400 text-center"
            ref={errRef}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <label htmlFor="username">
            <p>Username:</p>
            <input
              className="text-lg leading-9 px-2 border rounded w-full sm:w-2/3 lg:w-1/2"
              ref={userRef}
              type="text"
              id="username"
              name="username"
              placeholder="Enter username..."
              required
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              minLength={USERNAME_MIN_LENGTH}
              maxLength={USERNAME_MAX_LENGTH}
            />
          </label>

          <div>
            <label htmlFor="password">
              <p>Password:</p>
              <input
                className="text-lg leading-9 px-2 border rounded w-full sm:w-2/3 lg:w-1/2"
                type={showPwd ? "text" : "password"}
                id="password"
                placeholder="Enter password..."
                required
                value={pwd}
                minLength={PWD_MIN_LENGTH}
                maxLength={PWD_MAX_LENGTH}
                onChange={(e) => setPwd(e.target.value)}
              />
            </label>
            <button className="ml-4" type="button" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            className="rounded-full bg-white mobile:bg-btnBg mobile:hover:bg-hoverBtnBg mobile:focus:bg-hoverBtnBg mobile:text-white cursor-pointer text-lg mobile:px-3 mobile:py-2 mobile:rounded"
          >
            Log In
          </button>
        </form>
        <p className="dark:text-customText-dark mt-2">
          Don&#39;t have an account?<br />
          <span>
            <Link className="underline" href="/auth/register">Sign Up</Link>
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
