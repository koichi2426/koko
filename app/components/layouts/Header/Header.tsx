'use client';

import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>こっこうた</h1>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </header>
  );
}
