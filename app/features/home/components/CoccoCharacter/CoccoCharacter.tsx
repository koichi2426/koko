'use client';
import Image from 'next/image';
import styles from './CoccoCharacter.module.css';

interface CoccoCharacterProps {
  isLoading: boolean;
}

export default function CoccoCharacter({ isLoading }: CoccoCharacterProps) {
  return (
    <div className={styles.character}>
      <Image
        src={isLoading ? "/images/cocco1.png" : "/images/cocco.png"}
        alt="こっこちゃん"
        width={300}
        height={300}
      />
    </div>
  );
}
