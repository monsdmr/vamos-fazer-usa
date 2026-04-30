import { Check } from "lucide-react";

interface UpsellProgressProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { num: 1, label: "Order" },
  { num: 2, label: "Acceleration" },
  { num: 3, label: "Hidden System" },
];

export function UpsellProgress({ currentStep }: UpsellProgressProps) {
  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pt-4 sm:px-4 sm:pt-6">
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 gap-2">
        <span className="truncate">Step {currentStep} of {STEPS.length}</span>
        <span className="text-emerald-600 shrink-0">{Math.round(pct)}% complete</span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-200 rounded-full" />
        {/* Filled */}
        <div
          className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />

        <div className="relative flex items-center justify-between">
          {STEPS.map((s) => {
            const done = s.num < currentStep;
            const active = s.num === currentStep;
            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all",
                    done
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : active
                      ? "bg-white border-emerald-600 text-emerald-700 ring-4 ring-emerald-100 scale-110"
                      : "bg-white border-slate-300 text-slate-400",
                  ].join(" ")}
                  style={active ? { animation: "stepPulse 1.8s ease-in-out infinite" } : undefined}
                >
                  {done ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={[
                    "text-[10px] sm:text-xs font-semibold",
                    active ? "text-slate-900" : done ? "text-emerald-700" : "text-slate-400",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  );
}
