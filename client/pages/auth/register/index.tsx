import React, { ReactElement, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { NextPageWithLayout } from '../../_app';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { BASE_URL } from '@/lib/globals';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { CustomPayload } from '@/lib/types';
import { usePreferencesStore } from '@/lib/preferencesStore';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Registration: NextPageWithLayout = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const {setAccessToken} = useAuthStore(state => state);
  const {setStoredUsername} = usePreferencesStore();
  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const isUsernameValid = USER_REGEX.test(user);
    const isPwdValid = PWD_REGEX.test(pwd);
    if (!isUsernameValid || !isPwdValid) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
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
        } else if (res.status === 409) {
          setErrMsg('Username Taken');
        } else if (res.status === 500) {
          setErrMsg('Internal Server Error');
        } else {
          setErrMsg('Registration Failed');
        }
        return;
      }

      const data = await res.json();
      const accessToken = data.accessToken;
      if (!accessToken) {
        setErrMsg('Invalid credentials');
        return;
      }

      setAccessToken(accessToken);
      const decoded = jwtDecode<CustomPayload>(accessToken);
      setStoredUsername(decoded.UserInfo.username);
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
    const isNameValid = USER_REGEX.test(user);
    setValidName(isNameValid);
    const isPwdValid = PWD_REGEX.test(pwd);
    setValidPwd(isPwdValid);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [user, pwd, matchPwd]);

  return (
    <>
      <Head>
        <title>Registration</title>
      </Head>
      <section className="w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <p
          className="text-red-400 text-center"
          ref={errRef}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form
          className="flex flex-col gap-8" 
          onSubmit={handleSubmit}
        >
          <h1 className='text-2xl mobile:text-3xl md:text-4xl text-center font-semibold dark:text-customText-dark mb-2'>Create an account</h1>
          <label htmlFor="username">
            <p>Username:</p>
            <input
              className={`${validName ? 'border-white' : 'border-red-500'} border text-lg leading-9 px-2 rounded w-full sm:w-2/3 lg:w-1/2`}
              ref={userRef}
              type="text"
              id="username"
              required
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
          </label>

          <label htmlFor="password">
            <p>Password:</p>
            <input
              className={`${validPwd ? 'border-white' : 'border-red-500'} border text-lg leading-9 px-2 rounded w-full sm:w-2/3 lg:w-1/2`}
              type="password"
              id="password"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
          </label>

          <label htmlFor="confirm-password">
            <p>Confirm Password:</p>
            <input
              className={`${validMatch ? 'border-white' : 'border-red-500'} border text-lg leading-9 px-2 rounded w-full sm:w-2/3 lg:w-1/2`}
              type="password"
              id="confirm-password"
              required
              value={matchPwd}
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
          </label>
          <button 
            className="rounded-full bg-white mobile:bg-btnBg mobile:hover:bg-hoverBtnBg mobile:focus:bg-hoverBtnBg mobile:text-white cursor-pointer text-lg mobile:px-3 mobile:py-2 mobile:rounded disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </button>
        </form>
        <p className="dark:text-customText-dark mt-2">
          Already have an account?<br />
          <span>
            <Link className="underline" href="/auth/login">Sign In</Link>
          </span>
        </p>
      </section>
      <Footer />
    </>
  )
}

Registration.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Registration;
