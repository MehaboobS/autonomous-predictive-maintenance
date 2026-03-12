const StepIndicator = ({ step }) => {

  const steps = ["User Info", "Vehicle Info", "Preferences"];

  return (
    <div className="flex gap-6 mb-10">
      {steps.map((label, index) => (
        <div
          key={index}
          className={`px-4 py-2 rounded-full
            ${step === index + 1
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-gray-400"
            }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;