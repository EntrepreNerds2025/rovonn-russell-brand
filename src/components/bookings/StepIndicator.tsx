import { CheckCircle2 } from "lucide-react";

type StepIndicatorProps = {
  steps: readonly string[];
  currentStep: number;
};

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => (
  <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2">
    {steps.map((label, i) => {
      const num = i + 1;
      const isDone = num < currentStep;
      const isActive = num === currentStep;
      return (
        <div key={label} className="flex items-center gap-2 md:gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs md:text-sm transition-colors ${
              isActive
                ? "border-accent-deep bg-accent/10 text-accent-deep font-semibold"
                : isDone
                  ? "border-accent-deep/40 text-accent-deep"
                  : "border-border text-muted-foreground"
            }`}
          >
            {isDone ? (
              <CheckCircle2 size={14} />
            ) : (
              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-current text-[10px] font-bold">{num}</span>
            )}
            <span>{label}</span>
          </div>
          {i < steps.length - 1 && <span className="text-muted-foreground/50">→</span>}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
