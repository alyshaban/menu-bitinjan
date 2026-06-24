import { createClient } from "@/lib/supabase/server";
import SettingsAdminClient from "./SettingsAdminClient";

export const metadata = {
  title: "الإعدادات | بتنجان وبس",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("settings").select("*");
  const initialSettings = data?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || {};

  return <SettingsAdminClient initialSettings={initialSettings} />;
}
