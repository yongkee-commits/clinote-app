import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function NoticeScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const notices = [
    {
      id: 1,
      type: "업데이트",
      title: "v1.0.0 정식 버전 출시",
      date: "2026.02.21",
      content: `안녕하세요, Clinote 팀입니다.

드디어 Clinote v1.0.0 정식 버전을 출시하게 되었습니다!

주요 기능:
• AI 기반 리뷰 답변 자동 생성
• 문자 메시지 자동 생성
• 다양한 답변 톤 선택 (친근한, 전문적인, 공감하는)
• 템플릿 기반 빠른 생성
• 무제한 히스토리 저장 (Pro 플랜)

앞으로도 더 나은 서비스를 제공하기 위해 노력하겠습니다.
감사합니다.`,
      isNew: true,
    },
    {
      id: 2,
      type: "안내",
      title: "설 연휴 고객센터 운영 안내",
      date: "2026.01.28",
      content: `설 연휴 기간 동안 고객센터 운영 시간이 변경됩니다.

• 휴무 기간: 2026년 1월 28일 ~ 2월 2일
• 긴급 문의: support@clinote.com

휴무 기간 중 접수된 문의는 순차적으로 처리됩니다.
이용에 불편을 드려 죄송합니다.`,
      isNew: false,
    },
    {
      id: 3,
      type: "점검",
      title: "정기 서버 점검 안내",
      date: "2026.01.15",
      content: `서비스 품질 향상을 위한 정기 점검을 실시합니다.

• 점검 일시: 2026년 1월 16일 02:00 ~ 04:00 (2시간)
• 점검 내용: 서버 안정화 및 성능 개선
• 영향: 점검 시간 동안 서비스 이용 불가

점검 시간 동안 서비스를 이용하실 수 없습니다.
양해 부탁드립니다.`,
      isNew: false,
    },
    {
      id: 4,
      type: "이벤트",
      title: "신규 가입 이벤트 - Pro 플랜 1개월 무료",
      date: "2026.01.01",
      content: `신규 가입 고객님을 위한 특별 이벤트!

2026년 1월 1일 ~ 1월 31일까지 신규 가입하신 분들께
Pro 플랜 1개월 무료 이용권을 드립니다.

• 대상: 2026년 1월 신규 가입자
• 혜택: Pro 플랜 1개월 무료
• 신청: 자동 적용

이 기회를 놓치지 마세요!`,
      isNew: false,
    },
    {
      id: 5,
      type: "업데이트",
      title: "베타 서비스 종료 및 정식 오픈 예정",
      date: "2025.12.20",
      content: `베타 서비스 참여해주신 모든 분들께 감사드립니다.

2026년 2월 정식 서비스 오픈을 앞두고 베타 서비스를 종료합니다.

• 베타 종료: 2025년 12월 31일
• 정식 오픈: 2026년 2월 1일
• 베타 참여자 혜택: Pro 플랜 50% 할인 쿠폰 제공

정식 오픈과 함께 더욱 향상된 서비스로 찾아뵙겠습니다.`,
      isNew: false,
    },
  ];

  const toggleNotice = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const Content = (
    <div className="space-y-2">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleNotice(notice.id)}
            className="w-full p-4 text-left hover:bg-card2 active:opacity-60 transition"
          >
            <div className="flex items-start gap-3 mb-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-[-0.1px] flex-shrink-0 ${
                  notice.type === "업데이트"
                    ? "bg-accent/10 text-accent"
                    : notice.type === "안내"
                    ? "bg-blue/10 text-blue"
                    : notice.type === "점검"
                    ? "bg-orange/10 text-orange"
                    : "bg-green/10 text-green"
                }`}
              >
                {notice.type}
              </span>
              {notice.isNew && (
                <span className="px-1.5 py-0.5 bg-red text-white rounded text-[10px] font-bold tracking-[-0.1px]">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-[14px] font-medium tracking-[-0.2px] flex-1">
                {notice.title}
              </h3>
              <ChevronDown
                className={`w-4 h-4 text-text2 flex-shrink-0 mt-0.5 transition-transform ${
                  expandedId === notice.id ? "rotate-180" : ""
                }`}
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[12px] text-text2 tracking-[-0.1px]">
              {notice.date}
            </p>
          </button>

          {expandedId === notice.id && (
            <div className="px-4 pb-4 border-t border-border bg-bg">
              <div className="pt-4 text-[13px] text-text tracking-[-0.2px] leading-relaxed whitespace-pre-line">
                {notice.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="공지사항" showSettings={false} showBack={true}>
          <div className="p-5 pb-24">
            {Content}
          </div>
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              공지사항
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}