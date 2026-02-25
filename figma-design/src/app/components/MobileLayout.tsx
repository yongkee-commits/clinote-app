import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { MessageSquare, FileText, Clock, Building2, Settings, ChevronLeft } from "lucide-react";
import { Logo } from "./Logo";

interface MobileLayoutProps {
  children: ReactNode;
  title: string | 'logo';
  subtitle?: string;
  badge?: ReactNode;
  showSettings?: boolean;
  showBack?: boolean;
}

export function MobileLayout({ children, title, subtitle, badge, showSettings = true, showBack = false }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/reply', icon: MessageSquare, label: '리뷰' },
    { path: '/template', icon: FileText, label: '문자' },
    { path: '/history', icon: Clock, label: '이력' },
    { path: '/clinic', icon: Building2, label: '병원' },
  ];

  return (
    <div className="lg:hidden min-h-screen bg-bg flex flex-col max-w-[480px] mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center text-text2 hover:text-text active:opacity-60"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={0.833333} />
            </button>
          )}
          {title === 'logo' ? (
            <Logo size="sm" onClick={() => navigate('/reply')} />
          ) : (
            <h1 className="text-[18px] font-extrabold tracking-[-0.5px]">
              {title}
            </h1>
          )}
          {subtitle && (
            <span className="text-[13px] text-text2 tracking-[-0.2px]">
              {subtitle}
            </span>
          )}
          {badge && <div className="ml-auto">{badge}</div>}
          {showSettings && !badge && (
            <button
              onClick={() => navigate('/settings')}
              className="ml-auto w-9 h-9 flex items-center justify-center text-text2 hover:text-text active:opacity-60"
            >
              <Settings className="w-5 h-5" strokeWidth={0.833333} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-100 bg-white border-t border-border">
        <div className="flex items-center justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition ${
                  isActive ? 'text-text' : 'text-text2'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={0.833333} />
                <span className="text-[10px] font-medium tracking-[-0.1px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}