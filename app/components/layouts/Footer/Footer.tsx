'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        <div className={styles.links}>
          <a href="https://x.com/koichi_2426" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://github.com/koichi2426" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
