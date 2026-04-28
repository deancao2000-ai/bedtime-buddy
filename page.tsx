"use client";

import { useState } from "react";

type Reason = "scrolling" | "stressed" | "notSleepy" | "meTime";
type Trigger = "time" | "scrolling" | "stress" | "awake";
type PlanAction = "phoneAway" | "breath" | "brushTeeth" | "lightsLow";
type ReflectionStart = "yes" | "late" | "muchLater";
type MorningFeel = "energised" | "okay" | "tired";

type Step =
  | "landing"
  | "onboarding"
  | "setup"
  | "plan"
  | "reminder"
  | "checkin"
  | "action"
  | "summary"
  | "reflection";

type Copy = { en: string; zh: string };

const steps: Step[] = [
  "landing",
  "onboarding",
  "setup",
  "plan",
  "reminder",
  "checkin",
  "action",
  "summary",
  "reflection"
];

const flowSteps = steps.length - 1;

const reasonOptions: Array<{ value: Reason } & Copy> = [
  { value: "scrolling", en: "Still scrolling", zh: "还在刷手机" },
  { value: "stressed", en: "Feeling stressed", zh: "感到压力大" },
  { value: "notSleepy", en: "Not sleepy yet", zh: "还不困" },
  { value: "meTime", en: "Want some quiet me time", zh: "想保留一点自己的独处时间" }
];

const checkinOptions: Array<{ value: Reason } & Copy> = [
  { value: "scrolling", en: "Still scrolling", zh: "还在刷手机" },
  { value: "stressed", en: "Feeling stressed", zh: "感到压力大" },
  { value: "notSleepy", en: "Not sleepy yet", zh: "还不困" },
  { value: "meTime", en: "Want me time", zh: "想留一点自己的时间" }
];

const triggerOptions: Array<{ value: Trigger } & Copy> = [
  { value: "time", en: "It is bedtime", zh: "到了睡觉时间" },
  { value: "scrolling", en: "I am still scrolling", zh: "我还在刷手机" },
  { value: "stress", en: "My mind feels busy", zh: "脑子停不下来" },
  { value: "awake", en: "I am not sleepy yet", zh: "我还不困" }
];

const planActionOptions: Array<{ value: PlanAction } & Copy> = [
  { value: "phoneAway", en: "Put my phone away", zh: "把手机放下" },
  { value: "breath", en: "Take 3 slow breaths", zh: "做3次缓慢呼吸" },
  { value: "brushTeeth", en: "Brush my teeth", zh: "去刷牙" },
  { value: "lightsLow", en: "Dim the lights", zh: "把灯光调暗" }
];

const microActions: Record<Reason, Copy> = {
  scrolling: { en: "Put your phone away for 10 minutes.", zh: "先把手机放下10分钟。" },
  stressed: { en: "Take 3 slow breaths.", zh: "先做3次缓慢呼吸。" },
  notSleepy: { en: "Start winding down anyway.", zh: "先开始进入睡前流程。" },
  meTime: { en: "Take 10 minutes offline.", zh: "先离开信息流10分钟。" }
};

const reminderCopy: Record<Reason, Copy> = {
  scrolling: {
    en: "It is wind-down time. Put the phone down for 10 minutes and let the next step be easy.",
    zh: "到了放松时间。先把手机放下10分钟，让下一步变简单。"
  },
  stressed: {
    en: "You do not need to solve everything tonight. Start with 3 slow breaths.",
    zh: "今晚不需要解决所有事。先做3次缓慢呼吸。"
  },
  notSleepy: {
    en: "Sleepiness can arrive after the routine starts. Begin the wind-down anyway.",
    zh: "困意可能会在流程开始后出现。先开始睡前流程。"
  },
  meTime: {
    en: "Protect your me time without the feed. Take 10 quiet minutes offline.",
    zh: "保留独处时间，但先离开信息流。给自己10分钟安静时间。"
  }
};

