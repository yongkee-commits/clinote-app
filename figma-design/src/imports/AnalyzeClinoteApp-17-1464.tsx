import svgPaths from "./svg-30zotukf9z";
import imgImage9 from "figma:asset/6f04c137c345df0bab37e0c6560333897480a37b.png";

function Label() {
  return (
    <div className="absolute h-[20.995px] left-[20.53px] top-[20.53px] w-[311.961px]" data-name="Label">
      <p className="absolute font-['Pretendard:SemiBold',sans-serif] leading-[21px] left-0 not-italic text-[#111] text-[14px] top-[0.12px] tracking-[-0.2px]">리뷰 내용</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="absolute h-[127.998px] left-[20.53px] rounded-[8px] top-[49.53px] w-[311.961px]" data-name="Text Area">
      <div className="content-stretch flex items-start overflow-clip p-[14px] relative rounded-[inherit] size-full">
        <p className="font-['Pretendard:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.2px]">네이버, 카카오 리뷰를 입력해주세요</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-[0.531px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[18px] left-[20.53px] top-[190px] w-[311.961px]" data-name="Container">
      <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#8a8a8a] text-[12px] top-[-0.41px] tracking-[-0.2px]">0자</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-white h-[228.527px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-[0.531px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Label />
      <TextArea />
      <Container3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#111] content-stretch flex h-[51.999px] items-center justify-center relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.3px]">답변 생성</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <div className="absolute bg-[#f3f3f3] border-[0.5px] border-[rgba(0,0,0,0.1)] border-solid left-0 rounded-[3.2px] size-[16px] top-0" />
      <div className="absolute h-[10.56px] left-[3.84px] top-[2.72px] w-[8.16px]" data-name="image 9">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
      <Frame2 />
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.5px]">네이버 플레이스 리뷰</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[15.77%_26%_15.77%_25.42%]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.77309 10.9526">
        <g id="Group 13">
          <path d={svgPaths.p321df880} fill="var(--fill-0, #007DFD)" id="Vector" />
          <path d={svgPaths.p15e17f00} fill="var(--fill-0, #FBE101)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <div className="absolute bg-[#fbe101] border-[0.16px] border-[rgba(0,0,0,0.1)] border-solid left-0 rounded-[3.2px] size-[16px] top-0" />
      <Group />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
      <Frame4 />
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.5px]">카카오맵(비즈니스) 리뷰</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[526.58px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[20px] px-[20px] relative size-full">
        <Container2 />
        <Button />
        <Frame3 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[393.022px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f8f9fa] content-stretch flex flex-col h-[851.902px] items-start pb-[53.526px] pt-[68.53px] relative shrink-0 w-full" data-name="Container">
      <MainContent />
    </div>
  );
}

function Section() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

function T() {
  return (
    <div className="absolute bg-[#f8f9fa] content-stretch flex flex-col h-[851.902px] items-start left-0 top-0 w-[393.022px]" data-name="T0">
      <Container />
      <Section />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[23.394px] relative shrink-0 w-[63.742px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Pretendard:ExtraBold',sans-serif] leading-[23.4px] left-0 not-italic text-[#111] text-[18px] top-[0.53px] tracking-[-0.5px]">리뷰 답변</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9997 19.9997">
        <g id="Icon">
          <path d={svgPaths.p142a1700} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d={svgPaths.p24219900} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0 size-[35.999px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[253.282px] h-[35.999px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Button1 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[68.53px] items-start left-0 pb-[0.531px] pt-[16px] px-[20px] top-0 w-[393.022px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e8e9eb] border-b-[0.531px] border-solid inset-0 pointer-events-none" />
      <Container4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9997 19.9997">
        <g id="Icon">
          <path d={svgPaths.p2c44bc00} id="Vector" stroke="var(--stroke-0, #111111)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[14.996px] relative shrink-0 w-[17.079px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[15px] left-[9px] not-italic text-[#111] text-[10px] text-center top-[0.59px] tracking-[-0.1px]">리뷰</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="flex-[1_0_0] h-[36.995px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-center justify-center relative size-full">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9997 19.9997">
        <g id="Icon">
          <path d={svgPaths.p1c92ae00} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d={svgPaths.p3117eb00} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M8.33319 7.49987H6.66655" id="Vector_3" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M13.3331 10.8331H6.66655" id="Vector_4" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M13.3331 14.1664H6.66655" id="Vector_5" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[14.996px] relative shrink-0 w-[17.079px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[15px] left-[9px] not-italic text-[#8a8a8a] text-[10px] text-center top-[0.59px] tracking-[-0.1px]">문자</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="flex-[1_0_0] h-[36.995px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-center justify-center relative size-full">
        <Icon2 />
        <Text1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9997 19.9997">
        <g id="Icon">
          <path d={svgPaths.p2a839e00} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d={svgPaths.p3d104f00} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[14.996px] relative shrink-0 w-[17.079px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[15px] left-[9px] not-italic text-[#8a8a8a] text-[10px] text-center top-[0.59px] tracking-[-0.1px]">이력</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="flex-[1_0_0] h-[36.995px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-center justify-center relative size-full">
        <Icon3 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9997 19.9997">
        <g id="Icon">
          <path d={svgPaths.p3c8a9c00} id="Vector" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d={svgPaths.p15122140} id="Vector_2" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d={svgPaths.p14151e00} id="Vector_3" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M8.33319 4.99991H11.6665" id="Vector_4" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M8.33319 8.33319H11.6665" id="Vector_5" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M8.33319 11.6665H11.6665" id="Vector_6" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
          <path d="M8.33319 14.9997H11.6665" id="Vector_7" stroke="var(--stroke-0, #8A8A8A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833319" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[14.996px] relative shrink-0 w-[17.079px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Pretendard:Medium',sans-serif] leading-[15px] left-[9px] not-italic text-[#8a8a8a] text-[10px] text-center top-[0.59px] tracking-[-0.1px]">병원</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="flex-[1_0_0] h-[36.995px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-center justify-center relative size-full">
        <Icon4 />
        <Text3 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-white content-stretch flex h-[52.995px] items-center justify-between left-0 pt-[0.531px] top-[798.91px] w-[393.022px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-black border-solid border-t-[0.531px] inset-0 pointer-events-none" />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

export default function AnalyzeClinoteApp() {
  return (
    <div className="bg-white relative size-full" data-name="Analyze Clinote App">
      <T />
      <Header />
      <Navigation />
    </div>
  );
}