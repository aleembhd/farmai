import { Upload, Brain, LineChart } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

interface HowItWorksProps {
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
}

const Step = ({ icon, title, description, step }: StepProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks = ({ howItWorks }: HowItWorksProps) => {
  const steps = [
    { icon: <Upload className="w-8 h-8 text-green-600" />, ...howItWorks.steps[0] },
    { icon: <Brain className="w-8 h-8 text-green-600" />, ...howItWorks.steps[1] },
    { icon: <LineChart className="w-8 h-8 text-green-600" />, ...howItWorks.steps[2] }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{howItWorks.title}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 