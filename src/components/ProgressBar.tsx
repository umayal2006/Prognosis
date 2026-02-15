interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const ProgressBar = ({ currentStep, totalSteps, labels }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {labels?.[currentStep] && (
          <span className="text-foreground font-semibold">{labels[currentStep]}</span>
        )}
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
