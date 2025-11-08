"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./signup.module.css"; // CSS module import

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log({ fullName, email, password });
  };

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
        <h2 className={styles.title}>Join the Dory Family!</h2>
        <p className={styles.subtitle}>
          Create your account to access your personalized learning experience
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>

        <p className={styles.signupText}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.signupLink}>
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
}
