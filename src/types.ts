export type Category = 'TECH' | 'AI' | 'BUSINESS' | 'WORLD AFFAIRS';

export interface Episode {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  duration: string;
  date: string;
  thumbnail: string;
  videoUrl?: string;
  tags: string[];
  hook: string;
  whatHappened: string;
  whoBenefits: string;
  whyItMatters: string;
  views?: string;
  featured?: boolean;
}

export interface FoundingPassData {
  handle: string;
  division: 'TECH' | 'AI' | 'BUSINESS' | 'WORLD AFFAIRS';
  serialNumber: string;
  joinDate: string;
}
