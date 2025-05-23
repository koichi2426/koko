'use client';
import styles from './PoemBubble.module.css';

interface PoemBubbleProps {
  poem: string;
}

export default function PoemBubble({ poem }: PoemBubbleProps) {
  return <div className={styles.bubble}>{poem}</div>;
}
