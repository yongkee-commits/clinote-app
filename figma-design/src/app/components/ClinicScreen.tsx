import { useState, useEffect } from "react";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useClinic } from "../context/ClinicContext";

export function ClinicScreen() {
  const {
    clinicData,
    selectedSpecialty,
    selectedTone,
    selectedKeywords,
    selectedSpecialties,
    updateClinicData,
    updateSelectedSpecialty,
    updateSelectedTone,
    updateSelectedKeywords,
    updateSelectedSpecialties,
  } = useClinic();

  const [localClinicData, setLocalClinicData] = useState(clinicData);
  const [localSelectedSpecialty, setLocalSelectedSpecialty] = useState(selectedSpecialty);
  const [localSelectedTone, setLocalSelectedTone] = useState(selectedTone);
  const [localSelectedKeywords, setLocalSelectedKeywords] = useState(selectedKeywords);
  const [localSelectedSpecialties, setLocalSelectedSpecialties] = useState(selectedSpecialties);

  const [isStyleExpanded, setIsStyleExpanded] = useState(false);

  useEffect(() => {
    setLocalClinicData(clinicData);
    setLocalSelectedSpecialty(selectedSpecialty);
    setLocalSelectedTone(selectedTone);
    setLocalSelectedKeywords(selectedKeywords);
    setLocalSelectedSpecialties(selectedSpecialties);
  }, [clinicData, selectedSpecialty, selectedTone, selectedKeywords, selectedSpecialties]);

  const handleSave = () => {
    updateClinicData(localClinicData);
    updateSelectedSpecialty(localSelectedSpecialty);
    updateSelectedTone(localSelectedTone);
    updateSelectedKeywords(localSelectedKeywords);
    updateSelectedSpecialties(localSelectedSpecialties);
    
    toast.success("병원 정보가 저장되었습니다 ✓");
  };

  const toggleSelection = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const toneOptions = [
    ['존칭 사용', '반말 사용'],
    ['캐주얼', '포멀'],
    ['프렌들리', '전문적'],
    ['간단 설명', '상세 설명'],
    ['따뜻한', '객관적인'],
    ['빠른 답변', '중고급자'],
    ['부드러운 문체', '날카로운 문체'],
    ['감사 인사', '상황에 따라'],
    ['일관성', '유연성'],
    ['존중과 예의', '편안한 대화'],
    ['공감과 이해', '차분한 설명'],
    ['긍정적 메시지', '현실적 조언'],
    ['환자 중심', '병원 중심']
  ];

  const serviceTags = [
    '24시간 운영', '야간 진료', '무수면', '장비특화', '당일 예약 가능',
    '주말 진료', '주차 가능', '긴급 대응', '보험 적용', '외국어 가능'
  ];

  const specialtyOptions = [
    '치과', '한의원', '피부과', '성형외과', '안과',
    '아이비안과과', '정형외과', '내과', '동물병원', '기타'
  ];

  const experienceKeywords = [
    '경력 10년+', '인증 전문의', '대학 병원 출신', '해외 연수', '논문 발표',
    '학회 활동', '수상 경력', '방송 출연', '저서 출판'
  ];

  const specialtyKeywords = [
    '충치', '1종', '근관 치료', '보철', '노쇼',
    '사랑니', '임플란트', '교정', '미백', '잇몸 치료',
    '신경 치료', '크라운', '브릿지', '틀니', '라미네이트',
    '투명 교정', '부분 교정', '양악 수술', '턱관절', '어린이 치과'
  ];

  const Content = (
    <div className="max-w-2xl">
      <p className="text-[13px] text-text2 mb-6 leading-relaxed tracking-[-0.2px]">
        병원 정보를 입력하시면 AI가 맞춤형 답변과 문자를 만들어드려요.
      </p>

      {/* 기본 정보 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">기본 정보</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              병원 이름
            </label>
            <input
              type="text"
              value={localClinicData.name}
              onChange={(e) => setLocalClinicData({ ...localClinicData, name: e.target.value })}
              placeholder="병원명"
              className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              진료과
            </label>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => toggleSelection(localSelectedSpecialty, specialty, setLocalSelectedSpecialty)}
                  className={`h-9 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] transition ${
                    localSelectedSpecialty.includes(specialty)
                      ? 'bg-[#111111] text-white'
                      : 'bg-card2 text-text2 border border-border'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              병원 설명 (선택)
            </label>
            <input
              type="text"
              value={localClinicData.description}
              onChange={(e) => setLocalClinicData({ ...localClinicData, description: e.target.value })}
              className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 연락처 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">연락처</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              전화번호
            </label>
            <input
              type="tel"
              value={localClinicData.phone}
              onChange={(e) => setLocalClinicData({ ...localClinicData, phone: e.target.value })}
              placeholder="01053848836"
              className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 리뷰 / 채널 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">리뷰 / 채널</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              네이버 플레이스
            </label>
            <input
              type="url"
              value={localClinicData.naverUrl}
              onChange={(e) => setLocalClinicData({ ...localClinicData, naverUrl: e.target.value })}
              placeholder="예: https://naver.me/..."
              className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-[13px] text-text2 mb-1.5 tracking-[-0.2px]">
              카카오맵(비즈니스)
            </label>
            <input
              type="url"
              value={localClinicData.kakaoUrl}
              onChange={(e) => setLocalClinicData({ ...localClinicData, kakaoUrl: e.target.value })}
              placeholder="예: https://place.map.kakao.com/..."
              className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 답변 스타일 */}
      <div className="mb-6">
        <button
          onClick={() => setIsStyleExpanded(!isStyleExpanded)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h2 className="text-[14px] font-bold tracking-[-0.2px]">답변 스타일</h2>
          {isStyleExpanded ? (
            <ChevronUp className="w-4 h-4 text-text2" strokeWidth={1} />
          ) : (
            <ChevronDown className="w-4 h-4 text-text2" strokeWidth={1} />
          )}
        </button>
        
        {/* 선택된 스타일 미리보기 */}
        {!isStyleExpanded && localSelectedTone.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {localSelectedTone.slice(0, 4).map((tone) => (
              <span
                key={tone}
                className="h-8 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] bg-[#111111] text-white flex items-center justify-center"
              >
                {tone}
              </span>
            ))}
            {localSelectedTone.length > 4 && (
              <span className="h-8 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] bg-card2 text-text2 border border-border flex items-center justify-center">
                +{localSelectedTone.length - 4}
              </span>
            )}
          </div>
        )}

        {isStyleExpanded && (
          <div className="space-y-2">
            {toneOptions.map((pair, index) => (
              <div key={index} className="flex gap-2">
                {pair.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      // Toggle within pair - only one can be selected from each pair
                      const newTone = localSelectedTone.filter(t => !pair.includes(t));
                      if (!localSelectedTone.includes(option)) {
                        newTone.push(option);
                      }
                      setLocalSelectedTone(newTone);
                    }}
                    className={`flex-1 h-9 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] transition flex items-center justify-center ${
                      localSelectedTone.includes(option)
                        ? 'bg-[#111111] text-white'
                        : 'bg-card2 text-text2 border border-border'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 강점 / 서비스 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">강점 / 서비스</h2>
        <div className="flex flex-wrap gap-2">
          {serviceTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleSelection(localSelectedKeywords, tag, setLocalSelectedKeywords)}
              className={`h-8 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] transition ${
                localSelectedKeywords.includes(tag)
                  ? 'bg-[#111111] text-white'
                  : 'bg-card2 text-text2 border border-border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 경력 / 경험 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">경력 / 경험 중점 키워드</h2>
        <div className="flex flex-wrap gap-2">
          {experienceKeywords.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleSelection(localSelectedKeywords, tag, setLocalSelectedKeywords)}
              className={`h-8 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] transition ${
                localSelectedKeywords.includes(tag)
                  ? 'bg-[#111111] text-white'
                  : 'bg-card2 text-text2 border border-border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 전문 진료 */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold mb-3 tracking-[-0.2px]">전문 진료</h2>
        <div className="flex flex-wrap gap-2">
          {specialtyKeywords.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleSelection(localSelectedSpecialties, tag, setLocalSelectedSpecialties)}
              className={`h-8 px-3 rounded-full text-[12px] font-medium tracking-[-0.1px] transition ${
                localSelectedSpecialties.includes(tag)
                  ? 'bg-[#111111] text-white'
                  : 'bg-card2 text-text2 border border-border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-60 transition-opacity"
      >
        설정 저장
      </button>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="병원정보">
          <div className="p-5 pb-24">
            {Content}
          </div>
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              병원정보
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}