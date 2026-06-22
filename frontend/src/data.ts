import { Internship, Hackathon, Activity, Scholarship, QuizQuestion } from './types';

export const INTERNSHIPS: Internship[] = [
  {
    id: 'int-1',
    title: 'Software Engineering Intern',
    company: 'Quantum Systems',
    location: 'Zurich, CH',
    stipend: 7500,
    tags: ['C++', 'CUDA', 'Remote'],
    status: 'Active Now',
    statusType: 'success',
    category: 'Engineering'
  },
  {
    id: 'int-2',
    title: 'Visual Design Lead (Intern)',
    company: 'Aura Creative',
    location: 'Tokyo, JP',
    stipend: 5200,
    tags: ['Figma', 'Cinema 4D', 'Relocation'],
    status: '2 days left',
    statusType: 'warning',
    category: 'Design'
  },
  {
    id: 'int-3',
    title: 'Quantitative Analyst',
    company: 'Apex Capital',
    location: 'New York, US',
    stipend: 12000,
    tags: ['Python', 'Math', 'Hybrid'],
    status: 'High Demand',
    statusType: 'active',
    category: 'Finance'
  },
  {
    id: 'int-4',
    title: 'Hardware Engineering',
    company: 'Silicon Labs',
    location: 'Austin, US',
    stipend: 6800,
    tags: ['Verilog', 'VLSI'],
    category: 'Engineering'
  },
  {
    id: 'int-5',
    title: 'DevOps Specialist',
    company: 'CloudPath Solutions',
    location: 'Berlin, DE',
    stipend: 5800,
    tags: ['AWS', 'Kubernetes'],
    category: 'Engineering'
  },
  {
    id: 'int-6',
    title: 'Aerospace Simulation',
    company: 'OrbitX',
    location: 'Seattle, US',
    stipend: 8200,
    tags: ['C++', 'Physics'],
    status: 'Top Choice',
    statusType: 'success',
    category: 'AI & Research'
  },
  {
    id: 'int-7',
    title: 'Research Intern, Generative AI',
    company: 'Anthropic Labs',
    location: 'San Francisco, US',
    stipend: 11000,
    tags: ['PyTorch', 'Transformers', 'Hybrid'],
    status: 'Top Choice',
    statusType: 'success',
    category: 'AI & Research'
  },
  {
    id: 'int-8',
    title: 'Risk Modeling Associate',
    company: 'Citadel Group',
    location: 'Chicago, US',
    stipend: 11500,
    tags: ['Stochastic', 'C++', 'SQL'],
    status: 'High Demand',
    statusType: 'active',
    category: 'Finance'
  },
  {
    id: 'int-9',
    title: 'Brand Designer',
    company: 'Linear Corp',
    location: 'Remote',
    stipend: 6000,
    tags: ['UI/UX', 'Vector Art', 'Styleguides'],
    category: 'Design'
  }
];

