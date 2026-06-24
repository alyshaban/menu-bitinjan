export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  prices: {
    size: string;
    price: number;
  }[];
  imageUrl?: string;
  isSpecial?: boolean;
  specialText?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}
