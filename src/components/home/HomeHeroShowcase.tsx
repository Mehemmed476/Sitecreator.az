import { BellRing, Bot, ChartNoAxesCombined, FolderKanban, MessageCircleMore, ShieldCheck } from "lucide-react";
import type { HomepageLocale } from "@/lib/homepage-content";

const showcaseCopy = {
  az: {
    live: "Canlı iş axını",
    sync: "Portal, CRM və chat eyni anda işləyir",
    signal: "Yeni lead",
    signalValue: "Qiymət sorğusu gəldi",
    incoming: "Portal yeniləndi, fayllar hazırdır.",
    outgoing: "Çox yaxşıdır, baxıram.",
    cards: [
      { title: "Client portal", detail: "Proposal, status və fayllar bir paneldə", icon: ShieldCheck },
      { title: "Realtime chat", detail: "Admin və müştəri eyni thread üzərində", icon: MessageCircleMore },
      { title: "Satış axını", detail: "Lead -> proposal -> project", icon: ChartNoAxesCombined },
    ],
    stack: [
      { label: "Calculator", value: "₼ 1.130 təklif hazırdır" },
      { label: "Layihə", value: "Review mərhələsində" },
      { label: "Bildiriş", value: "Müştəri mesaj yazdı" },
    ],
  },
  en: {
    live: "Live workflow",
    sync: "Portal, CRM, and chat move together",
    signal: "New lead",
    signalValue: "Pricing request received",
    incoming: "Portal has been updated, files are ready.",
    outgoing: "Perfect, I am checking now.",
    cards: [
      { title: "Client portal", detail: "Proposals, status, and files in one place", icon: ShieldCheck },
      { title: "Realtime chat", detail: "Admin and client in the same thread", icon: MessageCircleMore },
      { title: "Sales flow", detail: "Lead -> proposal -> project", icon: ChartNoAxesCombined },
    ],
    stack: [
      { label: "Calculator", value: "₼ 1,130 proposal ready" },
      { label: "Project", value: "In review stage" },
      { label: "Notification", value: "Client sent a message" },
    ],
  },
  ru: {
    live: "Живой рабочий поток",
    sync: "Портал, CRM и чат работают как одна система",
    signal: "Новый лид",
    signalValue: "Получен запрос на расчёт",
    incoming: "Портал обновлён, файлы готовы.",
    outgoing: "Отлично, уже смотрю.",
    cards: [
      { title: "Client portal", detail: "Предложение, статус и файлы в одной панели", icon: ShieldCheck },
      { title: "Realtime chat", detail: "Админ и клиент в одном потоке", icon: MessageCircleMore },
      { title: "Sales flow", detail: "Lead -> proposal -> project", icon: ChartNoAxesCombined },
    ],
    stack: [
      { label: "Calculator", value: "Предложение на ₼ 1.130 готово" },
      { label: "Проект", value: "Этап review" },
      { label: "Уведомление", value: "Клиент написал сообщение" },
    ],
  },
} satisfies Record<
  HomepageLocale,
  {
    live: string;
    sync: string;
    signal: string;
    signalValue: string;
    incoming: string;
    outgoing: string;
    cards: Array<{ title: string; detail: string; icon: typeof ShieldCheck }>;
    stack: Array<{ label: string; value: string }>;
  }
>;

export function HomeHeroShowcase({ locale }: { locale: HomepageLocale }) {
  const copy = showcaseCopy[locale];
  const TopIcon = copy.cards[1].icon;
  const BottomIcon = copy.cards[2].icon;

  return (
    <div className="hero-scene-wrapper">
      <div className="hero-scene-orb hero-scene-orb-primary" />
      <div className="hero-scene-orb hero-scene-orb-secondary" />

      <div className="hero-scene-shell">
        <div className="hero-scene-video">
          <div className="hero-scene-grid" />
          <div className="hero-scene-scanline" />

          <div className="hero-scene-topbar">
            <div>
              <p className="hero-scene-kicker">{copy.live}</p>
              <p className="hero-scene-muted">{copy.sync}</p>
            </div>
            <div className="hero-scene-signal">
              <BellRing className="h-4 w-4" />
              {copy.signal}
            </div>
          </div>

          <div className="hero-scene-main">
            <div className="hero-scene-dashboard">
              <div className="hero-scene-dashboard-head">
                <div className="hero-scene-dot-group">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-scene-pill">
                  <Bot className="h-3.5 w-3.5" />
                  {copy.signalValue}
                </div>
              </div>

              <div className="hero-scene-columns">
                <div className="hero-scene-column hero-scene-column-primary">
                  {copy.stack.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="hero-scene-data-card"
                      style={{ animationDelay: `${index * 140}ms` }}
                    >
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="hero-scene-column hero-scene-column-secondary">
                  <div className="hero-scene-chat-card">
                    <div className="hero-scene-chat-head">
                      <span className="hero-scene-avatar">SC</span>
                    <div>
                      <p>SiteCreator</p>
                      <small>Online</small>
                    </div>
                  </div>
                  <div className="hero-scene-chat-bubble hero-scene-chat-bubble-left">
                    {copy.incoming}
                  </div>
                  <div className="hero-scene-chat-bubble hero-scene-chat-bubble-right">
                    {copy.outgoing}
                  </div>
                    <div className="hero-scene-chat-input">
                      <MessageCircleMore className="h-4 w-4" />
                      Realtime chat
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card-top">
              <div className="hero-floating-icon">
                <FolderKanban className="h-4 w-4" />
              </div>
              <div>
                <strong>{copy.cards[0].title}</strong>
                <span>{copy.cards[0].detail}</span>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card-middle">
              <div className="hero-floating-icon">
                <TopIcon className="h-4 w-4" />
              </div>
              <div>
                <strong>{copy.cards[1].title}</strong>
                <span>{copy.cards[1].detail}</span>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-card-bottom">
              <div className="hero-floating-icon">
                <BottomIcon className="h-4 w-4" />
              </div>
              <div>
                <strong>{copy.cards[2].title}</strong>
                <span>{copy.cards[2].detail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