export const HACKATHONS: Hackathon[] = [
  {
    id: 'hack-1',
    title: 'NeoGenesis: The AI Revolution',
    description: 'Build the next generation of autonomous agents. Partnered with OpenAI and Anthropic to provide $50k in API credits and direct recruitment paths.',
    category: 'AI & ML',
    status: 'Online',
    statusType: 'highlight',
    locationInfo: 'Online',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpZG059bww3xEY4mvmzqWd9mhiDFIj2BdhbFncO21xlx73vynLza95BbqDVg8EfiaTNgikWseX2psOomEQQ4pGfAi2xzB2oM2HaJQHhc4rx-oLe7KkU3IFxbZ6gU6Aau17TPDMYB17kX4UYo1si6g2OhH4yPnowho5Y0rLUmAcmdjqHHlsONaBGYB8lQ3sEU6fcf3SAyTFnkUCYBeEhdAlBhPe_kQHjCbened5K25DfKFlKt1nZAE2zg5ZnztjAdd6Yhf6ec08YsRQ',
    totalPrize: 250000,
    deadline: 'Oct 14, 2024',
    participantsCount: 1540,
    roleType: 'Global Series'
  },
  {
    id: 'hack-2',
    title: 'CloudScale InfraHack',
    description: 'Optimize edge computing clusters for low-latency financial transactions. 48-hour physical sprint.',
    category: 'Web3 & Decentralization',
    status: 'Top Tier',
    statusType: 'top-tier',
    locationInfo: 'San Francisco',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjFjnhysF0749BGnqrdjM4kxqzkE0qAjmasRW8K9G3OBRe4F1TkcKR6KrKJLy0EBGv5x4XJEJrElNdgVAiBR_7QwfGf5xlMCfMIgSjpDLU6G6PDOQcNglNt-CO93i8EHBM1w2cbaKfV82NtF30bPBgr3c8Ue7R-B9h8rQS3RuCV0csT4rARdW4EHFsWjqfdZc4yGFEho8en3AYb0WhjShZK3dgfKunv6LqA74LCaIkgZvw6vTueHPRHSl7VOjT9mBWJRF4pnadNTTR',
    totalPrize: 45000,
    deadline: 'Sep 28, 2024',
    participantsCount: 240
  },
  {
    id: 'hack-3',
    title: 'DataNexus 2024',
    description: 'Solve real-world predictive analytics challenges for global logistics firms.',
    category: 'AI & ML',
    status: 'Online',
    statusType: 'highlight',
    locationInfo: 'Online',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRP8wO7oAtaTwEHkJRuswk0wqiMhXTgmFEoSBL3bpGLmK0Wx3iM9S-Qji0bbn3Si9-X-YlZIZ3OI_LNZMkAXhutnTVdZkbmUIxqVMcO3HBZZgCXwEH15sKYGYfL9wWV9bf80TtPUGVbMBMXdj1CPRlS09E8WvvrL91hORZuWgBq1JDj-udQ8w10bmJYBeVeq9ntnJ2ngIRZockuH9jKNE3LJ2KospIE7EoLPTlXraGE2x1Xz-WDez4krdrOVcRW6EFWRWO00aLO6Ep',
    totalPrize: 12000,
    deadline: 'Nov 05, 2024',
    participantsCount: 800,
    roleType: 'University Hub'
  },
  {
    id: 'hack-4',
    title: 'CyberGuard Security',
    description: 'Capture the flag (CTF) tournament focused on zero-day vulnerability research.',
    category: 'Web3 & Decentralization',
    status: 'Closing Soon',
    statusType: 'danger',
    locationInfo: 'Austin, TX',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa7sl1GhUOUwVGz-qqn-EDkrZuF34jVSaEZo5uZVwzXD29fOnfiiHh5qoUdThegWL-S1i5wPyHHxSBPkbpffbPVbinixX83MNzQZEDZipIQZ7WtFRml0oKrAds2Owu3MqOpdwhYpSy-2e_aRd6ngMOchj0uLR9MRh8JRaw25L1Yw1809xacqw_eCOovya85HMqdkIf_qIVDEMWudTE9Vc2ZH6V84KzwmOeSN6Dtkcea-DY9zM-7An_P48aICCsmTdCKsGPN-zDcXxa',
    totalPrize: 20000,
    deadline: 'Ends in 2h',
    participantsCount: 382
  },
  {
    id: 'hack-5',
    title: 'Metaverse Builders: XR Summit',
    description: 'Design immersive education experiences for the next billion users. Exclusive mentorship from Meta Reality Labs.',
    category: 'Sustainability Tech',
    status: 'Top Tier',
    statusType: 'top-tier',
    locationInfo: 'Global Grand Prize',
    image: '',
    totalPrize: 100000,
    deadline: 'Nov 20, 2024',
    participantsCount: 50,
    isPartner: true
  },
  {
    id: 'hack-6',
    title: 'EcoGrid Hackathon',
    description: 'Devise software architectures for smarter power grid balancing. Sponsored by Tesla Energy.',
    category: 'Sustainability Tech',
    status: 'Online',
    statusType: 'highlight',
    locationInfo: 'Online',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa7sl1GhUOUwVGz-qqn-EDkrZuF34jVSaEZo5uZVwzXD29fOnfiiHh5qoUdThegWL-S1i5wPyHHxSBPkbpffbPVbinixX83MNzQZEDZipIQZ7WtFRml0oKrAds2Owu3MqOpdwhYpSy-2e_aRd6ngMOchj0uLR9MRh8JRaw25L1Yw1809xacqw_eCOovya85HMqdkIf_qIVDEMWudTE9Vc2ZH6V84KzwmOeSN6Dtkcea-DY9zM-7An_P48aICCsmTdCKsGPN-zDcXxa',
    totalPrize: 35000,
    deadline: 'Dec 12, 2024',
    participantsCount: 420
  }
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Advanced Quantum Algorithm Optimization Challenge',
    description: 'Optimize high-depth circuits on simulated noisy qubits. Handle multi-phase entanglements efficiently.',
    category: 'Coding Challenges',
    level: 'Elite Level',
    status: 'Live Now',
    statusType: 'live',
    prizePool: '2,500 Prize Pool',
    xpText: '1,200 XP',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcDPuj0Cu0a-OrZoOPunmTrzl6TzSxnGRwVKEuVGepwzQZLFHxfwJt9gY3KMaz4PkPCxFINdkmCvn51yHPAR5-dE3duIOIUVOulZPXEOwv0br7onflNo9_hQvZawu0DJkZRfuaRMMSfwhk_yRIcITHdasVD7B2DKgb_zHB9EKaZ3GNhDiUqpH20zB5LHMKycHwkmv059ydH9A6qgH8AhXU9TQza8GT-jw987LPKtZpOX3sTNJKlTYFQxTcKt9y0LLpEb4Owb2qSGxh',
    rewardText: 'NFT Certificate Included'
  },
  {
    id: 'act-2',
    title: 'Neural Networks Fundamentals',
    description: 'Master the architecture of modern AI. 25 precision questions addressing SGD, activation layers, and backpropagation.',
    category: 'Academic Quizzes',
    level: 'Introductory',
    status: 'Live Now',
    statusType: 'live',
    rewardText: '500 Loot Credits',
    xpText: '250 XP',
    iconName: 'psychology',
    quizId: 'quiz-nn'
  },
  {
    id: 'act-3',
    title: 'Bio-Digital Architecture',
    description: 'Interactive session with Dr. Aris Thorne on regenerative computing grids and self-repairing databases.',
    category: 'Workshops',
    level: 'Medium Difficulty',
    status: 'Live Now',
    statusType: 'live',
    rewardText: 'Join Waiting List',
    xpText: '400 XP',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR_grH21s6CiufZcJfU1fKdLgrnwj13_akx9AuYiqier7cLsZp2F8pWRLA7dMSQFi_YO-NI-a2I1f5Q9Tvpm-VatLtAeueoNhJt0uXj75azL14ugxPG2tbRYd5jwvOyOPq2GkXbs5FxE3YmeaH12ODHMo6xIWCMe56bpVlE3iYBA3mZTHXWie0NMQeEm-4ksxG4WWfBXkvle9C14Am0OlvMx0441mb5M8ot2p6fhlFmYP9Pl69eWn9iAFOdswK2TNMWut7FOy4U8HM',
    spotsLeft: 42
  },
  {
    id: 'act-4',
    title: 'Mystery Challenge',
    description: 'Complete 3 Quizzes to unlock this restricted activity and achieve high prestige.',
    category: 'Research Labs',
    level: 'Elite Level',
    isMystery: true
  },
  {
    id: 'act-5',
    title: 'Recursive Tree Data Visualizer',
    description: 'Implement an efficient D3.js based tree structure that can handle 10k+ nodes with smooth transitions. Optimized for WebGL rendering.',
    category: 'Coding Challenges',
    level: 'Medium Difficulty',
    status: 'Posted 2h ago',
    statusType: 'recent',
    xpText: '800 Loot Pts',
    rewardText: 'Verified Badge'
  }
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-1',
    title: 'Global Quantum Research Fellowship',
    provider: 'Lumina Tech Foundation',
    tags: ['POST-GRADUATE', 'STEM ONLY', 'REMOTE OK'],
    amount: 85000,
    category: 'STEM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt-7Ul9EcoKzLr4sECDA6_bcr8AH33vUnnqakYdi0yQnh2MXSt_zf9gVNkTRp0qhpWOHITxzfBVJAnZVgdmDer7eZzBFcAgA4v8WZWhh3-Mb1nSL-wKDSaVfru3Lf7H-ZXcUr3TRQ8k9_O9jk_8iXT5JH_dlye5ZeKugpdbXQnBEnWSaMbjoI6Q033xpsV38oEw4tnjzk9Weq8rEOzaHIkmodG6Pvdamc1bjUG-B9qRzan07x5yoIyC3RCKbudEqZf6S7VpjH0O6S4',
    isFeatured: true
  },
  {
    id: 'sch-2',
    title: 'Digital Renaissance Grant',
    provider: 'Vanguard Arts Guild',
    tags: ['UNDERGRAD', 'CREATIVE'],
    amount: 12500,
    category: 'Liberal Arts',
    deadline: 'Oct 24, 2024',
    locationInfo: 'Open Worldwide'
  },
  {
    id: 'sch-3',
    title: 'Sustainable Systems Award',
    provider: 'BioFuture Initiative',
    tags: ["MASTER'S", 'BIOLOGY'],
    amount: 25000,
    category: 'STEM'
  },
  {
    id: 'sch-4',
    title: 'Economic Innovation Grant',
    provider: 'Zenith Equity Partners',
    tags: ['FINANCE', '3.8+ GPA'],
    amount: 18000,
    category: 'International',
    locationInfo: 'Verified Provider'
  },
  {
    id: 'sch-5',
    title: 'The Orion Deep-Space Exploration Grant',
    provider: 'Special Program',
    tags: ['AEROSPACE', 'PROPULSION'],
    amount: 120000,
    category: 'STEM',
    description: 'An unprecedented opportunity for aerospace engineering students to work alongside industry veterans on next-generation propulsion systems.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFj8_B7pkf_aoLcIeS8MP4Fh-bJPf-1B7KvlwcdkET3IpAoBuIfBF8iUaEr1NMPL7_9ICurREU4sku7jrZvJWCP_rScPOAZa3AhGlQLhd1t9muKE94dzzqGkTnzTYrH2dBBmWriFQ7YPqwawz2Md56rV-icBFRRR21YdrNIwymBP9K4q2ALWI_A7fpXl0Vskuw2vNKQYiatCKyreDAbw-vu4Tqr36gkwPIIYEhWl34yNpUVJgI2-szYZ1hgFz6HZY_U7PWvdw9ij_s',
    isFeatured: true
  },
  {
    id: 'sch-6',
    title: 'Cultural Exchange Grant',
    provider: 'Atlas Global Scholars',
    tags: ['ALL MAJORS', 'STUDY ABROAD'],
    amount: 5000,
    category: 'International',
    status: 'Closing in 48 hours',
    statusType: 'danger'
  }
];

