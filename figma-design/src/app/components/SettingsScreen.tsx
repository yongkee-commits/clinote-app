import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function SettingsScreen() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // Mock user data
  const userName = "홍길동";
  const loginMethod = "카카오 계정으로 로그인됨";
  const currentPlan = "Pro";
  const appVersion = "v1.0.0";

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    toast.success("로그아웃되었습니다");
  };

  const handleDeleteHistory = () => {
    setShowDeleteConfirm(false);
    toast.success("전체 이력이 삭제되었습니다");
  };

  const handleWithdraw = () => {
    setShowWithdrawConfirm(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    toast.success("회원 탈퇴가 완료되었습니다");
  };

  const handleContactSupport = () => {
    // 이메일 클라이언트 열기
    window.location.href = 'mailto:designbleach@gmail.com?subject=Clinote 문의사항';
  };

  const Content = (
    <div>
      {/* Profile Section */}
      <div className="-mx-5 lg:-mx-6 px-5 py-8 bg-white border-b border-border flex flex-col items-center mb-5">
        <div className="w-20 h-20 rounded-full bg-card2 border border-border mb-3 flex items-center justify-center overflow-hidden">
          <span className="text-[32px]">👤</span>
        </div>
        <h2 className="text-[18px] font-bold tracking-[-0.3px] mb-1">{userName}</h2>
        <p className="text-[13px] text-text2 tracking-[-0.2px]">{loginMethod}</p>
      </div>

      {/* Subscription Section */}
      <div className="mb-5">
        <h3 className="text-[12px] font-bold text-text2 tracking-[-0.2px] mb-3">구독</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-1">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <span className="text-[14px] tracking-[-0.2px]">현재 플랜</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-accent text-white rounded-full text-[11px] font-bold tracking-[-0.1px]">
                {currentPlan} 구독중 ✓
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/subscription')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-card2 active:opacity-60 transition"
          >
            <span className="text-[14px] tracking-[-0.2px]">구독 관리</span>
            <ChevronRight className="w-5 h-5 text-text2" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="mb-5">
        <h3 className="text-[12px] font-bold text-text2 tracking-[-0.2px] mb-3">데이터 관리</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-1">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-card2 active:opacity-60 transition"
          >
            <span className="text-[14px] tracking-[-0.2px]">전체 이력 삭제</span>
            <ChevronRight className="w-5 h-5 text-text2" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* App Info Section */}
      <div className="mb-5">
        <h3 className="text-[12px] font-bold text-text2 tracking-[-0.2px] mb-3">앱 정보</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-1">
          <button 
            onClick={() => navigate('/notice')}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border hover:bg-card2 active:opacity-60 transition"
          >
            <span className="text-[14px] tracking-[-0.2px]">공지사항</span>
            <ChevronRight className="w-5 h-5 text-text2" strokeWidth={1} />
          </button>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] tracking-[-0.2px]">버전</span>
            <span className="text-[14px] text-text2 tracking-[-0.2px]">{appVersion}</span>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="mb-5">
        <h3 className="text-[12px] font-bold text-text2 tracking-[-0.2px] mb-3">계정</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border hover:bg-card2 active:opacity-60 transition"
          >
            <span className="text-[14px] tracking-[-0.2px]">로그아웃</span>
            <ChevronRight className="w-5 h-5 text-text2" strokeWidth={1} />
          </button>
          <button 
            onClick={() => setShowWithdrawConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-red/5 active:opacity-60 transition"
          >
            <span className="text-[14px] text-red tracking-[-0.2px]">회원 탈퇴</span>
            <ChevronRight className="w-5 h-5 text-red" strokeWidth={1} />
          </button>
          <button 
            onClick={handleContactSupport}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-card2 active:opacity-60 transition"
          >
            <span className="text-[14px] tracking-[-0.2px]">고객 지원</span>
            <ChevronRight className="w-5 h-5 text-text2" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-center gap-2">
        <button 
          onClick={() => navigate('/terms')}
          className="text-[12px] text-text2 tracking-[-0.2px] hover:text-text"
        >
          이용약관
        </button>
        <span className="text-[12px] text-border">·</span>
        <button 
          onClick={() => navigate('/privacy')}
          className="text-[12px] text-text2 tracking-[-0.2px] hover:text-text"
        >
          개인정보처리방침
        </button>
      </div>

      <div className="text-center pb-2">
        <p className="text-[11px] text-text2 tracking-[-0.1px]">
          © 2026 유브이더블유. All rights reserved.
        </p>
      </div>

      {/* Delete History Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-[16px] font-bold tracking-[-0.3px] mb-2">전체 이력 삭제</h3>
            <p className="text-[14px] text-text2 tracking-[-0.2px] mb-6">
              모든 리뷰 답변 및 문자 생성 이력이 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 border border-border rounded-lg text-[14px] font-medium tracking-[-0.2px] hover:bg-card2"
              >
                취소
              </button>
              <button
                onClick={handleDeleteHistory}
                className="flex-1 h-11 bg-red text-white rounded-lg text-[14px] font-medium tracking-[-0.2px] hover:bg-red/90"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-[16px] font-bold tracking-[-0.3px] mb-2">회원 탈퇴</h3>
            <p className="text-[14px] text-text2 tracking-[-0.2px] mb-6">
              계정 및 모든 데이터가 영구 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWithdrawConfirm(false)}
                className="flex-1 h-11 border border-border rounded-lg text-[14px] font-medium tracking-[-0.2px] hover:bg-card2"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 h-11 bg-red text-white rounded-lg text-[14px] font-medium tracking-[-0.2px] hover:bg-red/90"
              >
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="환경설정" showSettings={false}>
          <div className="p-5 pb-24">
            {Content}
          </div>
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              환경설정
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}