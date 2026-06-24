import styles from "./HeroSection.module.css";

export default function HeroSection({ tagline }: { tagline?: string }) {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>بتنجان وبس</h1>
          <span className={styles.subtitle}>طعم زمان رجع من جديد</span>
        </div>
        <p className={styles.tagline}>{tagline || "طعم بيتي يرجعك لزمان 😍"}</p>
      </div>
    </div>
  );
}
