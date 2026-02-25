import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { MessageSquare, FileText, Clock, Building2, Settings } from "lucide-react";
import { Logo } from "./Logo";

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/reply', icon: MessageSquare, label: '리뷰 답변' },
    { path: '/template', icon: FileText, label: '문자·공지' },
    { path: '/history', icon: Clock, label: '이력' },
    { path: '/clinic', icon: Building2, label: '병원정보' },
  ];

  return (
    <div className="hidden lg:flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="h-[73px] border-b border-border px-5 pt-5 pb-[21px]">
          <Logo size="md" onClick={() => navigate('/reply')} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-[14px] font-medium tracking-[-0.2px] transition-colors ${
                  isActive
                    ? 'text-text'
                    : 'text-text2'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={0.833333} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-4 py-[13px] text-[14px] font-medium tracking-[-0.2px] transition-colors border-t border-border ${
            location.pathname === '/settings'
              ? 'text-text'
              : 'text-text'
          }`}
        >
          <Settings className="w-5 h-5" strokeWidth={0.833333} />
          환경설정
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}