export const NEURAL_NETWORKS_QUIZ: QuizQuestion[] = [
  {
    question: "Which activation function outputs values in the range (-1, 1)?",
    options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
    correctAnswerIndex: 2
  },
  {
    question: "What is the primary purpose of backpropagation in training a Neural Network?",
    options: [
      "To initialize weights randomly",
      "To compute gradients of the loss function with respect to weights",
      "To perform high-dimensional WebGL calculations",
      "To clean input data noise"
    ],
    correctAnswerIndex: 1
  },
  {
    question: "Which mechanism allows transformer networks to process relative associations between tokens in parallel?",
    options: ["Recurrent Feedback", "Convolutional Pools", "Self-Attention Mechanism", "Stochastic Dropping"],
    correctAnswerIndex: 2
  },
  {
    question: "What is vanishing gradient syndrome?",
    options: [
      "When gradients diminish exponentially during backprop, grinding weight updates to a halt",
      "When gradients grow out of bounds and overflow memory",
      "The process of regularizing high-stakes weight distributions",
      "Removing unused layers in pre-trained models"
    ],
    correctAnswerIndex: 0
  }
];

export const RANKINGS = [
  { rank: '01', name: 'alex_dev', xp: 12400, trend: 'up' },
  { rank: '02', name: 'sarah_codes', xp: 11900, trend: 'same' },
  { rank: '03', name: 'marcus_lab', xp: 10200, trend: 'down' }
];
