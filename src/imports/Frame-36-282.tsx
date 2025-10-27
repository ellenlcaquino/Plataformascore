import svgPaths from "./svg-1pz65cfjs3";

function Group2() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 159 44">
        <g id="Group 2">
          <path d={svgPaths.p60a9f00} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p1456e3c0} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p75200} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p26b59b80} fill="var(--fill-0, black)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 121">
        <g id="Group 1">
          <path d={svgPaths.pad82e00} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p1ac0bc00} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p855ad70} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p244e4700} fill="var(--fill-0, black)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[35.36%_9.47%_32.65%_12.4%]" data-name="Group">
      <div className="absolute flex inset-[43.66%_9.47%_44.77%_43.37%] items-center justify-center">
        <div className="flex-none h-[43.599px] scale-y-[-100%] w-[158.449px]">
          <Group2 />
        </div>
      </div>
      <div className="absolute flex inset-[35.36%_57.91%_32.65%_12.4%] items-center justify-center">
        <div className="flex-none h-[120.612px] scale-y-[-100%] w-[99.75px]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full" data-name="Frame">
      <Group />
    </div>
  );
}