const startOptions: Array<{ value: ReflectionStart } & Copy> = [
  { value: "yes", en: "Yes", zh: "有" },
  { value: "late", en: "A little late", zh: "晚了一点" },
  { value: "muchLater", en: "Much later", zh: "晚了很多" }
];

const feelOptions: Array<{ value: MorningFeel } & Copy> = [
  { value: "energised", en: "Energised", zh: "很有精神" },
  { value: "okay", en: "Okay", zh: "还可以" },
  { value: "tired", en: "Tired", zh: "很累" }
];

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [usualReason, setUsualReason] = useState<Reason | null>(null);
  const [checkinReason, setCheckinReason] = useState<Reason | null>(null);
  const [bedtime, setBedtime] = useState("23:30");
  const [windDown, setWindDown] = useState("23:00");
  const [planTrigger, setPlanTrigger] = useState<Trigger>("scrolling");
  const [planAction, setPlanAction] = useState<PlanAction>("phoneAway");
  const [started, setStarted] = useState<ReflectionStart | null>(null);
  const [feeling, setFeeling] = useState<MorningFeel | null>(null);

  const step = steps[stepIndex];
  const flowStep = Math.max(stepIndex, 1);
  const progress = step === "landing" ? 8 : (flowStep / flowSteps) * 100;

  const mainReason = usualReason ?? "scrolling";
  const activeReason = checkinReason ?? mainReason;
  const reasonLabel = reasonOptions.find((item) => item.value === mainReason) ?? reasonOptions[0];
  const checkinLabel = checkinOptions.find((item) => item.value === activeReason) ?? checkinOptions[0];
  const plan = buildPlan({ bedtime, trigger: planTrigger, action: planAction });
  const routine = buildRoutine({ bedtime, windDown });

  function next() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function restart() {
    setStepIndex(0);
    setUsualReason(null);
    setCheckinReason(null);
    setPlanTrigger("scrolling");
    setPlanAction("phoneAway");
    setStarted(null);
    setFeeling(null);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <section className="relative w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/78 shadow-soft backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-lavender-100 to-transparent" />
        <div className="relative flex min-h-[780px] flex-col px-5 pb-5 pt-6 sm:px-7">
          <ProgressBar progress={progress} step={step === "landing" ? 0 : flowStep} total={flowSteps} />

          <div className="mt-5 flex flex-1 flex-col">
            {step === "landing" && <Landing onStart={next} />}

            {step === "onboarding" && (
              <QuestionStep
                stepLabel="Step 1 of 8 / 第1步，共8步"
                title="What usually keeps you awake at night?"
                subtitle="通常是什么让你晚上还没睡？"
                microcopy="A useful plan starts with the real barrier, not a perfect intention."
                microcopyZh="有效计划从真实阻碍开始，而不是从完美愿望开始。"
                options={reasonOptions}
                selected={usualReason}
                onSelect={setUsualReason}
                onNext={next}
                nextDisabled={!usualReason}
              />
            )}

            {step === "setup" && (
              <SetupStep
                stepLabel="Step 2 of 8 / 第2步，共8步"
                bedtime={bedtime}
                windDown={windDown}
                routine={routine}
                setBedtime={setBedtime}
                setWindDown={setWindDown}
                onNext={next}
              />
            )}

            {step === "plan" && (
              <PlanStep
                stepLabel="Step 3 of 8 / 第3步，共8步"
                trigger={planTrigger}
                action={planAction}
                plan={plan}
                setTrigger={setPlanTrigger}
                setAction={setPlanAction}
                onNext={next}
              />
            )}

            {step === "reminder" && (
              <ReminderStep
                stepLabel="Step 4 of 8 / 第4步，共8步"
                reason={reasonLabel}
                reminder={reminderCopy[mainReason]}
                windDown={windDown}
                onNext={next}
              />
            )}

            {step === "checkin" && (
              <QuestionStep
                stepLabel="Step 5 of 8 / 第5步，共8步"
                title="Why are you still awake?"
                subtitle="你为什么现在还没睡？"
                microcopy="This check-in turns a vague reminder into a specific next move."
                microcopyZh="这个确认步骤会把模糊提醒变成具体行动。"
                options={checkinOptions}
                selected={checkinReason}
                onSelect={setCheckinReason}
                onNext={next}
                nextDisabled={!checkinReason}
              />
            )}

            {step === "action" && (
              <ActionStep
                stepLabel="Step 6 of 8 / 第6步，共8步"
                action={microActions[activeReason]}
                reason={checkinLabel}
                onNext={next}
              />
            )}

            {step === "summary" && (
              <SummaryStep
                stepLabel="Step 7 of 8 / 第7步，共8步"
                bedtime={bedtime}
                reason={reasonLabel}
                plan={plan}
                action={microActions[activeReason]}
                routine={routine}
                onNext={next}
              />
            )}

            {step === "reflection" && (
              <ReflectionStep
                stepLabel="Step 8 of 8 / 第8步，共8步"
                started={started}
                feeling={feeling}
                setStarted={setStarted}
                setFeeling={setFeeling}
                onRestart={restart}
              />
            )}
          </div>

          {step !== "landing" && (
            <div className="relative mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={back}
                className="rounded-full px-4 py-3 text-sm font-semibold text-plum transition hover:bg-lavender-100"
              >
                Back / 返回
              </button>
              <p className="text-xs font-medium text-plum/60">No login · React state only</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProgressBar({ progress, step, total }: { progress: number; step: number; total: number }) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-plum/60">
        <span>Bedtime Buddy</span>
        <span>{step === 0 ? "Ready / 准备开始" : `Step ${step} of ${total} / 第${step}步，共${total}步`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-lavender-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lavender-400 via-lavender-500 to-petal transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-lavender-100 shadow-glow">
        <span className="text-4xl">☾</span>
      </div>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-lavender-600">mobile bedtime flow</p>
      <h1 className="text-5xl font-black leading-[0.95] text-dusk">Bedtime Buddy</h1>
      <div className="mt-5 space-y-1 text-2xl font-bold text-plum">
        <p>More than a reminder</p>
        <p>不仅仅是提醒</p>
      </div>
      <div className="mt-6 rounded-3xl bg-mist p-5 text-base leading-7 text-plum shadow-inner">
        <p>Bedtime Buddy helps students turn bedtime intentions into real action.</p>
        <p className="mt-2">Bedtime Buddy 帮助学生把‘想早点睡’变成真正的行动。</p>
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-lavender-100 bg-white/88 p-4 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-lavender-600">Why it works / 为什么更有效</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ComparisonCard
            title="General reminder"
            zh="普通提醒"
            items={["Says what to do", "Easy to dismiss", "No next step"]}
            zhItems={["只告诉你要做什么", "很容易忽略", "没有下一步"]}
          />
          <ComparisonCard
            title="Bedtime Buddy"
            zh="睡前伙伴"
            items={["Finds the barrier", "Builds an if-then plan", "Starts one tiny action"]}
            zhItems={["找到真实阻碍", "建立如果-那么计划", "先开始一个小动作"]}
            active
          />
        </div>
      </div>

      <PrimaryButton onClick={onStart} className="mt-auto">
        Start / 开始
      </PrimaryButton>
    </div>
  );
}

function ComparisonCard({
  title,
  zh,
  items,
  zhItems,
  active = false
}: {
  title: string;
  zh: string;
  items: string[];
  zhItems: string[];
  active?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-3 ${active ? "bg-lavender-100 text-dusk" : "bg-mist text-plum"}`}>
      <p className="text-sm font-black leading-tight">{title}</p>
      <p className="mt-1 text-xs font-bold">{zh}</p>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <p key={item} className="text-xs font-semibold leading-4">
            {item}
            <span className="block opacity-75">{zhItems[index]}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function QuestionStep<T extends string>({
  stepLabel,
  title,
  subtitle,
  microcopy,
  microcopyZh,
  options,
  selected,
  onSelect,
  onNext,
  nextDisabled
}: {
  stepLabel: string;
  title: string;
  subtitle: string;
  microcopy: string;
  microcopyZh: string;
  options: Array<{ value: T } & Copy>;
  selected: T | null;
  onSelect: (value: T) => void;
  onNext: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title={title} subtitle={subtitle} />
      <Microcopy en={microcopy} zh={microcopyZh} />
      <div className="mt-5 grid gap-3">
        {options.map((option) => (
          <OptionButton key={option.value} active={selected === option.value} onClick={() => onSelect(option.value)} en={option.en} zh={option.zh} />
        ))}
      </div>
      <PrimaryButton onClick={onNext} disabled={nextDisabled} className="mt-auto">
        Continue / 继续
      </PrimaryButton>
    </div>
  );
}

function SetupStep({
  stepLabel,
  bedtime,
  windDown,
  routine,
  setBedtime,
  setWindDown,
  onNext
}: {
  stepLabel: string;
  bedtime: string;
  windDown: string;
  routine: RoutineItem[];
  setBedtime: (value: string) => void;
  setWindDown: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="Set tonight's routine" subtitle="设置今晚的睡前节奏" />
      <Microcopy
        en="A good night starts with a visible routine. Perfect sleep is not the goal; starting the wind-down is."
        zh="好的夜晚从看得见的流程开始。目标不是完美睡眠，而是开始放松流程。"
      />
      <div className="mt-5 space-y-4">
        <TimeField label="Target bedtime" zh="目标睡觉时间" value={bedtime} onChange={setBedtime} />
        <TimeField label="Wind-down time" zh="开始放松时间" value={windDown} onChange={setWindDown} />
      </div>
      <RoutineCard routine={routine} />
      <PrimaryButton onClick={onNext} className="mt-auto">
        Continue / 继续
      </PrimaryButton>
    </div>
  );
}

function PlanStep({
  stepLabel,
  trigger,
  action,
  plan,
  setTrigger,
  setAction,
  onNext
}: {
  stepLabel: string;
  trigger: Trigger;
  action: PlanAction;
  plan: Copy;
  setTrigger: (value: Trigger) => void;
  setAction: (value: PlanAction) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="Build your bedtime plan" subtitle="建立你的睡前计划" />
      <Microcopy
        en="If-then plans work because they connect a real moment with one clear action."
        zh="如果-那么计划有效，是因为它把真实情境和一个清楚动作连在一起。"
      />

      <ChipGroup title="Choose a trigger / 选择触发情境">
        {triggerOptions.map((item) => (
          <Chip key={item.value} active={trigger === item.value} onClick={() => setTrigger(item.value)} en={item.en} zh={item.zh} />
        ))}
      </ChipGroup>

      <ChipGroup title="Choose one small action / 选择一个小动作">
        {planActionOptions.map((item) => (
          <Chip key={item.value} active={action === item.value} onClick={() => setAction(item.value)} en={item.en} zh={item.zh} />
        ))}
      </ChipGroup>

      <PlanCard plan={plan} />
      <PrimaryButton onClick={onNext} className="mt-auto">
        Continue / 继续
      </PrimaryButton>
    </div>
  );
}

function ReminderStep({
  stepLabel,
  reason,
  reminder,
  windDown,
  onNext
}: {
  stepLabel: string;
  reason: Copy;
  reminder: Copy;
  windDown: string;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="Reminder preview" subtitle="提醒预览" />
      <Microcopy
        en="This is more than a ping. The message names your barrier and gives you a first move."
        zh="这不只是响一下。提醒会说出你的阻碍，并给出第一步。"
      />
      <div className="mt-6 rounded-[1.75rem] border border-lavender-100 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-600">Tonight {formatTime(windDown)}</p>
            <p className="mt-1 text-sm font-bold text-plum">今晚 {formatTime(windDown)}</p>
          </div>
          <span className="rounded-full bg-lavender-100 px-3 py-2 text-xs font-black text-lavender-700">Preview</span>
        </div>
        <div className="mt-5 rounded-3xl bg-mist p-4">
          <p className="text-sm font-bold text-plum">Barrier / 阻碍</p>
          <p className="mt-1 font-black text-dusk">
            {reason.en} / {reason.zh}
          </p>
        </div>
        <p className="mt-5 text-xl font-black leading-8 text-dusk">{reminder.en}</p>
        <p className="mt-3 text-lg font-bold leading-8 text-plum">{reminder.zh}</p>
      </div>
      <PrimaryButton onClick={onNext} className="mt-auto">
        Continue / 继续
      </PrimaryButton>
    </div>
  );
}

function ActionStep({
  stepLabel,
  action,
  reason,
  onNext
}: {
  stepLabel: string;
  action: Copy;
  reason: Copy;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="One small action now" subtitle="现在只做一个小动作" />
      <Microcopy
        en="One small action is easier to start than a general reminder, especially when you are tired."
        zh="特别是累的时候，一个小动作比笼统提醒更容易开始。"
      />
      <div className="mt-5 rounded-[1.75rem] bg-dusk p-6 text-white shadow-glow">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-lavender-200">Because / 因为</p>
        <p className="mt-2 text-lg font-bold">
          {reason.en} / {reason.zh}
        </p>
        <div className="my-6 h-px bg-white/20" />
        <p className="text-3xl font-black leading-tight">{action.en}</p>
        <p className="mt-4 text-2xl font-bold leading-tight text-lavender-100">{action.zh}</p>
      </div>
      <div className="mt-5 rounded-3xl bg-petal p-5 text-center text-xl font-black leading-8 text-dusk">
        <p>You started. That counts.</p>
        <p>你已经开始了，这就很重要。</p>
      </div>
      <PrimaryButton onClick={onNext} className="mt-auto">
        Continue / 继续
      </PrimaryButton>
    </div>
  );
}

function SummaryStep({
  stepLabel,
  bedtime,
  reason,
  plan,
  action,
  routine,
  onNext
}: {
  stepLabel: string;
  bedtime: string;
  reason: Copy;
  plan: Copy;
  action: Copy;
  routine: RoutineItem[];
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="Tonight's summary" subtitle="今晚总结" />
      <Microcopy
        en="A realistic bedtime intervention remembers the plan, the barrier, and the first action."
        zh="现实可用的睡前干预，会记住计划、阻碍和第一步。"
      />
      <div className="mt-5 space-y-3">
        <SummaryRow label="Bedtime" zh="目标睡觉时间" value={formatTime(bedtime)} />
        <SummaryRow label="Main obstacle" zh="主要阻碍" value={`${reason.en} / ${reason.zh}`} />
        <div className="rounded-3xl bg-white/88 p-4 shadow-sm">
          <p className="text-sm font-bold text-plum">If-then plan / 如果-那么计划</p>
          <p className="mt-2 text-base font-black leading-6 text-dusk">{plan.en}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-plum">{plan.zh}</p>
        </div>
        <SummaryRow label="First small action" zh="第一个小动作" value={`${action.en} / ${action.zh}`} />
      </div>
      <RoutineCard routine={routine} compact />
      <PrimaryButton onClick={onNext} className="mt-auto">
        Morning Reflection / 早晨回顾
      </PrimaryButton>
    </div>
  );
}

function ReflectionStep({
  stepLabel,
  started,
  feeling,
  setStarted,
  setFeeling,
  onRestart
}: {
  stepLabel: string;
  started: ReflectionStart | null;
  feeling: MorningFeel | null;
  setStarted: (value: ReflectionStart) => void;
  setFeeling: (value: MorningFeel) => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col py-4">
      <StepHeader stepLabel={stepLabel} title="Morning reflection" subtitle="早晨回顾" />
      <Microcopy
        en="A good night does not require perfect sleep. Notice whether you started the routine and how your morning feels."
        zh="好的夜晚不等于完美睡眠。先观察你是否开始了流程，以及早上的感受。"
      />
      <div className="mt-5">
        <QuestionBlock title="Did you start winding down on time?" subtitle="你昨晚有按时开始睡前流程吗？">
          {startOptions.map((option) => (
            <OptionButton key={option.value} active={started === option.value} onClick={() => setStarted(option.value)} en={option.en} zh={option.zh} compact />
          ))}
        </QuestionBlock>
        <QuestionBlock title="How do you feel this morning?" subtitle="你今天早上感觉怎么样？">
          {feelOptions.map((option) => (
            <OptionButton key={option.value} active={feeling === option.value} onClick={() => setFeeling(option.value)} en={option.en} zh={option.zh} compact />
          ))}
        </QuestionBlock>
      </div>
      <div className="mt-auto rounded-3xl bg-mist p-5 text-center text-sm leading-6 text-plum">
        <p className="font-bold text-dusk">Small feedback loop / 小小反馈循环</p>
        <p className="mt-1">The app helps students notice what happened, not judge themselves.</p>
        <p>这个工具帮助学生观察发生了什么，而不是责备自己。</p>
      </div>
      <PrimaryButton onClick={onRestart} disabled={!started || !feeling} className="mt-4">
        Restart Demo / 重新演示
      </PrimaryButton>
    </div>
  );
}

function StepHeader({ stepLabel, title, subtitle }: { stepLabel: string; title: string; subtitle: string }) {
  return (
    <header>
      <p className="text-sm font-bold text-lavender-600">{stepLabel}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-dusk">{title}</h2>
      <p className="mt-2 text-2xl font-bold leading-tight text-plum">{subtitle}</p>
    </header>
  );
}

function Microcopy({ en, zh }: Copy) {
  return (
    <div className="mt-4 rounded-3xl bg-sage/70 p-4 text-sm font-semibold leading-6 text-dusk">
      <p>{en}</p>
      <p className="mt-1 text-plum">{zh}</p>
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  en,
  zh,
  compact = false
}: {
  active: boolean;
  onClick: () => void;
  en: string;
  zh: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left shadow-sm transition ${
        active
          ? "border-lavender-500 bg-lavender-100 text-dusk shadow-glow"
          : "border-lavender-100 bg-white/82 text-plum hover:border-lavender-300 hover:bg-white"
      } ${compact ? "py-3" : ""}`}
    >
      <span className="block text-base font-black">{en}</span>
      <span className="mt-1 block text-sm font-semibold opacity-80">{zh}</span>
    </button>
  );
}

function ChipGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <p className="mb-3 text-sm font-black text-plum">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Chip({ active, onClick, en, zh }: { active: boolean; onClick: () => void; en: string; zh: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-3 text-left text-sm font-bold leading-5 transition ${
        active
          ? "border-lavender-500 bg-lavender-600 text-white shadow-glow"
          : "border-lavender-100 bg-white/88 text-plum hover:border-lavender-300"
      }`}
    >
      {en}
      <span className="block text-xs opacity-80">{zh}</span>
    </button>
  );
}

function TimeField({
  label,
  zh,
  value,
  onChange
}: {
  label: string;
  zh: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[1.75rem] border border-lavender-100 bg-white/86 p-5 shadow-sm">
      <span className="block text-sm font-bold text-plum">
        {label} / {zh}
      </span>
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-lavender-100 bg-lavender-50 px-4 py-4 text-3xl font-black text-dusk outline-none transition focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100"
      />
    </label>
  );
}

function PlanCard({ plan }: { plan: Copy }) {
  return (
    <div className="mt-5 rounded-[1.75rem] border border-lavender-100 bg-white p-5 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-lavender-600">Generated plan / 生成计划</p>
      <p className="mt-4 text-xl font-black leading-8 text-dusk">{plan.en}</p>
      <p className="mt-4 text-lg font-bold leading-8 text-plum">{plan.zh}</p>
    </div>
  );
}

type RoutineItem = {
  time: string;
  en: string;
  zh: string;
};

function RoutineCard({ routine, compact = false }: { routine: RoutineItem[]; compact?: boolean }) {
  return (
    <div className={`mt-5 rounded-[1.75rem] bg-white/88 p-5 shadow-sm ${compact ? "p-4" : ""}`}>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-lavender-600">Tonight's Routine / 今晚流程</p>
      <div className="mt-4 space-y-3">
        {routine.map((item) => (
          <div key={`${item.time}-${item.en}`} className="flex items-start gap-3">
            <span className="w-20 shrink-0 rounded-full bg-lavender-100 px-3 py-2 text-center text-xs font-black text-lavender-700">{item.time}</span>
            <p className="text-sm font-bold leading-5 text-dusk">
              {item.en}
              <span className="block text-plum">{item.zh}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionBlock({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-[1.75rem] bg-white/84 p-4 shadow-sm">
      <h3 className="text-lg font-black text-dusk">{title}</h3>
      <p className="mt-1 text-base font-bold text-plum">{subtitle}</p>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function SummaryRow({ label, zh, value }: { label: string; zh: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/88 p-4 shadow-sm">
      <p className="text-sm font-bold text-plum">
        {label} / {zh}
      </p>
      <p className="mt-2 text-base font-black leading-6 text-dusk">{value}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-6 py-4 text-base font-bold text-white shadow-glow transition ${
        disabled ? "cursor-not-allowed bg-plum/30 shadow-none" : "bg-lavender-600 hover:-translate-y-0.5 hover:bg-lavender-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function buildPlan({ bedtime, trigger, action }: { bedtime: string; trigger: Trigger; action: PlanAction }): Copy {
  const time = formatTime(bedtime);
  const triggerCopy: Record<Trigger, Copy> = {
    time: { en: `it is ${time}`, zh: `到了${time}` },
    scrolling: { en: "I am still scrolling", zh: "我还在刷手机" },
    stress: { en: "my mind feels busy", zh: "脑子停不下来" },
    awake: { en: "I am not sleepy yet", zh: "我还不困" }
  };
  const actionCopy: Record<PlanAction, Copy> = {
    phoneAway: { en: "put my phone away for 10 minutes", zh: "把手机放下10分钟" },
    breath: { en: "take 3 slow breaths", zh: "做3次缓慢呼吸" },
    brushTeeth: { en: "brush my teeth", zh: "去刷牙" },
    lightsLow: { en: "dim the lights and sit quietly", zh: "把灯光调暗并安静坐一会儿" }
  };

  return {
    en: `If ${triggerCopy[trigger].en}, then I will ${actionCopy[action].en}.`,
    zh: `如果${triggerCopy[trigger].zh}，那么我就${actionCopy[action].zh}。`
  };
}

function buildRoutine({ bedtime, windDown }: { bedtime: string; windDown: string }): RoutineItem[] {
  return [
    { time: formatTime(windDown), en: "Start wind-down", zh: "开始放松" },
    { time: formatTime(addMinutes(bedtime, -10)), en: "Put phone away", zh: "放下手机" },
    { time: formatTime(addMinutes(bedtime, -5)), en: "Brush teeth", zh: "刷牙" },
    { time: formatTime(bedtime), en: "In bed", zh: "上床" }
  ];
}

function addMinutes(value: string, minutesToAdd: number) {
  const [hours, minutes] = value.split(":").map(Number);
  const total = (hours * 60 + minutes + minutesToAdd + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}
