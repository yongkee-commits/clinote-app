import svgPaths from "./svg-j5zpow08ek";
import imgImageClinote from "figma:asset/c02900cf021aac9ed9b8d16e2a1eb63d813ea2df.png";

function Heading() {
  return (
    <div className="h-[31.195px] relative shrink-0 w-[85.32px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:ExtraBold',sans-serif] leading-[31.2px] left-0 not-italic text-[#111] text-[24px] top-0 tracking-[-0.6px]">리뷰 답변</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[77.977px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#8a8a8a] text-[14px] top-0 tracking-[-0.2px]">강남 연세 치과</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[11.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:Bold',sans-serif] leading-[16.5px] left-0 not-italic text-[11px] text-white top-[0.5px] tracking-[-0.1px]">⚡</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[16.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:Bold',sans-serif] leading-[16.5px] left-0 not-italic text-[11px] text-white top-[0.5px] tracking-[-0.1px]">체험판 (5/20)</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#f59e0b] h-[24.5px] relative rounded-[16777200px] shrink-0 w-[99.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[10px] relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[31.195px] relative shrink-0 w-[978px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Heading />
        <Text />
        <Container2 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[22.398px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Pretendard:Bold',sans-serif] leading-[22.4px] left-0 not-italic text-[#111] text-[16px] top-[-0.5px] tracking-[-0.3px]">리뷰 내용</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[55.398px] relative shrink-0 w-[475px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[16px] px-[20px] relative size-full">
        <Heading1 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Pretendard:SemiBold',sans-serif] leading-[18px] left-0 not-italic text-[#8a8a8a] text-[12px] top-[-0.5px] tracking-[-0.2px]">리뷰 / 채널</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] relative size-full">
          <p className="font-['Pretendard:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(17,17,17,0.5)] tracking-[-0.2px]">네이버 플레이스</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e9eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[66px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] relative size-full">
          <p className="font-['Pretendard:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[13px] text-[rgba(17,17,17,0.5)] tracking-[-0.2px]">{`https://naver.me/...`}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e9eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[118px] items-start left-[20px] top-[20px] w-[435px]" data-name="Container">
      <Container8 />
      <TextInput1 />
    </div>
  );
}

function TextArea() {
  return (
    <div className="absolute h-[548.406px] left-[20px] rounded-[8px] top-[154px] w-[435px]" data-name="Text Area">
      <div className="content-stretch flex items-start overflow-clip p-[14px] relative rounded-[inherit] size-full">
        <p className="font-['Pretendard:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.2px]">네이버, 카카오 리뷰를 입력해주세요</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e9eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[18px] left-[20px] top-[714.41px] w-[435px]" data-name="Container">
      <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#8a8a8a] text-[12px] top-[-0.5px] tracking-[-0.2px]">0자</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#111] content-stretch flex h-[52px] items-center justify-center left-[20px] rounded-[12px] top-[748.41px] w-[435px]" data-name="Button">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.3px]">답변 생성</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[475px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container7 />
        <TextArea />
        <Container9 />
        <Button />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="col-1 h-[877.805px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container5 />
        <Container6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e9eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[22.398px] relative shrink-0 w-[71.008px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:Bold',sans-serif] leading-[22.4px] left-0 not-italic text-[#111] text-[16px] top-[-0.5px] tracking-[-0.3px]">생성된 답변</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-white h-[55.398px] relative shrink-0 w-[475px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px pl-[20px] pr-[383.992px] relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[435px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Pretendard:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#8a8a8a] text-[14px] tracking-[-0.2px]">답변이 여기에 표시됩니다</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[475px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[20px] py-[20px] relative rounded-[inherit] size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="col-2 h-[877.805px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container11 />
        <Container12 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e9eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[978px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] relative size-full">
        <Container4 />
        <Container10 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="h-[981px] relative shrink-0 w-[1026px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start overflow-clip pl-[24px] py-[24px] relative rounded-[inherit] size-full">
        <Container1 />
        <Container3 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f8f9fa] h-[981px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pl-[240px] relative size-full">
        <MainContent />
      </div>
    </div>
  );
}

function Section() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

function Tq() {
  return (
    <div className="absolute bg-[#f8f9fa] content-stretch flex flex-col h-[981px] items-start left-0 top-0 w-[1266px]" data-name="TQ">
      <Container />
      <Section />
    </div>
  );
}

function ImageClinote() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Image (Clinote)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageClinote} />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[73px] relative shrink-0 w-[239px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pl-[20px] pr-[79.969px] pt-[20px] relative size-full">
        <ImageClinote />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[20px] size-[20px] top-[12.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p383b2000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[45px] left-0 rounded-[12px] top-[16px] w-[122.805px]" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Pretendard:SemiBold',sans-serif] leading-[21px] left-[77.5px] not-italic text-[14px] text-black text-center top-[12px] tracking-[-0.2px]">리뷰 답변</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[20px] size-[20px] top-[12.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3713e00} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 7.5H6.66667" id="Vector_3" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M13.3333 10.8333H6.66667" id="Vector_4" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M13.3333 14.1667H6.66667" id="Vector_5" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[45px] left-0 rounded-[12px] top-[61px] w-[123.086px]" data-name="Button">
      <Icon1 />
      <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[21px] left-[78px] not-italic text-[#8a8a8a] text-[14px] text-center top-[12px] tracking-[-0.2px]">문자·공지</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[20px] size-[20px] top-[12.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M10 5V10L13.3333 11.6667" id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[45px] left-0 rounded-[12px] top-[106px] w-[95.797px]" data-name="Button">
      <Icon2 />
      <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[21px] left-[64px] not-italic text-[#8a8a8a] text-[14px] text-center top-[12px] tracking-[-0.2px]">이력</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[20px] size-[20px] top-[12.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p37143280} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p1d7f0000} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p2b722f80} id="Vector_3" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 5H11.6667" id="Vector_4" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 8.33333H11.6667" id="Vector_5" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 11.6667H11.6667" id="Vector_6" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 15H11.6667" id="Vector_7" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[45px] left-0 rounded-[12px] top-[151px] w-[119.586px]" data-name="Button">
      <Icon3 />
      <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[21px] left-[76px] not-italic text-[#8a8a8a] text-[14px] text-center top-[12px] tracking-[-0.2px]">병원정보</p>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[239px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button1 />
        <Button2 />
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[13.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.ped54800} id="Vector" stroke="var(--stroke-0, #111111)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #111111)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[46px] relative shrink-0 w-[239px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
        <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[21px] left-[72px] not-italic text-[#111] text-[14px] text-center top-[13px] tracking-[-0.2px]">환경설정</p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[981px] items-start left-0 pr-px top-0 w-[240px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-r border-solid inset-0 pointer-events-none" />
      <Container14 />
      <Navigation />
      <Button5 />
    </div>
  );
}

export default function AnalyzeClinoteApp() {
  return (
    <div className="bg-white relative size-full" data-name="Analyze Clinote App">
      <Tq />
      <Sidebar />
    </div>
  );
}