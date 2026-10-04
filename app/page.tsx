import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type UserRole } from "@/lib/types";
import { Header } from "@/components/home/Header";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { PopularProducts } from "@/components/home/PopularProducts";
import { RecommendedCompanies } from "@/components/home/RecommendedCompanies";
import { ServicesRow } from "@/components/home/ServicesRow";
import { RightColumn } from "@/components/home/RightColumn";
import { BottomNav } from "@/components/home/BottomNav";
import { LANGUAGES_FALLBACK, type HomeCompany, type HomeProduct } from "@/lib/homeSamples";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: languages }, { data: productsRaw }, { data: companiesRaw }] = await Promise.all([
    supabase.from("languages").select("code, name_fr, name_native").eq("is_active", true).limit(12),
    supabase.from("products").select("id, name, category, price, currency, company_id").limit(30),
    supabase.from("companies").select("id, name, country, verification_status, user_id").limit(50),
  ]);

  // Le rôle vit sur profiles, pas companies.
  const userIds = companiesRaw?.map((c) => c.user_id) ?? [];
  const { data: profilesRoles } = userIds.length
    ? await supabase.from("profiles").select("id, role").in("id", userIds)
    : { data: [] };
  const roleByUserId = new Map(profilesRoles?.map((p) => [p.id, p.role]));

  const companies: HomeCompany[] = (companiesRaw ?? []).map((c) => {
    const role = roleByUserId.get(c.user_id) as UserRole | undefined;
    return {
      id: c.id,
      name: c.name,
      verified: c.verification_status === "verified",
      country: c.country,
      tags: role && ROLE_LABELS[role] ? [ROLE_LABELS[role]] : [],
      href: `/entreprise/${c.id}`,
    };
  });

  const products: HomeProduct[] = (productsRaw ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    currency: p.currency ?? "XAF",
    href: `/entreprise/${p.company_id}`,
  }));

  // Entreprises vérifiées les plus récentes — réel, jamais de secours fictif.
  const verifiedCompanies = companies.filter((c) => c.verified);
  const latest = companies.slice(-4).reverse();
  const featured = verifiedCompanies[0] ?? null;
  const langs = languages && languages.length ? languages : LANGUAGES_FALLBACK;

  return (
    <div className="min-h-screen bg-night text-white pb-24">
      <Header languages={langs} />

      <div className="px-4 lg:px-6 py-4 flex gap-4 items-start">
        <HomeSidebar featured={featured} />

        <main className="flex-1 min-w-0 flex flex-col xl:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <Hero />
            <CategoryStrip />
            <PopularProducts products={products} />
            <RecommendedCompanies companies={companies.slice(0, 5)} />
            <ServicesRow />
          </div>
          <RightColumn latest={latest} />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
