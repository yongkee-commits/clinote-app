import { useNavigate } from "react-router";
import { MessageSquare, Zap, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/reply');
    }
  }, [navigate]);

  const steps = [
    {
      image: "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBtb2Rlcm4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzE2NzkxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: MessageSquare,
      title: "AI 리뷰 답변",
      description: "네이버, 카카오 리뷰를\nAI가 자동으로 답변 생성",
    },
    {
      image: "https://images.unsplash.com/photo-1758574437870-f83c160efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtd29yayUyMGNvbGxhYm9yYXRpb24lMjBtZWRpY2FsfGVufDF8fHx8MTc3MTY5NTM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Zap,
      title: "문자 자동 생성",
      description: "초진 안내, 치료 후 주의사항 등\n템플릿 기반 문자 생성",
    },
    {
      image: "https://images.unsplash.com/photo-1758626054657-a33847437867?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGFpJTIwYXNzaXN0YW50fGVufDF8fHx8MTc3MTY5NTM3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Clock,
      title: "효율적인 관리",
      description: "생성한 모든 답변과 문자를\n한눈에 확인하고 관리",
    },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      {/* Logo and Skip */}
      <div className="flex items-center justify-between px-5 py-6">
        <Logo size="md" />
        <button
          onClick={handleSkip}
          className="text-[14px] text-text2 hover:text-text active:opacity-60 font-medium tracking-[-0.2px]"
        >
          건너뛰기
        </button>
      </div>

      {/* Content */}
      <div 
        className="flex-1 flex flex-col px-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={currentStepData.image}
              alt={currentStepData.title}
              className="w-full h-full object-cover"
            />
            {/* Icon Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <currentStepData.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <p className="text-[15px] text-text2 tracking-[-0.3px] mb-6">
            병원 커뮤니케이션의 AI 실장
          </p>
          <h2 className="text-[28px] font-extrabold tracking-[-0.7px] mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-[16px] text-text2 leading-relaxed whitespace-pre-line tracking-[-0.3px]">
            {currentStepData.description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={handleNext}
          className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-60 transition-opacity"
        >
          {currentStep < steps.length - 1 ? "다음" : "시작하기"}
        </button>

        {/* Footer */}
        <p className="text-center text-[12px] text-text2 leading-relaxed tracking-[-0.2px]">
          로그인 시 <a href="#" className="underline hover:text-text">이용약관</a>과 <a href="#" className="underline hover:text-text">개인정보처리방침</a>에<br />동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}