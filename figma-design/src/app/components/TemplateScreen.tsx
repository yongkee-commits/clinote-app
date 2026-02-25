import { useState } from "react";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { LoadingSpinner } from "./LoadingSpinner";
import { Copy, Upload, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useClinic } from "../context/ClinicContext";
import { 
  getAdditionalTagsBySpecialty, 
  getTreatmentTypesBySpecialty,
  getCareInstructionsByTreatment,
  getRecallPeriodBySpecialty,
  generateMessage 
} from "../utils/templateUtils";
import svgPaths from "../../imports/svg-oliphv83ju";

type TemplateType = 'first_visit' | 'after_care' | 'recall' | 'noshow' | 'holiday' | 'sns';

interface Template {
  type: TemplateType;
  name: string;
  description: string;
}

export function TemplateScreen() {
  const {
    clinicData,
    selectedSpecialty,
    selectedTone,
    selectedKeywords,
    selectedSpecialties,
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  
  // First Visit fields
  const [appointmentDateTime, setAppointmentDateTime] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // After Care fields
  const [treatmentType, setTreatmentType] = useState<string>('');
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  
  // Recall fields
  const [lastVisitDate, setLastVisitDate] = useState<string>('');
  const [recallPeriod, setRecallPeriod] = useState<string>('');
  
  // Noshow fields
  const [reminderDateTime, setReminderDateTime] = useState<string>('');
  const [reminderMessage, setReminderMessage] = useState<string>('');
  
  // Holiday fields
  const [holidayStartDate, setHolidayStartDate] = useState<string>('');
  const [holidayEndDate, setHolidayEndDate] = useState<string>('');
  const [reopenDate, setReopenDate] = useState<string>('');
  
  // SNS fields
  const [snsTheme, setSnsTheme] = useState<string>('');
  const [snsKeywords, setSnsKeywords] = useState<string[]>([]);
  
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const templates: Template[] = [
    { type: 'first_visit', name: '초진 안내', description: '첫 방문 환자 안내' },
    { type: 'after_care', name: '치료 후 주의사항', description: '시술 후 안내' },
    { type: 'recall', name: '재내원 유도', description: '정기 검진 안내' },
    { type: 'noshow', name: '노쇼 방지', description: '예약 리마인더' },
    { type: 'holiday', name: '휴진 공지', description: '휴무일 안내' },
    { type: 'sns', name: 'SNS 캡션', description: 'SNS 게시물' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedMessage("");

    // Simulate SSE streaming
    let additionalInfo = '';
    if (selectedTags.length > 0) {
      additionalInfo = `\n\n${selectedTags.join(', ')}`;
    }
    
    let mockMessage = '';
    switch (selectedTemplate) {
      case 'first_visit':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\n${appointmentDateTime} 예약이 확정되었습니다.${additionalInfo}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
      case 'after_care':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\n${treatmentType}에 대한 치료 후 주의사항입니다.\n\n${careInstructions.join('\n')}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
      case 'recall':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\n마지막 방문 날짜: ${lastVisitDate}\n\n다음 방문 권장 기간: ${recallPeriod}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
      case 'noshow':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\n리마인더: ${reminderDateTime}\n\n${reminderMessage}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
      case 'holiday':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\n휴진 시작일: ${holidayStartDate}\n\n휴진 종료일: ${holidayEndDate}\n\n재개일: ${reopenDate}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
      case 'sns':
        mockMessage = `안녕하세요, 방문 치과입니다.\n\nSNS 테마: ${snsTheme}\n\n키워드: ${snsKeywords.join(', ')}\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n\n감사합니다.`;
        break;
    }
    
    let currentText = "";
    for (let i = 0; i < mockMessage.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15));
      currentText += mockMessage[i];
      setGeneratedMessage(currentText);
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success("문자가 복사되었습니다 ✓");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: generatedMessage,
        });
        toast.success("공유되었습니다 ✓");
      } catch (error) {
        // User cancelled share or error occurred
        if ((error as Error).name !== 'AbortError') {
          // Fallback to copy
          navigator.clipboard.writeText(generatedMessage);
          toast.success("문자가 복사되었습니다 ✓");
        }
      }
    } else {
      // Fallback to copy if Web Share API is not supported
      navigator.clipboard.writeText(generatedMessage);
      toast.success("문자가 복사되었습니다 ✓");
    }
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setAppointmentDateTime('');
    setSelectedTags([]);
    setTreatmentType('');
    setCareInstructions([]);
    setLastVisitDate('');
    setRecallPeriod('');
    setReminderDateTime('');
    setReminderMessage('');
    setHolidayStartDate('');
    setHolidayEndDate('');
    setReopenDate('');
    setSnsTheme('');
    setSnsKeywords([]);
    setGeneratedMessage("");
  };

  const renderTemplateIcon = (type: TemplateType) => {
    switch (type) {
      case 'first_visit':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d="M16 8V13.333" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M18.667 18.667H13.333" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M18.667 24H13.333" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M18.667 10.667H13.333" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p174070c8} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.pacadf80} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
      case 'after_care':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d={svgPaths.p31ebe7f2} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p189607c0} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
      case 'recall':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d={svgPaths.p37256980} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
      case 'noshow':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d={svgPaths.p18f0c300} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p2879ce00} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p11cffb00} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
      case 'holiday':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d={svgPaths.p1dd37c00} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p30e44080} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M21.333 2.667V8" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M4 13.333H13.333" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d="M28 13.333H20.667" stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.p177d0e00} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
      case 'sns':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32">
            <path d={svgPaths.p9963800} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
            <path d={svgPaths.pb510b80} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
          </svg>
        );
    }
  };

  const MobileView = (
    <MobileLayout title="문자·공지">
      <div className="p-5 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 h-10 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
              activeTab === 'individual'
                ? 'bg-accent text-white'
                : 'border border-border text-text2'
            }`}
          >
            개별 생성
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex-1 h-10 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
              activeTab === 'batch'
                ? 'bg-accent text-white'
                : 'border border-border text-text2'
            }`}
          >
            일괄 생성 (CSV)
          </button>
        </div>

        {activeTab === 'individual' ? (
          <>
            {/* Template Selection */}
            <div>
              <label className="block text-[14px] font-semibold mb-3 tracking-[-0.2px]">
                유형 선택
              </label>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template.type)}
                    className={`border rounded-xl p-4 text-center transition ${
                      selectedTemplate === template.type
                        ? 'bg-accent/5 border-accent'
                        : 'bg-white border-border hover:opacity-60 active:opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      {renderTemplateIcon(template.type)}
                    </div>
                    <div className="text-[12px] font-bold mb-0.5 tracking-[-0.2px] whitespace-nowrap">
                      {template.name}
                    </div>
                    <div className="text-[10px] text-text2 tracking-[-0.1px] whitespace-nowrap">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields - Show when template is selected */}
            {selectedTemplate && (
              <>
                {/* Patient Info */}
                <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                  {selectedTemplate === 'first_visit' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          예약 날짜·시간
                        </label>
                        <input
                          type="datetime-local"
                          value={appointmentDateTime}
                          onChange={(e) => setAppointmentDateTime(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          추가 정보 <span className="text-text2 font-normal">(선택)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getAdditionalTagsBySpecialty(selectedSpecialty).map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1 border rounded-md text-[13px] font-medium tracking-[-0.2px] ${
                                selectedTags.includes(tag) ? 'bg-accent text-white' : 'bg-white border-border text-text2'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'after_care' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          치료 유형
                        </label>
                        <input
                          type="text"
                          value={treatmentType}
                          onChange={(e) => setTreatmentType(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          주의사항 <span className="text-text2 font-normal">(선택)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getCareInstructionsByTreatment(selectedSpecialty, treatmentType).map((instruction, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={instruction}
                                onChange={(e) => {
                                  const newInstructions = [...careInstructions];
                                  newInstructions[index] = e.target.value;
                                  setCareInstructions(newInstructions);
                                }}
                                className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                              />
                              <button
                                onClick={() => {
                                  const newInstructions = careInstructions.filter((_, i) => i !== index);
                                  setCareInstructions(newInstructions);
                                }}
                                className="ml-2 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setCareInstructions([...careInstructions, ''])}
                            className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                          >
                            추가
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'recall' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          마지막 방문 날짜
                        </label>
                        <input
                          type="date"
                          value={lastVisitDate}
                          onChange={(e) => setLastVisitDate(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          재방문 권장 기간
                        </label>
                        <input
                          type="text"
                          value={recallPeriod}
                          onChange={(e) => setRecallPeriod(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'noshow' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          리마인더 날짜·시간
                        </label>
                        <input
                          type="datetime-local"
                          value={reminderDateTime}
                          onChange={(e) => setReminderDateTime(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          리마인더 메시지
                        </label>
                        <input
                          type="text"
                          value={reminderMessage}
                          onChange={(e) => setReminderMessage(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'holiday' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          휴진 시작일
                        </label>
                        <input
                          type="date"
                          value={holidayStartDate}
                          onChange={(e) => setHolidayStartDate(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          휴진 종료일
                        </label>
                        <input
                          type="date"
                          value={holidayEndDate}
                          onChange={(e) => setHolidayEndDate(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          재개일
                        </label>
                        <input
                          type="date"
                          value={reopenDate}
                          onChange={(e) => setReopenDate(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'sns' && (
                    <>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          테마
                        </label>
                        <input
                          type="text"
                          value={snsTheme}
                          onChange={(e) => setSnsTheme(e.target.value)}
                          className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                          키워드 <span className="text-text2 font-normal">(선택)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {snsKeywords.map((keyword, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                  const newKeywords = [...snsKeywords];
                                  newKeywords[index] = e.target.value;
                                  setSnsKeywords(newKeywords);
                                }}
                                className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                              />
                              <button
                                onClick={() => {
                                  const newKeywords = snsKeywords.filter((_, i) => i !== index);
                                  setSnsKeywords(newKeywords);
                                }}
                                className="ml-2 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setSnsKeywords([...snsKeywords, ''])}
                            className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                          >
                            추가
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-60 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    '문자 생성'
                  )}
                </button>

                {/* Generated Message */}
                {generatedMessage && (
                  <div className="bg-card border border-border rounded-lg p-5">
                    <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                      생성된 문자
                    </label>
                    <div className="w-full min-h-32 px-3.5 py-3.5 bg-card2 rounded-md text-[14px] tracking-[-0.2px] whitespace-pre-wrap">
                      {generatedMessage}
                    </div>
                    <div className="mt-1.5 text-[12px] text-text2">
                      {generatedMessage.length}자
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                      >
                        <Copy className="w-4 h-4" strokeWidth={1} />
                        복사
                      </button>
                      <button
                        onClick={handleShare}
                        className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                      >
                        <Share2 className="w-4 h-4" strokeWidth={1} />
                        공유
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-text2 mx-auto mb-4" strokeWidth={1} />
            <p className="text-[14px] text-text2 mb-4">
              CSV 파일을 업로드하여<br />
              여러 환자에게 문자를 일괄 생성하세요
            </p>
            <button className="h-11 px-6 border border-border bg-white rounded-lg text-[13px] font-medium tracking-[-0.2px] hover:bg-card2">
              CSV 파일 선택
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );

  const DesktopView = (
    <DesktopLayout>
      <div className="p-6">
        <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
          문자·공지
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 h-10 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
              activeTab === 'individual'
                ? 'bg-accent text-white'
                : 'border border-border text-text2'
            }`}
          >
            개별 생성
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 h-10 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
              activeTab === 'batch'
                ? 'bg-accent text-white'
                : 'border border-border text-text2'
            }`}
          >
            일괄 생성 (CSV)
          </button>
        </div>

        {activeTab === 'individual' ? (
          <>
            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-[14px] font-semibold mb-3 tracking-[-0.2px]">
                유형 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template.type)}
                    className={`border rounded-xl p-4 text-center transition min-w-0 ${
                      selectedTemplate === template.type
                        ? 'bg-accent/5 border-accent'
                        : 'bg-white border-border hover:opacity-60 active:opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      {renderTemplateIcon(template.type)}
                    </div>
                    <div className="text-[12px] font-bold mb-0.5 tracking-[-0.2px]">
                      {template.name}
                    </div>
                    <div className="text-[10px] text-text2 tracking-[-0.1px]">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields - Show when template is selected */}
            {selectedTemplate && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left Panel - Input */}
                <div>
                  <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                    {selectedTemplate === 'first_visit' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            예약 날짜·시간
                          </label>
                          <input
                            type="datetime-local"
                            value={appointmentDateTime}
                            onChange={(e) => setAppointmentDateTime(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            추가 정보 <span className="text-text2 font-normal">(선택)</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getAdditionalTagsBySpecialty(selectedSpecialty).map(tag => (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 border rounded-md text-[13px] font-medium tracking-[-0.2px] ${
                                  selectedTags.includes(tag) ? 'bg-accent text-white' : 'bg-white border-border text-text2'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {selectedTemplate === 'after_care' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            치료 유형
                          </label>
                          <input
                            type="text"
                            value={treatmentType}
                            onChange={(e) => setTreatmentType(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            주의사항 <span className="text-text2 font-normal">(선택)</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getCareInstructionsByTreatment(selectedSpecialty, treatmentType).map((instruction, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="text"
                                  value={instruction}
                                  onChange={(e) => {
                                    const newInstructions = [...careInstructions];
                                    newInstructions[index] = e.target.value;
                                    setCareInstructions(newInstructions);
                                  }}
                                  className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                  onClick={() => {
                                    const newInstructions = careInstructions.filter((_, i) => i !== index);
                                    setCareInstructions(newInstructions);
                                  }}
                                  className="ml-2 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => setCareInstructions([...careInstructions, ''])}
                              className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                            >
                              추가
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {selectedTemplate === 'recall' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            마지막 방문 날짜
                          </label>
                          <input
                            type="date"
                            value={lastVisitDate}
                            onChange={(e) => setLastVisitDate(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            재방문 권장 기간
                          </label>
                          <input
                            type="text"
                            value={recallPeriod}
                            onChange={(e) => setRecallPeriod(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </>
                    )}
                    {selectedTemplate === 'noshow' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            리마인더 날짜·시간
                          </label>
                          <input
                            type="datetime-local"
                            value={reminderDateTime}
                            onChange={(e) => setReminderDateTime(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            리마인더 메시지
                          </label>
                          <input
                            type="text"
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </>
                    )}
                    {selectedTemplate === 'holiday' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            휴진 시작일
                          </label>
                          <input
                            type="date"
                            value={holidayStartDate}
                            onChange={(e) => setHolidayStartDate(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            휴진 종료일
                          </label>
                          <input
                            type="date"
                            value={holidayEndDate}
                            onChange={(e) => setHolidayEndDate(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            재개일
                          </label>
                          <input
                            type="date"
                            value={reopenDate}
                            onChange={(e) => setReopenDate(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </>
                    )}
                    {selectedTemplate === 'sns' && (
                      <>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            테마
                          </label>
                          <input
                            type="text"
                            value={snsTheme}
                            onChange={(e) => setSnsTheme(e.target.value)}
                            className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
                            키워드 <span className="text-text2 font-normal">(선택)</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {snsKeywords.map((keyword, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="text"
                                  value={keyword}
                                  onChange={(e) => {
                                    const newKeywords = [...snsKeywords];
                                    newKeywords[index] = e.target.value;
                                    setSnsKeywords(newKeywords);
                                  }}
                                  className="w-full h-11 px-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                  onClick={() => {
                                    const newKeywords = snsKeywords.filter((_, i) => i !== index);
                                    setSnsKeywords(newKeywords);
                                  }}
                                  className="ml-2 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => setSnsKeywords([...snsKeywords, ''])}
                              className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                            >
                              추가
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-60 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        '문자 생성'
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Panel - Output */}
                <div className="border border-border rounded-lg flex flex-col">
                  <div className="bg-card2 border-b border-border px-5 py-4 flex items-center justify-between">
                    <h2 className="text-[16px] font-bold tracking-[-0.3px]">
                      생성된 문자
                    </h2>
                    {generatedMessage && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                        >
                          <Copy className="w-4 h-4" strokeWidth={1} />
                          복사
                        </button>
                        <button
                          onClick={handleShare}
                          className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                        >
                          <Share2 className="w-4 h-4" strokeWidth={1} />
                          공유
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    {generatedMessage ? (
                      <>
                        <div className="px-3.5 py-3.5 bg-card2 rounded-md text-[14px] tracking-[-0.2px] whitespace-pre-wrap">
                          {generatedMessage}
                        </div>
                        <div className="mt-3 text-[12px] text-text2">
                          {generatedMessage.length}자
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[14px] text-text2">
                        생성된 문자가 여기에 표시됩니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Upload className="w-16 h-16 text-text2 mx-auto mb-4" strokeWidth={1} />
            <p className="text-[14px] text-text2 mb-4">
              CSV 파일을 업로드하여 여러 환자에게 문자를 일괄 생성하세요
            </p>
            <button className="h-11 px-6 border border-border bg-white rounded-lg text-[13px] font-medium tracking-[-0.2px] hover:bg-card2">
              CSV 파일 선택
            </button>
          </div>
        )}
      </div>
    </DesktopLayout>
  );

  return (
    <>
      {MobileView}
      {DesktopView}
    </>
  );
}