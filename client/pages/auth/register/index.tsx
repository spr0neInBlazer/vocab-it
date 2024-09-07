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
      <section>
        <p
          ref={errRef}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          <h1>Registration form</h1>
          <label htmlFor="username">Username:</label>
          <input
            className={`${validName ? 'border-white' : 'border-red-500'} border`}
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
            className={`${validPwd ? 'border-white' : 'border-red-500'} border`}
            type="password"
            id="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />

          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            className={`${validMatch ? 'border-white' : 'border-red-500'} border`}
            type="password"
            id="confirm-password"
            required
            value={matchPwd}
            onChange={(e) => setMatchPwd(e.target.value)}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <button 
            className="disabled:text-gray-400"
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?<br />
          <span>
            <Link href="/auth/login">Sign In</Link>
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
