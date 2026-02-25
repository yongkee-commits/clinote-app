import { useState, useEffect } from "react";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { LoadingSpinner } from "./LoadingSpinner";
import { Copy, RefreshCw, RotateCcw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import imgImage9 from "figma:asset/6f04c137c345df0bab37e0c6560333897480a37b.png";
import svgPaths from "../../imports/svg-5o0wd2m79f";

export function ReplyScreen() {
  const [reviewText, setReviewText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [clinicData, setClinicData] = useState({ naverUrl: "", kakaoUrl: "" });

  // Load clinic data from localStorage
  useEffect(() => {
    const savedClinicData = localStorage.getItem('clinicData');
    if (savedClinicData) {
      setClinicData(JSON.parse(savedClinicData));
    }
  }, []);

  // Mock subscription status
  const plan = 'trial';
  const dailyCount = 5;
  const dailyLimit = 20;

  const handleGenerate = async () => {
    if (reviewText.trim().length < 5) {
      toast.error("리뷰 내용을 5자 이상 입력해주세요");
      return;
    }

    setIsGenerating(true);
    setReplyText("");

    // Simulate SSE streaming
    const mockReply = "안녕하세요. 소한 리뷰 남겨주셔서 진심으로 감사드립니다. 저희 병원을 믿고 방문해주셔서 감사하며, 앞으로도 더 나은 진료와 서비스로 보답하겠습니다. 다시 한번 감사드립니다.";
    
    let currentText = "";
    for (let i = 0; i < mockReply.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      currentText += mockReply[i];
      setReplyText(currentText);
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    toast.success("답변이 복사되었습니다 ✓");
  };

  const handleReset = () => {
    setReviewText("");
    setReplyText("");
  };

  const trialBadge = plan === 'trial' ? (
    <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-br from-yellow to-[#f59e0b] text-white rounded-full text-[11px] font-bold tracking-[-0.1px]">
      <span>⚡</span>
      <span>체험판 ({dailyCount}/{dailyLimit})</span>
    </div>
  ) : null;

  const MobileView = (
    <MobileLayout 
      title="리뷰 답변"
    >
      <div className="p-5 space-y-4">
        {/* Review Input */}
        <div className="bg-card border border-border rounded-lg p-5">
          <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
            리뷰 내용
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="네이버, 카카오 리뷰를 입력해주세요"
            className="w-full h-32 px-3.5 py-3.5 border border-border rounded-md text-[14px] tracking-[-0.2px] resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <div className="mt-1.5 text-[12px] text-text2">
            {reviewText.length}자
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-60 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner className="w-4 h-4" />
              생성 중...
            </>
          ) : (
            '답변 생성'
          )}
        </button>

        {/* Quick Links to Review Platforms */}
        {(clinicData.naverUrl || clinicData.kakaoUrl) && (
          <div className="flex gap-3 -mt-2">
            {clinicData.naverUrl && (
              <a
                href={clinicData.naverUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.2px] text-text2 hover:text-text transition-colors"
              >
                <span>📍</span>
                네이버 플레이스 리뷰
              </a>
            )}
            
            {clinicData.kakaoUrl && (
              <a
                href={clinicData.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.2px] text-text2 hover:text-text transition-colors"
              >
                <span>📍</span>
                카카오맵(비즈니스) 리뷰
              </a>
            )}
          </div>
        )}

        {/* Reply Output */}
        {replyText && (
          <div className="bg-card border border-border rounded-lg p-5">
            <label className="block text-[14px] font-semibold mb-2 tracking-[-0.2px]">
              생성된 답변
            </label>
            <div className="w-full min-h-32 px-3.5 py-3.5 bg-card2 rounded-md text-[14px] tracking-[-0.2px] whitespace-pre-wrap">
              {replyText}
            </div>
            <div className="mt-1.5 text-[12px] text-text2">
              {replyText.length}자
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopy}
                className="flex-1 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" strokeWidth={1} />
                복사
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1} />
                재생성
              </button>
              <button
                onClick={handleReset}
                className="flex-1 h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={1} />
                초기화
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );

  const DesktopView = (
    <DesktopLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[24px] font-extrabold tracking-[-0.6px]">
            리뷰 답변
          </h1>
          <span className="text-[14px] text-text2 tracking-[-0.2px]">강남 연세 치과</span>
          {trialBadge}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[16px] font-bold tracking-[-0.3px]">
                리뷰 내용
              </h2>
            </div>
            
            {/* Content */}
            <div className="p-5 relative">
              {/* Textarea */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="네이버, 카카오 리뷰를 입력해주세요"
                className="w-full h-[548px] px-3.5 py-3.5 border border-border rounded-lg text-[14px] tracking-[-0.2px] placeholder:text-[rgba(17,17,17,0.5)] resize-none focus:outline-none focus:ring-2 focus:ring-accent/10 mb-3"
              />
              
              {/* Character Count */}
              <div className="text-[12px] text-text2 tracking-[-0.2px] mb-4">
                {reviewText.length}자
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-[52px] bg-accent text-white rounded-lg font-semibold text-[15px] tracking-[-0.3px] hover:opacity-90 active:opacity-80 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="w-4 h-4" />
                    생성 중...
                  </>
                ) : (
                  '답변 생성'
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="text-[16px] font-bold tracking-[-0.3px]">
                생성된 답변
              </h2>
              {replyText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1} />
                    복사
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="h-9 px-4 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" strokeWidth={1} />
                    재생성
                  </button>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-5">
              {replyText ? (
                <>
                  <div className="min-h-[548px] px-3.5 py-3.5 bg-card2 rounded-lg text-[14px] tracking-[-0.2px] whitespace-pre-wrap">
                    {replyText}
                  </div>
                  <div className="mt-3 text-[12px] text-text2 tracking-[-0.2px]">
                    {replyText.length}자
                  </div>
                </>
              ) : (
                <div className="min-h-[548px] flex items-center justify-center text-[14px] text-text2 tracking-[-0.2px]">
                  답변이 여기에 표시됩니다
                </div>
              )}
            </div>
          </div>
        </div>
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