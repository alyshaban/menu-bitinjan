import HeroSection from "@/components/HeroSection";
import MenuCard from "@/components/MenuCard";
import OffersSlider from "@/components/OffersSlider";
import { getMenuData, getOffers, getSettings } from "@/lib/api";
import styles from "./page.module.css";
import Addres from "@/components/Addres";
import ContactForm from "@/components/ContactForm";

export default async function Home() {
  const [menuData, offersData, settings] = await Promise.all([
    getMenuData(),
    getOffers(),
    getSettings()
  ]);

  return (
    <main className={styles.main}>
      <HeroSection tagline={settings.hero_tagline} />
      {offersData.length > 0 && <OffersSlider offers={offersData} />}

      <div className="container">
        <div className={styles.menuContainer}>
          {menuData.map((category) => (
            <section key={category.id} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category.title}</h2>
              <div className={styles.itemsGrid}>
                {category.items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <Addres />
        <ContactForm />
      </div>

      <footer className={styles.footer}>
        <p>© 2026 بتنجان وبس. جميع الحقوق محفوظة.</p>
        <p className={styles.credits}>
          تم التطوير بواسطة <a href="https://shabanaly.netlify.app/" target="_blank" rel="noopener noreferrer">shaban aly</a>
        </p>
      </footer>

      <a
        href={`https://wa.me/${settings.whatsapp_number || "+201094921931"}?text=${encodeURIComponent(settings.whatsapp_message || "أهلاً بتنجان وبس، عايز أطلب من المنيو...")}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
      >
        <div className={styles.whatsappIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.9-30-28.8-64.8-28.8-101.2 0-103.5 84.3-187.8 187.9-187.8 50.1 0 97.3 19.5 132.8 55.1 35.5 35.5 55 82.6 55 132.8-.1 103.5-84.4 187.3-187.8 187.3zm102.8-140.2c-5.6-2.8-33.4-16.5-38.6-18.4-5.2-1.9-9-.2-12.7 5.2-3.8 5.6-14.7 18.4-18 22.2-3.3 3.8-6.6 4.2-12.2 1.4-5.6-2.8-23.8-8.8-45.3-28-16.7-14.9-28-33.4-31.3-39-3.3-5.6-.4-8.7 2.4-11.5 2.5-2.5 5.6-6.6 8.5-9.9 2.8-3.3 3.8-5.6 5.6-9.4 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.7-30.7-17.4-42-4.6-11-9.3-9.5-12.7-9.7-3.3-.2-7.1-.2-10.8-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.6-20.2 19.8-20.2 48.2 0 28.4 20.7 55.8 23.6 59.6 2.8 3.8 40.7 62.1 98.6 87.2 13.8 6 24.6 9.6 33 12.3 13.9 4.4 26.5 3.8 36.5 2.3 11.2-1.7 33.4-13.6 38.1-26.8 4.7-13.2 4.7-24.6 3.3-26.8-1.4-2.2-5.2-3.6-10.8-6.4z" />
          </svg>
        </div>
        <span>اطلب دلوقتي من بتنجان</span>
      </a>
    </main>
  );
}
