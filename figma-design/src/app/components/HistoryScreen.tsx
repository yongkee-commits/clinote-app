import { useState } from "react";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

type HistoryType = 'all' | 'review' | 'message';

interface HistoryItem {
  id: number;
  type: 'review' | 'message';
  label: string;
  labelColor: string;
  labelBg: string;
  name: string;
  originalText: string;
  resultText: string;
  date: string;
}

export function HistoryScreen() {
  const [filter, setFilter] = useState<HistoryType>('all');

  // Mock data
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      type: 'review',
      label: '리뷰',
      labelColor: '#0369a1',
      labelBg: '#e0f2fe',
      name: '',
      originalText: '친절하고 좋았어요. 추천합니다.',
      resultText: '안녕하세요. 소중한 리뷰 남겨주셔서 진심으로 감사드립니다. 저희 병원을 믿고 방문해주셔서 감사하며, 앞으로도 더 나은 진료와 서비스로 보답하겠습니다.',
      date: '12/20 14:32',
    },
    {
      id: 2,
      type: 'message',
      label: '초진 안내',
      labelColor: '#92400e',
      labelBg: '#fef3c7',
      name: '김철수',
      originalText: '',
      resultText: '김철수 님, 안녕하세요! 저희 병원을 방문해주셔서 진심으로 감사합니다. 예약하신 일정은 12월 25일 오후 2시입니다. 메모하신 일정을 잊지 마시고, 앞으로도 더 나은 진료와 서비스로 보답하겠습니다.',
      date: '12/19 10:15',
    },
    {
      id: 3,
      type: 'message',
      label: '재내원 독려',
      labelColor: '#92400e',
      labelBg: '#fef3c7',
      name: '이영희',
      originalText: '',
      resultText: '이영희 님, 안녕하세요. 정기 검진 시기가 다가왔습니다. 건강한 치아 관리를 위해 방문해주세요.',
      date: '12/18 16:45',
    },
  ]);

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'review') return item.type === 'review';
    if (filter === 'message') return item.type === 'message';
    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("복사되었습니다 ✓");
  };

  const handleDelete = (id: number) => {
    setHistory(history.filter((item) => item.id !== id));
    toast.success("삭제되었습니다");
  };

  const Content = (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 h-9 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
            filter === 'all'
              ? 'bg-[#111111] text-white'
              : 'border border-border text-text2'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('review')}
          className={`px-6 h-9 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
            filter === 'review'
              ? 'bg-[#111111] text-white'
              : 'border border-border text-text2'
          }`}
        >
          리뷰
        </button>
        <button
          onClick={() => setFilter('message')}
          className={`px-6 h-9 rounded-full text-[13px] font-medium tracking-[-0.2px] transition ${
            filter === 'message'
              ? 'bg-[#111111] text-white'
              : 'border border-border text-text2'
          }`}
        >
          문자
        </button>
      </div>

      {/* History Items */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px] text-text2">이력이 없습니다</p>
        </div>
      ) : (
        filteredHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-border rounded-xl p-4"
          >
            {/* Label and Date */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-[-0.1px]"
                style={{ color: item.labelColor, backgroundColor: item.labelBg }}
              >
                {item.label}
              </span>
              <span className="text-[12px] text-text2 tracking-[-0.2px]">
                {item.date}
              </span>
            </div>

            {/* Original Text (for review) or Name (for message) */}
            {item.type === 'review' && item.originalText && (
              <p className="text-[13px] text-text2 mb-1 tracking-[-0.2px]">
                {item.originalText}
              </p>
            )}
            {item.type === 'message' && item.name && (
              <p className="text-[13px] text-text2 mb-1 tracking-[-0.2px]">
                {item.name}
              </p>
            )}

            {/* Result Text */}
            <p className="text-[14px] text-text leading-[21px] tracking-[-0.2px] mb-4">
              {item.resultText}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(item.resultText)}
                className="flex-1 h-8 border border-border bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] hover:bg-card2 active:opacity-60 transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={0.833333} />
                복사
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 h-8 border border-red/20 bg-white rounded-md text-[13px] font-medium tracking-[-0.2px] text-red hover:bg-red/5 active:opacity-60 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={0.833333} />
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileLayout title="이력" showSettings={true}>
          <div className="p-5 pb-24">
            {Content}
          </div>
        </MobileLayout>
      </div>
      <div className="hidden lg:block">
        <DesktopLayout>
          <div className="p-6">
            <h1 className="text-[24px] font-extrabold tracking-[-0.6px] mb-6">
              이력
            </h1>
            {Content}
          </div>
        </DesktopLayout>
      </div>
    </>
  );
}
