import type { IconName } from "@/components/ui/Icon";

// Données réellement affichées (taxonomies statiques légitimes). Toute
// donnée d'activité fictive (produits, entreprises, avis, prix inventés)
// a été retirée — un visiteur ne doit jamais voir une fausse preuve
// sociale. Un état vide honnête ("Aucun ... pour l'instant") est utilisé
// à la place partout où la base n'a pas encore de données réelles.

export type HomeProduct = {
  id: string;
  name: string;
  category?: string | null;
  price: number | null;
  currency: string;
  href: string;
};

export type HomeCompany = {
  id: string;
  name: string;
  verified: boolean;
  sector?: string;
  country?: string | null;
  tags: string[];
  href: string;
  ago?: string;
};

export const CATEGORIES: { label: string; icon: IconName }[] = [
  { label: "Électronique", icon: "phone" },
  { label: "Mode & Beauté", icon: "bag" },
  { label: "Alimentation", icon: "cart" },
  { label: "Maison & Jardin", icon: "home" },
  { label: "Construction", icon: "hardhat" },
  { label: "Industrie", icon: "gear" },
  { label: "Véhicules", icon: "car" },
  { label: "Téléphones & Accessoires", icon: "phone" },
  { label: "Santé & Pharma", icon: "health" },
  { label: "Sports & Loisirs", icon: "ball" },
  { label: "Agriculture", icon: "leaf" },
];

// Catégories de services proposées par les freelances/prestataires —
// taxonomie de navigation, pas des tarifs (aucun prix inventé).
export const SERVICES: { title: string; desc: string; icon: IconName; q: string }[] = [
  { title: "Traduction linguistique", desc: "FR ↔ PT ↔ EN", icon: "translate", q: "traduction" },
  { title: "Développeur web & mobile", desc: "Applications, sites web", icon: "code", q: "développeur" },
  { title: "Design graphique", desc: "Logo, affiche, identité visuelle", icon: "palette", q: "design graphique" },
  { title: "Agent commercial", desc: "Représentation et vente", icon: "handshake", q: "agent commercial" },
  { title: "Marketing digital", desc: "Réseaux sociaux, SEO, Ads", icon: "megaphone", q: "marketing digital" },
  { title: "Assistance virtuelle", desc: "Gestion, administration", icon: "headset", q: "assistance virtuelle" },
];

export const LANGUAGES_FALLBACK = [
  { code: "fr", name_fr: "Français", name_native: "Français" },
  { code: "pt", name_fr: "Portugais", name_native: "Português" },
  { code: "en", name_fr: "Anglais", name_native: "English" },
  { code: "es", name_fr: "Espagnol", name_native: "Español" },
  { code: "ln", name_fr: "Lingala", name_native: "Lingála" },
  { code: "kg", name_fr: "Kikongo", name_native: "Kikongo" },
  { code: "sw", name_fr: "Swahili", name_native: "Swahili" },
];

export function formatPrice(price: number | null, currency: string) {
  if (price == null) return "";
  const cur = currency === "XAF" || currency === "XOF" ? "FCFA" : currency;
  return `${price.toLocaleString("fr-FR")} ${cur}`;
}
