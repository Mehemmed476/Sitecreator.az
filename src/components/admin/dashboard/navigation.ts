import {
  BookOpenText,
  BriefcaseBusiness,
  FolderKanban,
  Home,
  ImageIcon,
  LayoutDashboard,
  Layers3,
  Quote,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import type { AdminTab, AdminTabConfig } from "@/components/admin/dashboard/types";

interface AdminStat {
  label: string;
  value: string;
}

export interface AdminWorkspaceMeta {
  eyebrow: string;
  title: string;
  description: string;
  stats: AdminStat[];
}

export const defaultAdminTab: AdminTab = "dashboard";

export const adminTabs: AdminTabConfig[] = [
  {
    id: "dashboard",
    href: "/admin",
    group: "Panel",
    label: "Panel",
    description: "Ümumi görünüş, qısa statistika və sürətli keçidlər",
    icon: LayoutDashboard,
  },
  {
    id: "homepage",
    href: "/admin/homepage",
    group: "Məzmun",
    label: "Ana səhifə",
    description: "Hero, bloklar və ana səhifə məzmunu",
    icon: Home,
  },
  {
    id: "socialProof",
    href: "/admin/social-proof",
    group: "Məzmun",
    label: "Rəylər və FAQ",
    description: "Reusable testimonial və FAQ modulu",
    icon: Quote,
  },
  {
    id: "media",
    href: "/admin/media",
    group: "Məzmun",
    label: "Media library",
    description: "Şəkilləri yüklə, sil və bir yerdən idarə et",
    icon: ImageIcon,
  },
  {
    id: "services",
    href: "/admin/services",
    group: "Məzmun",
    label: "Xidmət səhifələri",
    description: "Slug, blok, FAQ və SEO hissələri",
    icon: Layers3,
  },
  {
    id: "portfolio",
    href: "/admin/portfolio",
    group: "Məzmun",
    label: "Portfolio",
    description: "Layihələr, şəkillər və seçilən işlər",
    icon: FolderKanban,
  },
  {
    id: "blog",
    href: "/admin/blog",
    group: "Böyümə",
    label: "Bloq və SEO",
    description: "Çoxdilli məqalələr, slug və cover idarəsi",
    icon: BookOpenText,
  },
  {
    id: "calculator",
    href: "/admin/calculator",
    group: "Böyümə",
    label: "Kalkulyator",
    description: "Qiymət məntiqi, seçimlər və CTA mətni",
    icon: Settings2,
  },
  {
    id: "sales",
    href: "/admin/sales",
    group: "Əməliyyatlar",
    label: "CRM və satış",
    description: "Lead-lər, layihələr, təkliflər və realtime chat",
    icon: BriefcaseBusiness,
  },
  {
    id: "settings",
    href: "/admin/settings",
    group: "Əməliyyatlar",
    label: "Əlaqə məlumatları",
    description: "Telefon, footer, iş saatları və sosial hesablar",
    icon: ShieldCheck,
  },
];

const workspaceMeta: Record<AdminTab, AdminWorkspaceMeta> = {
  dashboard: {
    eyebrow: "Ümumi baxış",
    title: "Saytı və admin axınını bir paneldən idarə et",
    description:
      "Nəyin diqqət tələb etdiyini tez gör və bir kliklə doğru modulda işləməyə başla.",
    stats: [
      { label: "Quruluş", value: "Route əsaslı admin" },
      { label: "Naviqasiya", value: "Sadə sidebar" },
    ],
  },
  homepage: {
    eyebrow: "Ana səhifə idarəsi",
    title: "İlk təəssüratı admin paneldən formalaşdır",
    description:
      "Hero, xidmət blokları, portal feature hissəsi və digər ana səhifə mətnlərini kod toxunmadan yenilə.",
    stats: [
      { label: "Fokus", value: "Hero və bloklar" },
      { label: "Dillər", value: "AZ / EN / RU" },
    ],
  },
  socialProof: {
    eyebrow: "Etibar modulu",
    title: "Rəyləri və FAQ hissələrini ayrıca idarə et",
    description:
      "Testimonials və tez-tez verilən suallar reusable modul kimi saxlanılır və fərqli səhifələrdə istifadə oluna bilər.",
    stats: [
      { label: "Fokus", value: "Testimonials + FAQ" },
      { label: "İstifadə", value: "Reusable content" },
    ],
  },
  media: {
    eyebrow: "Media kitabxanası",
    title: "Bütün vizualları vahid paneldən idarə et",
    description:
      "Cloudinary üzərində olan portfolio, blog və digər şəkilləri bir yerdən yüklə, kopyala və sil.",
    stats: [
      { label: "Fokus", value: "Cloudinary assets" },
      { label: "İstifadə", value: "Bütün modullar üçün" },
    ],
  },
  services: {
    eyebrow: "Xidmət səhifələri",
    title: "Hər xidmət üçün ayrıca SEO və satış səhifəsi qur",
    description:
      "Kart mətni, hero, nəticələr, FAQ, CTA və SEO hissələrini xidmət bazında idarə et.",
    stats: [
      { label: "Fokus", value: "Service detail pages" },
      { label: "Dillər", value: "AZ / EN / RU" },
    ],
  },
  portfolio: {
    eyebrow: "Portfolio kitabxanası",
    title: "Layihələri daha səliqəli və faydalı göstər",
    description:
      "Portfolio kartlarını, şəkilləri və ana səhifədə görünəcək seçilən işləri bir yerdən idarə et.",
    stats: [
      { label: "Fokus", value: "Layihələr və şəkillər" },
      { label: "Axın", value: "Dərhal yenilənmə" },
    ],
  },
  blog: {
    eyebrow: "SEO nəşri",
    title: "Çoxdilli bloq axınını tam nəzarətdə saxla",
    description:
      "Məqalələr, lokal slug-lar, cover şəkillər və SEO məzmunu vahid editor içində idarə olunur.",
    stats: [
      { label: "Fokus", value: "Məzmun və SEO" },
      { label: "Dillər", value: "Hər dil üçün ayrıca" },
    ],
  },
  sales: {
    eyebrow: "CRM və satış",
    title: "Lead, project və realtime chat axınını vahid mərkəzdən idarə et",
    description:
      "Mesajlar, təkliflər, layihələr və yazışmalar bir-biri ilə bağlı olduğu üçün burada submodul kimi işləyir.",
    stats: [
      { label: "Fokus", value: "Lead -> proposal -> project" },
      { label: "Realtime", value: "Admin + client chat" },
    ],
  },
  calculator: {
    eyebrow: "Qiymət mühərriki",
    title: "Kalkulyator məntiqini və mətnlərini idarə et",
    description:
      "Xidmətlər, əlavələr, breakdown və form CTA-ları admin paneldən tam yenilənir.",
    stats: [
      { label: "Fokus", value: "Qiymət və mətndə nəzarət" },
      { label: "Redaktə", value: "Tam editor" },
    ],
  },
  settings: {
    eyebrow: "Biznes detalları",
    title: "Əlaqə məlumatlarını hər yerdə doğru saxla",
    description:
      "Telefon, footer, iş saatları, WhatsApp və sosial hesablar vahid mənbədən idarə olunur.",
    stats: [
      { label: "Fokus", value: "Əlaqə məlumatları" },
      { label: "İstifadə", value: "Footer + əlaqə səhifəsi" },
    ],
  },
};

export function getAdminTabFromPathname(pathname: string): AdminTab {
  const match = adminTabs.find((item) =>
    item.href === "/admin"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return match?.id ?? defaultAdminTab;
}

export function getAdminTabConfig(tab: AdminTab): AdminTabConfig {
  return adminTabs.find((item) => item.id === tab) ?? adminTabs[0];
}

export function getAdminWorkspaceMeta(tab: AdminTab): AdminWorkspaceMeta {
  return workspaceMeta[tab] ?? workspaceMeta[defaultAdminTab];
}
