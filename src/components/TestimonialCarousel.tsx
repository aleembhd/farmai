import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface TestimonialCarouselProps {
  testimonials: {
    title: string;
    john: Testimonial;
    maria: Testimonial;
    ahmed: Testimonial;
  };
}

const TestimonialCarousel = ({ testimonials }: TestimonialCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [testimonials.john, testimonials.maria, testimonials.ahmed];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{testimonials.title}</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-md p-6 md:p-8">
            {/* Quote icon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-green-500 rounded-full p-2">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-green-600" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-green-600" />
            </button>

            {/* Testimonial Content */}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-lg md:text-xl mb-6 italic">
                "{slides[currentSlide].quote}"
              </p>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-2xl font-semibold text-green-600">
                    {slides[currentSlide].name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{slides[currentSlide].name}</h3>
                <p className="text-gray-500 text-sm">{slides[currentSlide].role}</p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-green-600 w-6' 
                    : 'bg-green-200 hover:bg-green-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel; 