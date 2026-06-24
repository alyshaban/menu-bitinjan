import { ArrowLeft, Clock, Locate, Phone } from "lucide-react";
import styles from "./Addres.module.css";

export default function Addres() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.divider}></div>
                <h3 className={styles.heading}>تعرف علينا</h3>
                <div className={styles.divider}></div>
            </div>

            <div className={styles.grid}>

                <a
                    href="https://maps.google.com/?q=السويس+الاربعين+شارع+سيد+الجحش"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                >
                    <div className={styles.iconWrap}><Locate /></div>
                    <div className={styles.cardBody}>
                        <strong className={styles.label}>العنوان</strong>
                        <p className={styles.value}>السويس، الأربعين<br />شارع سيد الجحش — <b>بتنجان وبس</b></p>
                    </div>
                    <span className={styles.arrow}><ArrowLeft size={20} /></span>
                </a>

                <div className={styles.card}>
                    <div className={styles.iconWrap}><Clock /></div>
                    <div className={styles.cardBody}>
                        <strong className={styles.label}>مواعيد العمل</strong>
                        <p className={styles.value}>كل يوم<br />٧ص – ٢ص</p>
                    </div>
                </div>

                <a
                    href="tel:01094921931"
                    className={styles.card}
                >
                    <div className={styles.iconWrap}><Phone /></div>
                    <div className={styles.cardBody}>
                        <strong className={styles.label}>اتصل أو اطلب</strong>
                        <p className={`${styles.value} ${styles.phone}`} dir="ltr">010 9492 1931</p>
                    </div>
                    <span className={styles.arrow}><ArrowLeft size={20} /></span>
                </a>

            </div>
        </section>
    );
}