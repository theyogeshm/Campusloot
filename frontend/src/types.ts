export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend: number;
  tags: string[];
  status?: string; // 'Active Now', '2 days left', 'High Demand', 'Top Choice'
  statusType?: 'active' | 'warning' | 'normal' | 'success'; 
  category: 'Engineering' | 'Design' | 'Finance' | 'AI & Research';
  image?: string;
  stipendText?: string;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  category: 'AI & ML' | 'Web3 & Decentralization' | 'Sustainability Tech' | 'General';
  status?: string; // 'Online', 'Online' with 'University Hub', 'Closing Soon', 'Top Tier'
  statusType?: 'highlight' | 'top-tier' | 'danger' | 'default';
  locationInfo?: string;
  image: string;
  totalPrize: number;
  deadline: string;
  participantsCount?: number;
  registeredCount?: number;
  roleType?: string; // e.g. 'Global Series'
  isPartner?: boolean;
  prizeText?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Coding Challenges' | 'Academic Quizzes' | 'Workshops' | 'Research Labs';
  level: 'Elite Level' | 'Medium Difficulty' | 'Introductory';
  status?: string; // 'Live Now', 'Posted 2h ago'
  statusType?: 'live' | 'recent';
  prizePool?: string;
  rewardText?: string;
  xpText?: string;
  iconName?: string;
  image?: string;
  spotsLeft?: number;
  isMystery?: boolean;
  quizId?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  description?: string;
  tags: string[];
  amount: number;
  category: 'STEM' | 'Liberal Arts' | 'International';
  status?: string;
  statusType?: 'danger' | 'normal';
  isFeatured?: boolean;
  image?: string;
  deadline?: string;
  locationInfo?: string;
  amountText?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}
