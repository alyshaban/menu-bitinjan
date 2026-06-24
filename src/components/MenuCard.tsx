import { MenuItem } from "@/types";
import Image from "next/image";
import styles from "./MenuCard.module.css";

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className={`${styles.card} ${item.isSpecial ? styles.specialCard : ""}`}>
      {item.isSpecial && <div className={styles.badge}>{item.specialText}</div>}
      
      {item.imageUrl && (
        <div className={styles.imageContainer}>
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image} 
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.name}</h3>
        </div>
        
        {item.description && <p className={styles.description}>{item.description}</p>}
        
        <div className={styles.pricesContainer}>
          {item.prices.map((price, index) => (
            <div key={index} className={styles.priceRow}>
              <span className={styles.size}>{price.size}</span>
              <div className={styles.dots}></div>
              <span className={styles.price}>{price.price} جنيه</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
