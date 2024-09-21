import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Login.module.css';
import { setCookie } from 'nookies';

export default function LoginPage() {
  const API_URL = process.env.API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();

      setCookie(null, 'accessToken', data.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Your Catalog Config</title>
        <meta name='description' content='Login to catalog' />
        <link
          rel='icon'
          href='https://bsscommerce.com/media/favicon/stores/1/icon-bss.png'
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Please log in to your account</p>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.inputGroup}>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter your email'
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Enter your password'
              />
            </div>
            <button type='submit' className={styles.button}>
              Log In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
