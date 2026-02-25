import svgPaths from "./svg-5o0wd2m79f";

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

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#fbe101] border-[0.16px] border-[rgba(0,0,0,0.1)] border-solid left-0 rounded-[3.2px] size-[16px] top-0" />
      <Group />
    </div>
  );
}