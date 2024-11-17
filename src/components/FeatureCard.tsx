import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  buttonColor: string;
  onClick: () => void;
}

const FeatureCard = ({ Icon, title, description, iconColor, buttonColor, onClick }: FeatureCardProps) => {
  return (
    <div className="w-full text-left bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <Icon className={`h-12 w-12 ${iconColor} mb-4`} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-white font-medium 
                   transition-all duration-300 transform hover:scale-105 ${buttonColor}`}
      >
        <span>Access Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FeatureCard;