import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Logo } from "./Logo";

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/reply');
    }
  }, [navigate]);

  const handleKakaoLogin = () => {
    // Mock login - in real app, this would redirect to Kakao OAuth
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/reply');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-16">
          <div className="flex justify-center mb-4">
            <Logo size="xl" />
          </div>
          <div className="space-y-2">
            <p className="text-[14px] text-text2 leading-relaxed tracking-[-0.2px]">
              병원 커뮤니케이션의 AI 실장
            </p>
          </div>
        </div>

        {/* Kakao Login Button */}
        <button
          onClick={handleKakaoLogin}
          className="w-full h-[52px] bg-[#FEE500] text-[#191919] rounded-lg font-semibold text-[15px] tracking-[-0.3px] flex items-center justify-center gap-2 hover:opacity-90 active:opacity-60 transition-opacity mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.6818 3.23632 13.5977 5.14367 14.8282L4.31442 17.6211C4.24359 17.8397 4.47877 18.0214 4.67094 17.8956L8.09914 15.6465C8.72078 15.7441 9.35555 15.8 10 15.8C14.4183 15.8 18 12.9046 18 9.3C18 5.69543 14.4183 2.8 10 2.8V3Z"
              fill="#191919"
            />
          </svg>
          카카오로 로그인
        </button>

        {/* Footer */}
        <p className="text-[12px] text-text2 leading-relaxed">
          로그인 시{' '}
          <a href="/terms" className="underline hover:text-text">이용약관</a>과{' '}
          <a href="/privacy" className="underline hover:text-text">개인정보처리방침</a>에<br />
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}