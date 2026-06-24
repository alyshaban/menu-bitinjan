import { getMenuData } from "@/lib/api";
import MenuAdminClient from "./MenuAdminClient";

export const metadata = {
  title: "إدارة المنيو | لوحة تحكم بتنجان وبس",
};

export default async function MenuAdminPage() {
  const menuData = await getMenuData();

  return <MenuAdminClient initialData={menuData} />;
}
