export type Language = 'english' | 'hindi' | 'telugu';

export interface TranslationStrings {
  nav: {
    features: string;
    about: string;
    contact: string;
    how_it_works: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: {
      start: string;
      learn: string;
    };
  };
  features: {
    title: string;
    cropSelection: {
      title: string;
      description: string;
    };
    fertilizerAdvice: {
      title: string;
      description: string;
    };
    diseasePrediction: {
      title: string;
      description: string;
    };
  };
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    john: {
      name: string;
      role: string;
      quote: string;
    };
    maria: {
      name: string;
      role: string;
      quote: string;
    };
    ahmed: {
      name: string;
      role: string;
      quote: string;
    };
  };
  footer: {
    copyright: string;
    terms: string;
    privacy: string;
  };
  selectLanguage: string;
  about: {
    title: string;
    mission: {
      title: string;
      description: string;
    };
    whyChooseUs: {
      title: string;
      description: string;
    };
    approach: {
      title: string;
      description: string;
    };
  };
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      placeholder: {
        name: string;
        email: string;
        message: string;
      };
      submit: string;
    };
    connect: {
      title: string;
      description: string;
    };
    office: {
      title: string;
      address: string[];
    };
    info: {
      title: string;
      email: string;
      phone: string;
      hours: string;
    };
  };
  faq: {
    title: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export type Translations = {
  [key in Language]: TranslationStrings;
};