import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionScreen() {
  const currentPlan = "Pro";

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "무료",
      priceDetail: "",
      features: [
        "월 10회 리뷰 답변 생성",
        "월 10회 문자 생성",
        "기본 템플릿 제공",
        "기본 답변 톤 선택",
      ],
      limitations: [
        "고급 템플릿 미제공",
        "커스텀 톤 미제공",
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: "₩29,000",
      priceDetail: "/월",
      popular: true,
      features: [
        "무제한 리뷰 답변 생성",
        "무제한 문자 생성",
        "모든 프리미엄 템플릿",
        "커스텀 답변 톤 설정",
        "답변 히스토리 무제한 저장",
        "우선 고객 지원",
        "AI 학습 데이터 제공",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "문의",
      priceDetail: "",
      features: [
        "Pro 플랜의 모든 기능",
        "다중 계정 관리",
        "전담 계정 매니저",
        "맞춤형 AI 모델 학습",
        "API 연동 지원",
        "온프레미스 배포 옵션",
        "24/7 전화 지원",
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan.toLowerCase()) {
      toast.info("현재 사용 중인 플랜입니다");
    } else {
      toast.success(`${planId.toUpperCase()} 플랜으로 변경되었습니다`);
    }
  };

  const Content = (
    <div className="pb-24 lg:pb-6">
      {/* Current Plan Status */}
      <div className="px-5 py-5 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-bold tracking-[-0.2px]">현재 플랜</h3>
          <span className="px-2.5 py-1 bg-accent text-white rounded-full text-[11px] font-bold tracking-[-0.1px]">
            {currentPlan} 구독중 ✓
          </span>
        </div>
        <p className="text-[13px] text-text2 tracking-[-0.2px]">
          다음 결제일: 2026년 3월 21일
        </p>
      </div>

      {/* Plans */}
      <div className="px-5 pt-5 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-card border-2 rounded-lg overflow-hidden ${
              plan.popular ? 'border-accent' : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="bg-accent text-white text-center py-1.5">
                <span className="text-[11px] font-bold tracking-[-0.1px]">
                  MOST POPULAR
                </span>
              </div>
            )}
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.3px] mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-extrabold tracking-[-0.5px]">
                      {plan.price}
                    </span>
                    {plan.priceDetail && (
                      <span className="text-[14px] text-text2 tracking-[-0.2px]">
                        {plan.priceDetail}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[13px] tracking-[-0.2px]">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2 opacity-40">
                    <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-[13px]">✕</span>
                    <span className="text-[13px] tracking-[-0.2px] line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full h-11 rounded-lg text-[14px] font-medium tracking-[-0.2px] transition ${
                  plan.id === currentPlan.toLowerCase()
                    ? 'bg-card2 text-text2 border border-border cursor-default'
                    : plan.popular
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-text text-white hover:bg-text/90'
                }`}
              >
                {plan.id === currentPlan.toLowerCase()
                  ? '현재 플랜'
                  : plan.id === 'enterprise'
                  ? '문의하기'
                  : '선택하기'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="px-5 pt-8 pb-6">
        <h3 className="text-[14px] font-bold tracking-[-0.2px] mb-4">자주 묻는 질문</h3>
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-[13px] font-bold tracking-[-0.2px] mb-2">플랜은 언제든 변경 가능한가요?</h4>
            <p className="text-[12px] text-text2 tracking-[-0.2px] leading-relaxed">
              네, 언제든지 플랜을 변경하실 수 있습니다. 업그레이드 시 즉시 적용되며, 다운그레이드 시 현재 결제 기간 종료 후 적용됩니다.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-[13px] font-bold tracking-[-0.2px] mb-2">환불 정책은 어떻게 되나요?</h4>
            <p className="text-[12px] text-text2 tracking-[-0.2px] leading-relaxed">
              결제 후 7일 이내 서비스를 사용하지 않은 경우 100% 환불이 가능합니다. 그 외의 경우 이용약관을 참고해주세요.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-[13px] font-bold tracking-[-0.2px] mb-2">결제 수단은 무엇이 있나요?</h4>
            <p className="text-[12px] text-text2 tracking-[-0.2px] leading-relaxed">
              신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="구독 관리" showSettings={false} showBack={true}>
          {Content}
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              구독 관리
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}
