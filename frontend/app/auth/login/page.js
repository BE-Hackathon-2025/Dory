"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  const handleSignUp = () => router.push("/auth/signup");

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.headerBar}>
        <div className={styles.headerContent}>
          <Image src="/dory.png" alt="Dory logo" width={100} height={100} />
          <h1 className={styles.headerTitle}>Dory</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <Image
          src="/dory.png"
          alt="Dory icon"
          width={150}
          height={150}
          className={styles.logo}
        />
        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.subtitle}>
          Log in to access your personalized learning dashboard
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          <div className={styles.forgotContainer}>
            <a href="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className={styles.button}>
            Log In
          </button>
        </form>

        <p className={styles.signupText}>
          Don’t have an account?{" "}
          <span
            onClick={handleSignUp}
            className={styles.signupLink}
          >
            Sign Up
          </span>
        </p>
      </main>
    </div>
  );
}

