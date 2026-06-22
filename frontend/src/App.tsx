import { useState, useMemo, useEffect, MouseEvent, FormEvent } from 'react';
import { 
  Search, 
  ChevronDown, 
  Terminal, 
  Brush, 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Cpu, 
  Clock, 
  ArrowRight, 
  Award, 
  MapPin, 
  Calendar, 
  Flame, 
  Rocket, 
  Settings, 
  Check, 
  Mail, 
  Sparkles, 
  Compass, 
  Bookmark, 
  Brain, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Database,
  Filter,
  CheckCircle2,
  BookmarkCheck,
  Zap,
  Info,
  Trash2,
  Pencil,
  Linkedin,
  Twitter,
  Instagram,
  UserPlus,
  UserMinus,
  Shield,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';

import { 
  NEURAL_NETWORKS_QUIZ, 
  RANKINGS 
} from './data';
import { Internship, Hackathon, Activity, Scholarship } from './types';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? (import.meta as any).env?.VITE_API_BASE_URL ?? '/api';

export default function App() {
  // Navigation State
  // "Internships" | "Hackathons" | "Scholarships" | "Activities" | "Discover"
  const [activeTab, setActiveTab] = useState<'internships' | 'hackathons' | 'scholarships' | 'activities' | 'discover'>('internships');
  
  // Routing State
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Profile Sim State
  const [userLootCredits, setUserLootCredits] = useState(1500);
  const [userXP, setUserXP] = useState(8200);
  const [registeredItems, setRegisteredItems] = useState<string[]>([]); // stores IDs of saved/applied items
  const [savedItems, setSavedItems] = useState<string[]>([]); // stores bookmarked IDs
  
  // Dynamic backend-fetched data states
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeQuizActivityId, setActiveQuizActivityId] = useState<string | null>(null);

  // SuperAdmin Panel State
  const [saUsers, setSaUsers] = useState<any[]>([]);
  const [saAdmins, setSaAdmins] = useState<any[]>([]);
  const [saLoadingUsers, setSaLoadingUsers] = useState(false);
  const [saLoadingAdmins, setSaLoadingAdmins] = useState(false);
  const [saLoadingAction, setSaLoadingAction] = useState(false);
  const [saMessage, setSaMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // SuperAdmin Inputs
  const [saCreateName, setSaCreateName] = useState('');
  const [saCreateEmail, setSaCreateEmail] = useState('');
  const [saCreatePassword, setSaCreatePassword] = useState('');
  const [saUpgradeUserId, setSaUpgradeUserId] = useState('');
  const [saSearchUserQuery, setSaSearchUserQuery] = useState('');
  const [saDowngradeAdminId, setSaDowngradeAdminId] = useState('');
  const [saSearchAdminQuery, setSaSearchAdminQuery] = useState('');
  const [saUpdateAdminId, setSaUpdateAdminId] = useState('');
  const [saUpdateName, setSaUpdateName] = useState('');
  const [saUpdateEmail, setSaUpdateEmail] = useState('');

  // SuperAdmin Reload Data
  const reloadSaData = async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      const [resUsers, resAdmins] = await Promise.all([
        fetch(`${API_BASE}/superadmin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/superadmin/admins`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      const dataUsers = await resUsers.json();
      const dataAdmins = await resAdmins.json();
      if (dataUsers.success) setSaUsers(dataUsers.data);
      if (dataAdmins.success) setSaAdmins(dataAdmins.data);
    } catch (err) {
      console.error(err);
    }
  };

  // SuperAdmin Fetch Effect
  useEffect(() => {
    if (currentPath === '/superadmin') {
      const fetchSaData = async () => {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
        if (!token) return;
        try {
          setSaLoadingUsers(true);
          setSaLoadingAdmins(true);
          const [resUsers, resAdmins] = await Promise.all([
            fetch(`${API_BASE}/superadmin/users`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE}/superadmin/admins`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);
          const dataUsers = await resUsers.json();
          const dataAdmins = await resAdmins.json();
          if (dataUsers.success) setSaUsers(dataUsers.data);
          if (dataAdmins.success) setSaAdmins(dataAdmins.data);
        } catch (err) {
          console.error(err);
          setSaMessage({ type: 'error', text: 'Mainframe offline: Failed to fetch directory.' });
        } finally {
          setSaLoadingUsers(false);
          setSaLoadingAdmins(false);
        }
      };
      fetchSaData();
    }
  }, [currentPath]);

  const handleCreateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!saCreateName || !saCreateEmail || !saCreatePassword) return;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      setSaLoadingAction(true);
      setSaMessage(null);
      const res = await fetch(`${API_BASE}/superadmin/create-admin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: saCreateName, email: saCreateEmail, password: saCreatePassword })
      });
      const data = await res.json();
      if (data.success) {
        setSaMessage({ type: 'success', text: `Admin ${saCreateName} created successfully.` });
        setSaCreateName('');
        setSaCreateEmail('');
        setSaCreatePassword('');
        reloadSaData();
      } else {
        setSaMessage({ type: 'error', text: data.message || 'Failed to create admin.' });
      }
    } catch (err) {
      console.error(err);
      setSaMessage({ type: 'error', text: 'Mainframe communication failure.' });
    } finally {
      setSaLoadingAction(false);
    }
  };

  const handleUpgradeUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!saUpgradeUserId) return;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      setSaLoadingAction(true);
      setSaMessage(null);
      const res = await fetch(`${API_BASE}/superadmin/upgrade/${saUpgradeUserId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSaMessage({ type: 'success', text: 'User upgraded to Admin status.' });
        setSaUpgradeUserId('');
        setSaSearchUserQuery('');
        reloadSaData();
      } else {
        setSaMessage({ type: 'error', text: data.message || 'Upgrade operation aborted.' });
      }
    } catch (err) {
      console.error(err);
      setSaMessage({ type: 'error', text: 'Mainframe communication failure.' });
    } finally {
      setSaLoadingAction(false);
    }
  };

  const handleDowngradeAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!saDowngradeAdminId) return;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      setSaLoadingAction(true);
      setSaMessage(null);
      const res = await fetch(`${API_BASE}/superadmin/downgrade/${saDowngradeAdminId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSaMessage({ type: 'success', text: 'Admin credentials revoked to standard User.' });
        setSaDowngradeAdminId('');
        setSaSearchAdminQuery('');
        reloadSaData();
      } else {
        setSaMessage({ type: 'error', text: data.message || 'Downgrade operation aborted.' });
      }
    } catch (err) {
      console.error(err);
      setSaMessage({ type: 'error', text: 'Mainframe communication failure.' });
    } finally {
      setSaLoadingAction(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm('Are you sure you want to completely delete this admin?')) return;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      setSaLoadingAction(true);
      setSaMessage(null);
      const res = await fetch(`${API_BASE}/superadmin/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSaMessage({ type: 'success', text: 'Admin completely deleted from database.' });
        if (saUpdateAdminId === id) {
          setSaUpdateAdminId('');
          setSaUpdateName('');
          setSaUpdateEmail('');
        }
        reloadSaData();
      } else {
        setSaMessage({ type: 'error', text: data.message || 'Delete operation aborted.' });
      }
    } catch (err) {
      console.error(err);
      setSaMessage({ type: 'error', text: 'Mainframe communication failure.' });
    } finally {
      setSaLoadingAction(false);
    }
  };

  const handleUpdateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!saUpdateAdminId || !saUpdateName || !saUpdateEmail) return;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (!token) return;
    try {
      setSaLoadingAction(true);
      setSaMessage(null);
      const res = await fetch(`${API_BASE}/superadmin/update/${saUpdateAdminId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: saUpdateName, email: saUpdateEmail })
      });
      const data = await res.json();
      if (data.success) {
        setSaMessage({ type: 'success', text: 'Admin details updated successfully.' });
        setSaUpdateAdminId('');
        setSaUpdateName('');
        setSaUpdateEmail('');
        reloadSaData();
      } else {
        setSaMessage({ type: 'error', text: data.message || 'Update operation aborted.' });
      }
    } catch (err) {
      console.error(err);
      setSaMessage({ type: 'error', text: 'Mainframe communication failure.' });
    } finally {
      setSaLoadingAction(false);
    }
  };

  // Load data from backend Mongoose APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resInt, resHack, resSch, resAct] = await Promise.all([
          fetch(`${API_BASE}/internships`),
          fetch(`${API_BASE}/hackathons`),
          fetch(`${API_BASE}/scholarships`),
          fetch(`${API_BASE}/activities`)
        ]);
        
        const dataInt = await resInt.json();
        const dataHack = await resHack.json();
        const dataSch = await resSch.json();
        const dataAct = await resAct.json();

        // Helpers to parse currency and prize string values for numeric matching/sorting
        const parseNumeric = (val: string | number): number => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          const clean = val.replace(/[^0-9]/g, '');
          return clean ? parseInt(clean, 10) : 0;
        };

        const getInternshipCategory = (domain: string): string => {
          if (!domain) return 'Engineering';
          const d = domain.toLowerCase();
          if (d.includes('ai') || d.includes('prompt') || d.includes('research')) return 'AI & Research';
          if (d.includes('design') || d.includes('marketing') || d.includes('graphics') || d.includes('social')) return 'Design';
          if (d.includes('business') || d.includes('finance') || d.includes('sales') || d.includes('outreach') || d.includes('ambassador') || d.includes('engagement')) return 'Finance';
          return 'Engineering';
        };

        const getHackathonCategory = (title: string): string => {
          const t = title.toLowerCase();
          if (t.includes('web3') || t.includes('chain') || t.includes('crypto') || t.includes('blockchain') || t.includes('mongodb')) return 'Web3 & Decentralization';
          if (t.includes('ai') || t.includes('prompt') || t.includes('agent') || t.includes('scientist') || t.includes('datathon') || t.includes('data')) return 'AI & ML';
          if (t.includes('sustain') || t.includes('green') || t.includes('eco')) return 'Sustainability Tech';
          return 'General';
        };

        const getScholarshipCategory = (item: any): string => {
          if (!item.category || item.category === 'General') {
            const courses = (item.eligibility?.courseAllowed || []).map((c: string) => c.toLowerCase());
            if (courses.some((c: string) => c.includes('engineering') || c.includes('science') || c.includes('it') || c.includes('stem'))) return 'STEM';
            return 'Liberal Arts';
          }
          return item.category;
        };

        const getActivityCategory = (item: any): string => {
          const t = (item.type || '').toLowerCase();
          const title = (item.title || '').toLowerCase();
          if (t === 'quiz' || title.includes('quiz')) return 'Academic Quizzes';
          if (title.includes('challenge') || title.includes('coding') || title.includes('ideathon') || title.includes('ctf')) return 'Coding Challenges';
          if (title.includes('workshop')) return 'Workshops';
          return 'Research Labs';
        };

        if (dataInt.success && Array.isArray(dataInt.data)) {
          const normalized = dataInt.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            category: getInternshipCategory(item.domain),
            location: item.location || item.locationType || 'Remote',
            stipend: parseNumeric(item.stipend),
            stipendText: item.stipend, // Keep original text for rendering
            tags: item.tags || [item.domain, item.locationType, item.duration].filter(Boolean),
            status: item.status || 'Active Now',
            statusType: item.statusType || 'success'
          }));
          setInternships(normalized);
        }

        if (dataHack.success && Array.isArray(dataHack.data)) {
          const normalized = dataHack.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            category: getHackathonCategory(item.title),
            roleType: item.organizer,
            totalPrize: parseNumeric(item.prizePool),
            prizeText: item.prizePool, // Keep original for rendering
            status: item.mode || 'Online',
            statusType: 'highlight',
            deadline: new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            image: item.image || ''
          }));
          setHackathons(normalized);
        }

        if (dataSch.success && Array.isArray(dataSch.data)) {
          const normalized = dataSch.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            category: getScholarshipCategory(item),
            amount: parseNumeric(item.amount),
            amountText: item.amount,
            tags: item.tags || [item.eligibility?.incomeLimit, ...(item.eligibility?.courseAllowed || [])].filter(Boolean),
            status: item.status || 'MERIT-BASED',
            statusType: 'normal',
            image: item.image || ''
          }));
          setScholarships(normalized);
        }

        if (dataAct.success && Array.isArray(dataAct.data)) {
          const normalized = dataAct.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            category: getActivityCategory(item),
            level: 'Elite Level',
            status: 'Live Now',
            statusType: 'live',
            xpText: '500 XP',
            rewardText: item.rewards?.cashPrize || 'Certificate Only',
            quizId: (item.type === 'Quiz' || item.title.toLowerCase().includes('quiz')) ? 'quiz-nn' : undefined,
            image: item.image || ''
          }));
          setActivities(normalized);
        }
      } catch (err) {
        console.error('Error fetching opportunity data:', err);
      } finally {
        setOpportunitiesLoading(false);
      }
    };
    fetchData();
  }, []);

  // Routing State has been moved to the top of App to avoid block-scoping issues

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    if (currentPath === '/superadmin' || currentPath.startsWith('/superadmin/')) {
      const token = adminToken || userToken;
      let isSuperAdmin = false;
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.role === 'superadmin') {
          isSuperAdmin = true;
        }
      }
      if (!isSuperAdmin) {
        navigateTo('/');
        return;
      }
    }

    if (currentPath.startsWith('/admin')) {
      // Check specifically for a valid admin token (NOT user token)
      if (adminToken) {
        const decoded = decodeJWT(adminToken);
        if (decoded && (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.isAdmin)) {
          // Valid admin — redirect away from login/register pages to dashboard
          if (currentPath === '/admin/login' || currentPath === '/admin/register') {
            navigateTo('/admin/dashboard');
          }
          // Otherwise let them stay on the admin page they requested
          return;
        }
      }

      // No valid admin token — check if a normal user token exists (but allow access to admin login/register pages)
      if (userToken && currentPath !== '/admin/login' && currentPath !== '/admin/register') {
        const decoded = decodeJWT(userToken);
        if (decoded) {
          // Normal logged-in user trying to access /admin pages (other than login/register) — send to home
          navigateTo('/');
          return;
        }
      }

      // No token at all — only allow /admin/login and /admin/register, redirect others
      if (currentPath !== '/admin/login' && currentPath !== '/admin/register') {
        navigateTo('/admin/login');
      }
    }
  }, [currentPath]);

  const getPluralStream = (stream: string): string => {
    const s = stream.toLowerCase();
    if (s === 'internship' || s === 'internships') return 'internships';
    if (s === 'hackathon' || s === 'hackathons') return 'hackathons';
    if (s === 'scholarship' || s === 'scholarships') return 'scholarships';
    if (s === 'activity' || s === 'activities') return 'activities';
    return s;
  };

  const getInitials = (item: any) => {
    const name = item.company || item.organizer || item.provider || 'CL';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRandomImage = (itemId: string) => {
    if (!itemId) return '/images/1.png';
    let hash = 0;
    for (let i = 0; i < itemId.length; i++) {
      hash = itemId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % 18) + 1; // 1.png to 18.png
    return `/images/${index}.png`;
  };

  const pathParts = currentPath.split('/').filter(Boolean);
  const isDetailsPage = pathParts.length === 2 && ['internship', 'internships', 'hackathon', 'hackathons', 'scholarship', 'scholarships', 'activity', 'activities'].includes(pathParts[0].toLowerCase());
  const detailsStream = isDetailsPage ? getPluralStream(pathParts[0]) : null;
  const detailsId = isDetailsPage ? pathParts[1] : null;

  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDetailsPage || !detailsStream || !detailsId) {
      setDetailsItem(null);
      return;
    }
    
    // Try to find in local state first
    let localItem: any = null;
    if (detailsStream === 'internships') {
      localItem = internships.find(i => i.id === detailsId);
    } else if (detailsStream === 'hackathons') {
      localItem = hackathons.find(h => h.id === detailsId);
    } else if (detailsStream === 'scholarships') {
      localItem = scholarships.find(s => s.id === detailsId);
    } else if (detailsStream === 'activities') {
      localItem = activities.find(a => a.id === detailsId);
    }

    if (localItem) {
      setDetailsItem(localItem);
      setDetailsError(null);
    } else {
      // Fetch from API
      const fetchDetails = async () => {
        setDetailsLoading(true);
        setDetailsError(null);
        try {
          const res = await fetch(`${API_BASE}/${detailsStream}/${detailsId}`);
          const json = await res.json();
          if (json.success && json.data) {
            let normalizedItem = { ...json.data, id: json.data._id || json.data.id };
            
            // Normalize fields
            if (detailsStream === 'internships') {
              const parseNumeric = (val: string | number): number => {
                if (typeof val === 'number') return val;
                if (!val) return 0;
                const clean = val.replace(/[^0-9]/g, '');
                return clean ? parseInt(clean, 10) : 0;
              };
              normalizedItem.stipend = parseNumeric(normalizedItem.stipend);
              normalizedItem.stipendText = normalizedItem.stipend;
              normalizedItem.location = normalizedItem.location || normalizedItem.locationType || 'Remote';
              normalizedItem.tags = normalizedItem.tags || [normalizedItem.domain, normalizedItem.locationType, normalizedItem.duration].filter(Boolean);
            } else if (detailsStream === 'hackathons') {
              normalizedItem.prizeText = normalizedItem.prizePool;
              normalizedItem.deadline = new Date(normalizedItem.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } else if (detailsStream === 'scholarships') {
              normalizedItem.amountText = normalizedItem.amount;
              normalizedItem.tags = normalizedItem.tags || [normalizedItem.eligibility?.incomeLimit, ...(normalizedItem.eligibility?.courseAllowed || [])].filter(Boolean);
            } else if (detailsStream === 'activities') {
              normalizedItem.xpText = '500 XP';
              normalizedItem.rewardText = normalizedItem.rewards?.cashPrize || 'Certificate Only';
            }

            setDetailsItem(normalizedItem);
          } else {
            setDetailsError(json.message || 'Opportunity not found');
          }
        } catch (err: any) {
          setDetailsError(err.message || 'Error fetching details');
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isDetailsPage, detailsStream, detailsId, internships, hackathons, scholarships, activities]);
  
  // Internship Filters
  const [internshipCategory, setInternshipCategory] = useState<string>('All');
  const [internshipSort, setInternshipSort] = useState<string>('Highest Stipend');
  const [visibleInternshipsCount, setVisibleInternshipsCount] = useState(6);

  // Hackathon Filters
  const [hackathonCategory, setHackathonCategory] = useState<string>('All');

  // Scholarship Filters
  const [scholarshipCategory, setScholarshipCategory] = useState<string>('All');
  const [scholarshipSort, setScholarshipSort] = useState<string>('Highest Amount');

  // Activity Filters
  const [activityCategory, setActivityCategory] = useState<string>('All');

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Personalization State
  const [interestRole, setInterestRole] = useState<'Engineering' | 'Design' | 'Finance' | 'AI & Research'>('Engineering');
  const [prefLevel, setPrefLevel] = useState<string>('Undergraduate');
  const [prefStipend, setPrefStipend] = useState<number>(5000);
  const [prefRemote, setPrefRemote] = useState<boolean>(true);
  const [personalizedFeedback, setPersonalizedFeedback] = useState<boolean>(false);

  // General Dialog Modals
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [alertsEmail, setAlertsEmail] = useState('');
  const [alertsSubscribed, setAlertsSubscribed] = useState(false);

  // Helper to render skeleton loading cards
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div key={`skeleton-${idx}`} className="skeleton-card">
        <div className="skeleton-image skeleton-shimmer"></div>
        <div className="skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-subtitle skeleton-shimmer"></div>
        <div className="skeleton-amount skeleton-shimmer"></div>
        <div className="skeleton-button skeleton-shimmer"></div>
      </div>
    ));
  };

  // Contact States
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitLoading, setContactSubmitLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  const [activeDetailItem, setActiveDetailItem] = useState<{
    title: string;
    description: string;
    tags?: string[];
    partner?: string;
    amount?: string | number;
  } | null>(null);

  // Personalize Feed Filter Drawer Info
  const [personalizeFeedOpen, setPersonalizeFeedOpen] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');

  // Admin Register State
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerCollege, setRegisterCollege] = useState('');
  const [registerYear, setRegisterYear] = useState('');
  const [registerBranch, setRegisterBranch] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Helper function to decode JWT payload safely in pure JS/TS
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Student Login State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState('');

  // Student Register State
  const [studentRegName, setStudentRegName] = useState('');
  const [studentRegEmail, setStudentRegEmail] = useState('');
  const [studentRegPassword, setStudentRegPassword] = useState('');
  const [studentRegCollege, setStudentRegCollege] = useState('');
  const [studentRegYear, setStudentRegYear] = useState('');
  const [studentRegBranch, setStudentRegBranch] = useState('');
  const [studentRegError, setStudentRegError] = useState('');
  const [studentRegSuccess, setStudentRegSuccess] = useState('');
  const [studentRegLoading, setStudentRegLoading] = useState(false);

  // Run on mount and path changes to verify token state
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    let isAdmin = false;
    let nameOfAdmin = '';

    if (adminToken) {
      const decoded = decodeJWT(adminToken);
      if (decoded && (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.isAdmin)) {
        isAdmin = true;
        nameOfAdmin = decoded.name || 'Yogesh Kumar';
      }
    }

    if (userToken) {
      const decoded = decodeJWT(userToken);
      if (decoded) {
        setIsStudentLoggedIn(true);
        setStudentName(decoded.name || 'Student');
        if (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.isAdmin) {
          isAdmin = true;
          nameOfAdmin = decoded.name || 'Yogesh Kumar';
          if (!localStorage.getItem('adminToken')) {
            localStorage.setItem('adminToken', userToken);
          }
        }
      } else {
        setIsStudentLoggedIn(false);
        setStudentName('');
      }
    } else {
      setIsStudentLoggedIn(false);
      setStudentName('');
    }

    setIsAdminLoggedIn(isAdmin);
    setAdminName(nameOfAdmin);
  }, [currentPath]);

  useEffect(() => {
    if (isAdminLoggedIn && currentPath.startsWith('/admin')) {
      fetchContactMessages();
    }
  }, [isAdminLoggedIn, currentPath]);

  const handleStudentLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: studentEmail, password: studentPassword })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('userToken', data.token);
        setIsStudentLoggedIn(true);
        setStudentName(data.name || 'Student');
        
        // Also check if logged-in student has admin role
        const decoded = decodeJWT(data.token);
        if (decoded && (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.isAdmin)) {
          localStorage.setItem('adminToken', data.token);
          setIsAdminLoggedIn(true);
          setAdminName(data.name || 'Yogesh Kumar');
        }

        setStudentEmail('');
        setStudentPassword('');
        navigateTo('/'); // Redirects to "/" only
      } else {
        setStudentError(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setStudentError('Network error, please try again.');
      console.error(err);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleStudentRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStudentRegError('');
    setStudentRegSuccess('');
    setStudentRegLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: studentRegName,
          email: studentRegEmail,
          password: studentRegPassword,
          college: studentRegCollege,
          year: parseInt(studentRegYear, 10) || 1,
          branch: studentRegBranch
        })
      });
      const data = await response.json();
      if (data.success) {
        setStudentRegSuccess('Registration successful! Redirecting to login page...');
        setStudentRegName('');
        setStudentRegEmail('');
        setStudentRegPassword('');
        setStudentRegCollege('');
        setStudentRegYear('');
        setStudentRegBranch('');
        setTimeout(() => {
          navigateTo('/login');
          setStudentRegSuccess('');
        }, 2000);
      } else {
        setStudentRegError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setStudentRegError('Network error, please try again.');
      console.error(err);
    } finally {
      setStudentRegLoading(false);
    }
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    setIsStudentLoggedIn(false);
    setIsAdminLoggedIn(false);
    setStudentName('');
    setAdminName('');
    navigateTo('/');
  };

  const handleAdminLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        const decoded = decodeJWT(data.token);
        setIsAdminLoggedIn(true);
        setAdminName(decoded?.name || 'Yogesh Kumar');
        navigateTo('/admin/dashboard');
      } else {
        setAdminError(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setAdminError('Network error, please try again.');
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setRegisterLoading(true);
    try {
      // NOTE: role is NOT sent — backend always assigns 'user' for public registration.
      // Admin role must be assigned manually in the database by a super-admin.
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          college: registerCollege,
          year: parseInt(registerYear, 10) || 1,
          branch: registerBranch
          // role is intentionally omitted — backend enforces role:'user' for all registrations
        })
      });
      const data = await response.json();
      if (data.success) {
        setRegisterSuccess('Access request submitted! An admin will activate your privileges. Redirecting...');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterCollege('');
        setRegisterYear('');
        setRegisterBranch('');
        setTimeout(() => {
          navigateTo('/admin/login');
          setRegisterSuccess('');
        }, 2000);
      } else {
        setRegisterError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setRegisterError('Network error, please try again.');
      console.error(err);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    setIsAdminLoggedIn(false);
    setIsStudentLoggedIn(false);
    setAdminName('');
    setStudentName('');
    navigateTo('/');
  };

  // Pipeline selector: "internships" | "hackathons" | "scholarships" | "activities" | "contacts"
  const [targetPipeline, setTargetPipeline] = useState<'internships' | 'hackathons' | 'scholarships' | 'activities' | 'contacts'>('internships');

  // Unified CRUD Form State variables
  const [formId, setFormId] = useState(''); // Empty = Create Mode, populated = Edit Mode
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formStipend, setFormStipend] = useState('');
  const [formLocationType, setFormLocationType] = useState('Remote');
  const [formDuration, setFormDuration] = useState('');
  const [formApplyLink, setFormApplyLink] = useState('');
  const [formAffiliateLink, setFormAffiliateLink] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  
  // Hackathon specific
  const [formPrizePool, setFormPrizePool] = useState('');
  const [formTeamSize, setFormTeamSize] = useState('');
  const [formMode, setFormMode] = useState('Online');
  const [formPlatform, setFormPlatform] = useState('Independent');
  const [formEventDate, setFormEventDate] = useState('');

  // Scholarship specific
  const [formProvider, setFormProvider] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formIncomeLimit, setFormIncomeLimit] = useState('No Bar');
  const [formMinMarks, setFormMinMarks] = useState('N/A');
  const [formCourseInput, setFormCourseInput] = useState('');
  const [formCoursesAllowed, setFormCoursesAllowed] = useState<string[]>([]);

  // Extra Activity specific
  const [formActivityType, setFormActivityType] = useState('');
  const [formCashDropReward, setFormCashDropReward] = useState('Certificate Only');
  const [formDeployCertificate, setFormDeployCertificate] = useState(true);

  // Success/Error feedback states for Console Operations
  const [consoleSuccessMsg, setConsoleSuccessMsg] = useState('');
  const [consoleErrorMsg, setConsoleErrorMsg] = useState('');
  const [consoleLoading, setConsoleLoading] = useState(false);

  const handleResetForm = () => {
    setFormId('');
    setFormTitle('');
    setFormCompany('');
    setFormOrganizer('');
    setFormDomain('');
    setFormStipend('');
    setFormLocationType('Remote');
    setFormDuration('');
    setFormApplyLink('');
    setFormAffiliateLink('');
    setFormDeadline('');
    setFormPrizePool('');
    setFormTeamSize('');
    setFormMode('Online');
    setFormPlatform('Independent');
    setFormEventDate('');
    setFormProvider('');
    setFormAmount('');
    setFormCategory('');
    setFormIncomeLimit('No Bar');
    setFormMinMarks('N/A');
    setFormCourseInput('');
    setFormCoursesAllowed([]);
    setFormActivityType('');
    setFormCashDropReward('Certificate Only');
    setFormDeployCertificate(true);
    setConsoleSuccessMsg('');
    setConsoleErrorMsg('');
  };

  const handlePreFillEdit = (item: any, pipeline: 'internships' | 'hackathons' | 'scholarships' | 'activities') => {
    setFormId(item._id || item.id);
    setTargetPipeline(pipeline);
    
    setFormTitle(item.title || '');
    setFormApplyLink(item.applyLink || '');
    setFormAffiliateLink(item.affiliateLink || '');
    
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (d: any) => {
      if (!d) return '';
      const date = new Date(d);
      if (isNaN(date.getTime())) return '';
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    setFormDeadline(formatDateForInput(item.deadline));

    if (pipeline === 'internships') {
      setFormCompany(item.company || '');
      setFormDomain(item.domain || '');
      setFormStipend(item.stipendText || item.stipend || '');
      setFormLocationType(item.location || item.locationType || 'Remote');
      setFormDuration(item.duration || '');
    } else if (pipeline === 'hackathons') {
      setFormOrganizer(item.organizer || item.roleType || '');
      setFormPrizePool(item.prizeText || item.prizePool || '');
      setFormTeamSize(item.teamSize || '');
      setFormMode(item.mode || item.status || 'Online');
      setFormPlatform(item.platform || 'Independent');
      setFormEventDate(formatDateForInput(item.eventDate));
    } else if (pipeline === 'scholarships') {
      setFormProvider(item.provider || '');
      setFormAmount(item.amountText || item.amount || '');
      setFormCategory(item.category || '');
      setFormIncomeLimit(item.eligibility?.incomeLimit || 'No Bar');
      setFormMinMarks(item.eligibility?.minMarks || 'N/A');
      setFormCoursesAllowed(item.eligibility?.courseAllowed || []);
    } else if (pipeline === 'activities') {
      setFormOrganizer(item.organizer || '');
      setFormActivityType(item.type || item.category || '');
      setFormCashDropReward(item.rewardText || item.rewards?.cashPrize || 'Certificate Only');
      setFormDeployCertificate(item.rewards?.hasCertificate ?? true);
      setFormMode(item.mode || 'Online');
    }

    // Scroll smoothly to form top in Console view
    const consoleFormElement = document.getElementById('command-console-form');
    if (consoleFormElement) {
      consoleFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteEntry = async (id: string, pipeline: 'internships' | 'hackathons' | 'scholarships' | 'activities', e?: MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE}/${pipeline}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Remove from local states
        if (pipeline === 'internships') {
          setInternships(prev => prev.filter(i => i.id !== id));
        } else if (pipeline === 'hackathons') {
          setHackathons(prev => prev.filter(h => h.id !== id));
        } else if (pipeline === 'scholarships') {
          setScholarships(prev => prev.filter(s => s.id !== id));
        } else if (pipeline === 'activities') {
          setActivities(prev => prev.filter(a => a.id !== id));
        }
        
        if (formId === id) {
          handleResetForm();
        }
      } else {
        alert(data.message || 'Failed to delete listing');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, failed to delete');
    }
  };

  const handleConsoleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setConsoleSuccessMsg('');
    setConsoleErrorMsg('');
    setConsoleLoading(true);

    const token = localStorage.getItem('adminToken');
    const isEditMode = !!formId;
    const url = isEditMode ? `${API_BASE}/${targetPipeline}/${formId}` : `${API_BASE}/${targetPipeline}`;
    const method = isEditMode ? 'PUT' : 'POST';

    // Construct pipeline specific payload
    let payload: any = {};
    if (targetPipeline === 'internships') {
      payload = {
        title: formTitle,
        company: formCompany,
        domain: formDomain,
        stipend: formStipend,
        locationType: formLocationType,
        duration: formDuration,
        applyLink: formApplyLink,
        affiliateLink: formAffiliateLink,
        deadline: formDeadline
      };
    } else if (targetPipeline === 'hackathons') {
      payload = {
        title: formTitle,
        organizer: formOrganizer,
        prizePool: formPrizePool,
        teamSize: formTeamSize,
        mode: formMode,
        platform: formPlatform,
        eventDate: formEventDate || undefined,
        applyLink: formApplyLink,
        affiliateLink: formAffiliateLink,
        deadline: formDeadline
      };
    } else if (targetPipeline === 'scholarships') {
      payload = {
        title: formTitle,
        provider: formProvider,
        amount: formAmount,
        category: formCategory,
        eligibility: {
          incomeLimit: formIncomeLimit,
          minMarks: formMinMarks,
          courseAllowed: formCoursesAllowed
        },
        applyLink: formApplyLink,
        affiliateLink: formAffiliateLink,
        deadline: formDeadline
      };
    } else if (targetPipeline === 'activities') {
      payload = {
        title: formTitle,
        organizer: formOrganizer,
        type: formActivityType,
        rewards: {
          cashPrize: formCashDropReward,
          hasCertificate: formDeployCertificate
        },
        mode: formMode,
        applyLink: formApplyLink,
        affiliateLink: formAffiliateLink,
        deadline: formDeadline
      };
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const resData = await response.json();
      if (resData.success && resData.data) {
        const item = resData.data;
        setConsoleSuccessMsg(isEditMode ? 'Data packet updated successfully!' : 'Data packet transmitted and seeded successfully!');
        
        // Parse helpers (replicating what's in initial load)
        const parseNumeric = (val: string | number): number => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          const clean = val.replace(/[^0-9]/g, '');
          return clean ? parseInt(clean, 10) : 0;
        };

        const getInternshipCategory = (domain: string): string => {
          if (!domain) return 'Engineering';
          const d = domain.toLowerCase();
          if (d.includes('ai') || d.includes('prompt') || d.includes('research')) return 'AI & Research';
          if (d.includes('design') || d.includes('marketing') || d.includes('graphics') || d.includes('social')) return 'Design';
          if (d.includes('business') || d.includes('finance') || d.includes('sales') || d.includes('outreach') || d.includes('ambassador') || d.includes('engagement')) return 'Finance';
          return 'Engineering';
        };

        const getHackathonCategory = (title: string): string => {
          const t = title.toLowerCase();
          if (t.includes('web3') || t.includes('chain') || t.includes('crypto') || t.includes('blockchain') || t.includes('mongodb')) return 'Web3 & Decentralization';
          if (t.includes('ai') || t.includes('prompt') || t.includes('agent') || t.includes('scientist') || t.includes('datathon') || t.includes('data')) return 'AI & ML';
          if (t.includes('sustain') || t.includes('green') || t.includes('eco')) return 'Sustainability Tech';
          return 'General';
        };

        const getScholarshipCategory = (item: any): string => {
          if (!item.category || item.category === 'General') {
            const courses = (item.eligibility?.courseAllowed || []).map((c: string) => c.toLowerCase());
            if (courses.some((c: string) => c.includes('engineering') || c.includes('science') || c.includes('it') || c.includes('stem'))) return 'STEM';
            return 'Liberal Arts';
          }
          return item.category;
        };

        const getActivityCategory = (item: any): string => {
          const t = (item.type || '').toLowerCase();
          const title = (item.title || '').toLowerCase();
          if (t === 'quiz' || title.includes('quiz')) return 'Academic Quizzes';
          if (title.includes('challenge') || title.includes('coding') || title.includes('ideathon') || title.includes('ctf')) return 'Coding Challenges';
          if (title.includes('workshop')) return 'Workshops';
          return 'Research Labs';
        };

        // Normalize the item
        let normalizedItem: any = { ...item, id: item._id || item.id };
        if (targetPipeline === 'internships') {
          normalizedItem.category = getInternshipCategory(item.domain);
          normalizedItem.location = item.location || item.locationType || 'Remote';
          normalizedItem.stipend = parseNumeric(item.stipend);
          normalizedItem.stipendText = item.stipend;
          normalizedItem.tags = item.tags || [item.domain, item.locationType, item.duration].filter(Boolean);
          normalizedItem.status = item.status || 'Active Now';
          normalizedItem.statusType = item.statusType || 'success';
        } else if (targetPipeline === 'hackathons') {
          normalizedItem.category = getHackathonCategory(item.title);
          normalizedItem.roleType = item.organizer;
          normalizedItem.totalPrize = parseNumeric(item.prizePool);
          normalizedItem.prizeText = item.prizePool;
          normalizedItem.status = item.mode || 'Online';
          normalizedItem.statusType = 'highlight';
          normalizedItem.deadline = new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (targetPipeline === 'scholarships') {
          normalizedItem.category = getScholarshipCategory(item);
          normalizedItem.amount = parseNumeric(item.amount);
          normalizedItem.amountText = item.amount;
          normalizedItem.tags = item.tags || [item.eligibility?.incomeLimit, ...(item.eligibility?.courseAllowed || [])].filter(Boolean);
          normalizedItem.status = item.status || 'MERIT-BASED';
          normalizedItem.statusType = 'normal';
        } else if (targetPipeline === 'activities') {
          normalizedItem.category = getActivityCategory(item);
          normalizedItem.level = 'Elite Level';
          normalizedItem.status = 'Live Now';
          normalizedItem.statusType = 'live';
          normalizedItem.xpText = '500 XP';
          normalizedItem.rewardText = item.rewards?.cashPrize || 'Certificate Only';
          normalizedItem.quizId = (item.type === 'Quiz' || item.title.toLowerCase().includes('quiz')) ? 'quiz-nn' : undefined;
        }

        // Apply state updates reactively
        if (targetPipeline === 'internships') {
          setInternships(prev => isEditMode ? prev.map(i => i.id === formId ? normalizedItem : i) : [normalizedItem, ...prev]);
        } else if (targetPipeline === 'hackathons') {
          setHackathons(prev => isEditMode ? prev.map(h => h.id === formId ? normalizedItem : h) : [normalizedItem, ...prev]);
        } else if (targetPipeline === 'scholarships') {
          setScholarships(prev => isEditMode ? prev.map(s => s.id === formId ? normalizedItem : s) : [normalizedItem, ...prev]);
        } else if (targetPipeline === 'activities') {
          setActivities(prev => isEditMode ? prev.map(a => a.id === formId ? normalizedItem : a) : [normalizedItem, ...prev]);
        }

        // Reset form variables
        handleResetForm();
      } else {
        setConsoleErrorMsg(resData.message || 'Seeding action failed.');
      }
    } catch (err) {
      console.error(err);
      setConsoleErrorMsg('API communication error. Check local console logs.');
    } finally {
      setConsoleLoading(false);
    }
  };

  // ----------------------------------------------------
  // Action Handlers
  // ----------------------------------------------------
  const toggleSaveItem = (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  const toggleRegisterItem = (id: string, rewardValue?: number, xpReward?: number) => {
    if (registeredItems.includes(id)) {
      // Unregister
      setRegisteredItems(registeredItems.filter(item => item !== id));
    } else {
      // Register
      setRegisteredItems([...registeredItems, id]);
      if (rewardValue) {
        setUserLootCredits(prev => prev + rewardValue);
      }
      if (xpReward) {
        setUserXP(prev => prev + xpReward);
      }
    }
  };

  const handleApplyClick = (item: any, stream: string, rewardValue?: number, xpReward?: number) => {
    const link = item.affiliateLink || item.applyLink || item.link || item.url || item.registrationLink || item.applicationUrl || item.website;
    if (link) {
      toggleRegisterItem(item.id, rewardValue, xpReward);
      window.open(`${API_BASE}/opportunities/redirect/${stream}/${item.id}`, '_blank');
    } else {
      navigateTo(`/${stream}/${item.id}`);
    }
  };

  // Quiz Mechanism
  const handleAnswerSubmit = () => {
    if (selectedAnswerIndex === null) return;
    
    if (selectedAnswerIndex === NEURAL_NETWORKS_QUIZ[currentQuestionIndex].correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIndex + 1 < NEURAL_NETWORKS_QUIZ.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
    } else {
      setQuizFinished(true);
    }
  };

  const claimQuizPrize = () => {
    const pointsWon = quizScore * 125; // 125 credits per correct answer
    const xpWon = quizScore * 60;
    
    setUserLootCredits(prev => prev + pointsWon);
    setUserXP(prev => prev + xpWon);
    
    // mark activity as completed
    setRegisteredItems([...registeredItems, activeQuizActivityId || 'act-2']); 
    
    // Reset state & close
    setQuizModalOpen(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactSuccess('');
    setContactError('');
    setContactSubmitLoading(true);

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setContactSuccess('Your message has been transmitted successfully! Our team will respond shortly.');
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactError(data.message || 'Transmission failed. Please check your data.');
      }
    } catch (err) {
      setContactError('API communication error. Check local console logs.');
      console.error(err);
    } finally {
      setContactSubmitLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setContactMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const handleMarkContactRead = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContactMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, failed to mark read');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContactMessages(prev => prev.filter(m => m._id !== id));
      } else {
        alert(data.message || 'Failed to delete message');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, failed to delete message');
    }
  };

  const handleSubscribeAlerts = (e: FormEvent) => {
    e.preventDefault();
    if (!alertsEmail) return;
    setAlertsSubscribed(true);
    setTimeout(() => {
      setAlertsModalOpen(false);
      setAlertsSubscribed(false);
      setAlertsEmail('');
    }, 2800);
  };

  // ----------------------------------------------------
  // Computations / Filters
  // ----------------------------------------------------

  // Filter Internships
  const filteredInternships = useMemo(() => {
    let result = [...internships];
    // Category chips
    if (internshipCategory !== 'All') {
      result = result.filter(item => {
        if (internshipCategory === 'Engineering') return item.category === 'Engineering';
        if (internshipCategory === 'Design') return item.category === 'Design';
        if (internshipCategory === 'Finance') return item.category === 'Finance';
        if (internshipCategory === 'AI & Research') return item.category === 'AI & Research';
        return true;
      });
    }
    // Searchbar
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.company && item.company.toLowerCase().includes(q)) || 
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(tag => tag && tag.toLowerCase().includes(q)))
      );
    }
    // Personalized Preferences if activated
    if (personalizedFeedback && activeTab === 'internships') {
      result = result.filter(item => {
        if (item.category !== interestRole) return false;
        if (item.stipend < prefStipend) return false;
        if (prefRemote && !item.tags.some(t => t.toLowerCase() === 'remote')) return false;
        return true;
      });
    }

    // Sort
    if (internshipSort === 'Highest Stipend') {
      result.sort((a, b) => b.stipend - a.stipend);
    } else if (internshipSort === 'Newest First') {
      // Simulating slightly modified stack
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (internshipSort === 'Urgent') {
      result.sort((a, b) => {
        const aVal = a.status ? 1 : 0;
        const bVal = b.status ? 1 : 0;
        return bVal - aVal;
      });
    }
    return result;
  }, [internships, internshipCategory, searchQuery, internshipSort, interestRole, prefStipend, prefRemote, personalizedFeedback, activeTab]);

  // Filter Hackathons
  const filteredHackathons = useMemo(() => {
    let result = [...hackathons];
    if (hackathonCategory !== 'All') {
      result = result.filter(item => item.category === hackathonCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }
    return result;
  }, [hackathons, hackathonCategory, searchQuery]);

  // Filter Scholarships
  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];
    if (scholarshipCategory !== 'All') {
      result = result.filter(item => {
        if (scholarshipCategory === 'STEM') return item.category === 'STEM';
        if (scholarshipCategory === 'Liberal Arts') return item.category === 'Liberal Arts';
        if (scholarshipCategory === 'International') return item.category === 'International';
        return true;
      });
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.provider && item.provider.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(tag => tag && tag.toLowerCase().includes(q)))
      );
    }

    if (scholarshipSort === 'Highest Amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (scholarshipSort === 'Ending Soon') {
      result.sort((a, b) => (a.status ? -1 : 1));
    }
    return result;
  }, [scholarships, scholarshipCategory, searchQuery, scholarshipSort]);

  // Filter Activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];
    if (activityCategory !== 'All') {
      result = result.filter(item => {
        if (activityCategory === 'Coding Challenges') return item.category === 'Coding Challenges';
        if (activityCategory === 'Academic Quizzes') return item.category === 'Academic Quizzes';
        if (activityCategory === 'Workshops') return item.category === 'Workshops';
        if (activityCategory === 'Research Labs') return item.category === 'Research Labs';
        return true;
      });
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activities, activityCategory, searchQuery]);

  // Discover Recommended Items list
  const discoverMatches = useMemo(() => {
    const matches: Array<{
      type: 'internship' | 'hackathon' | 'scholarship' | 'activity';
      title: string;
      source: string; // company or provider
      compensation: string;
      tags: string[];
      rawId: string;
    }> = [];

    // Simple matching algorithm
    internships.forEach(item => {
      let score = 0;
      if (item.category === interestRole) score += 3;
      if (item.stipend >= prefStipend) score += 2;
      if (prefRemote && item.tags.some(t => t.toLowerCase() === 'remote')) score += 2;
      if (score >= 3) {
        matches.push({
          type: 'internship',
          title: item.title,
          source: item.company,
          compensation: item.stipendText || `$${item.stipend.toLocaleString()}/mo`,
          tags: item.tags,
          rawId: item.id
        });
      }
    });

    hackathons.forEach(item => {
      let score = 0;
      if (interestRole === 'AI & Research' && item.category === 'AI & ML') score += 3;
      if (interestRole === 'Engineering' && item.category === 'Web3 & Decentralization') score += 2;
      if (item.totalPrize >= 30000) score += 2;
      if (score >= 2) {
        matches.push({
          type: 'hackathon',
          title: item.title,
          source: item.roleType || 'Global Series',
          compensation: item.prizeText ? `Prize Pool: ${item.prizeText}` : `Prize Pool: $${item.totalPrize.toLocaleString()}`,
          tags: [item.category, item.deadline],
          rawId: item.id
        });
      }
    });

    scholarships.forEach(item => {
      let score = 0;
      if (item.category === 'STEM' && (interestRole === 'Engineering' || interestRole === 'AI & Research')) score += 3;
      if (item.category === 'Liberal Arts' && interestRole === 'Design') score += 3;
      if (item.amount >= 15000) score += 1;
      if (score >= 3) {
        matches.push({
          type: 'scholarship',
          title: item.title,
          source: item.provider,
          compensation: item.amountText ? `Grant: ₹${item.amountText}` : `Grant: $${item.amount.toLocaleString()}`,
          tags: item.tags,
          rawId: item.id
        });
      }
    });

    activities.forEach(item => {
      let score = 0;
      if (item.category === 'Coding Challenges' && (interestRole === 'Engineering' || interestRole === 'AI & Research')) score += 3;
      if (item.category === 'Workshops' && interestRole === 'Design') score += 2;
      if (score >= 2) {
        matches.push({
          type: 'activity',
          title: item.title,
          source: item.category,
          compensation: item.rewardText || 'Prestige Points',
          tags: [item.level],
          rawId: item.id
        });
      }
    });

    return matches;
  }, [internships, hackathons, scholarships, activities, interestRole, prefStipend, prefRemote]);

  if (currentPath === '/superadmin') {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    let isSuperAdmin = false;
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.role === 'superadmin') {
        isSuperAdmin = true;
      }
    }
    if (!isSuperAdmin) {
      navigateTo('/');
      return null;
    }

    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#e4e1e9] relative overflow-x-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#F5A623]/5 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#1E1E1E]/60 h-20 px-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigateTo('/')}
              className="flex items-center cursor-pointer active:opacity-80 transition-all"
            >
              <img src="/logo.svg" alt="CampusLoot Logo" className="w-5 h-5 mr-1.5 object-contain" />
              <h1 className="font-display text-lg md:text-xl font-bold tracking-[-0.03em] text-[#F5A623]">
                CampusLoot SuperAdmin
              </h1>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-[4px] border text-[9px] font-bold tracking-[0.08em] uppercase bg-[#1A1A1A] border-[#F5A623]/40 text-[#F5A623] animate-pulse">
              Root Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => reloadSaData()}
              disabled={saLoadingUsers || saLoadingAdmins}
              className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-lg text-xs transition-colors cursor-pointer border border-[#2A2A2A]"
              title="Refresh Directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${saLoadingUsers || saLoadingAdmins ? 'animate-spin text-[#F5A623]' : ''}`} />
            </button>
            <button 
              onClick={() => navigateTo('/')}
              className="bg-transparent border border-[#2A2A2A] hover:border-[#F5A623] hover:text-[#F5A623] px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer active:opacity-90 font-medium font-sans"
            >
              Exit Console
            </button>
          </div>
        </header>

        <main className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Main Title & Status Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-8 h-8 text-[#F5A623]" /> Central Root Command
              </h2>
              <p className="font-sans text-xs text-[#888888] mt-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F5A623]" />
                Highest Privilege Authorization Mode — Sonu Yadav Root Session
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-panel px-4 py-2 rounded-xl border border-[#1E1E1E] text-left">
                <span className="text-[10px] text-[#888888] uppercase block">Mainframe Directory</span>
                <span className="text-white text-xs font-bold font-sans">
                  {saAdmins.length} Admins | {saUsers.length} Users
                </span>
              </div>
            </div>
          </div>

          {/* Action Status Banner */}
          {saMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              saMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <div className="flex items-center gap-2">
                {saMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                <span>{saMessage.text}</span>
              </div>
              <button onClick={() => setSaMessage(null)} className="text-[#888888] hover:text-white font-bold ml-4">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Grid Layout of Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column Controls */}
            <div className="space-y-6">
              
              {/* Section 1: Create New Admin */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 border-b border-[#1E1E1E]/40 pb-3">
                  <UserPlus className="w-5 h-5 text-[#F5A623]" /> Create New Administrator
                </h3>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Identity Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Yash Raj" 
                      value={saCreateName}
                      onChange={e => setSaCreateName(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="e.g. yash@campusloot.com" 
                      value={saCreateEmail}
                      onChange={e => setSaCreateEmail(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Temporary Password</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={saCreatePassword}
                      onChange={e => setSaCreatePassword(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={saLoadingAction}
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#F5A623]/50 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saLoadingAction ? 'Processing payload...' : 'Create Admin Account'}
                  </button>
                </form>
              </div>

              {/* Section 2: Upgrade User to Admin */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 border-b border-[#1E1E1E]/40 pb-3">
                  <Shield className="w-5 h-5 text-[#F5A623]" /> Upgrade User to Admin
                </h3>
                <form onSubmit={handleUpgradeUser} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Search Mainframe Directory</label>
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      value={saSearchUserQuery}
                      onChange={e => setSaSearchUserQuery(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans mb-2"
                    />
                    <select 
                      required
                      value={saUpgradeUserId}
                      onChange={e => setSaUpgradeUserId(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans cursor-pointer"
                    >
                      <option value="">-- Select User to Upgrade ({saUsers.length} available) --</option>
                      {saUsers.filter(u => 
                        (u.name || '').toLowerCase().includes(saSearchUserQuery.toLowerCase()) || 
                        (u.email || '').toLowerCase().includes(saSearchUserQuery.toLowerCase())
                      ).map(u => (
                        <option key={u._id} value={u._id}>{u.name || 'Anonymous User'} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={saLoadingAction || !saUpgradeUserId}
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#2A2A2A] disabled:text-[#666666] disabled:cursor-not-allowed text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saLoadingAction ? 'Updating mainframe...' : 'Upgrade Selected User'}
                  </button>
                </form>
              </div>

              {/* Section 3: Downgrade Admin to User */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 border-b border-[#1E1E1E]/40 pb-3">
                  <UserMinus className="w-5 h-5 text-[#F5A623]" /> Downgrade Admin to User
                </h3>
                <form onSubmit={handleDowngradeAdmin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Search Mainframe Directory</label>
                    <input 
                      type="text" 
                      placeholder="Search admins by name or email..." 
                      value={saSearchAdminQuery}
                      onChange={e => setSaSearchAdminQuery(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans mb-2"
                    />
                    <select 
                      required
                      value={saDowngradeAdminId}
                      onChange={e => setSaDowngradeAdminId(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans cursor-pointer"
                    >
                      <option value="">-- Select Admin to Downgrade ({saAdmins.length} available) --</option>
                      {saAdmins.filter(a => 
                        (a.name || '').toLowerCase().includes(saSearchAdminQuery.toLowerCase()) || 
                        (a.email || '').toLowerCase().includes(saSearchAdminQuery.toLowerCase())
                      ).map(a => (
                        <option key={a._id} value={a._id}>{a.name || 'Anonymous Admin'} ({a.email})</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={saLoadingAction || !saDowngradeAdminId}
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#2A2A2A] disabled:text-[#666666] disabled:cursor-not-allowed text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saLoadingAction ? 'Revoking credentials...' : 'Revoke Admin Privileges'}
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column Controls */}
            <div className="space-y-6">
              
              {/* Section 4: Delete Admin (Active Admin List) */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-4 flex flex-col h-[380px]">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 border-b border-[#1E1E1E]/40 pb-3 shrink-0">
                  <ShieldAlert className="w-5 h-5 text-[#F5A623]" /> Active Administrators List
                </h3>
                
                {saLoadingAdmins ? (
                  <div className="flex-grow flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-[#F5A623] animate-spin" />
                  </div>
                ) : saAdmins.length === 0 ? (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-xs text-[#666666] italic">No active administration profiles detected.</p>
                  </div>
                ) : (
                  <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-custom">
                    {saAdmins.map(admin => (
                      <div 
                        key={admin._id}
                        className="bg-[#0B0B0B]/60 border border-[#1E1E1E] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#F5A623]/40 transition-all text-xs"
                      >
                        <div className="text-left min-w-0">
                          <h4 className="font-display font-bold text-white truncate">{admin.name || 'Anonymous Admin'}</h4>
                          <p className="text-[10px] text-[#888888] font-sans truncate mt-0.5">{admin.email}</p>
                          <span className="inline-block bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-[9px] font-bold tracking-wider px-2 py-0.5 rounded mt-1.5 font-display uppercase">
                            Admin Account
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="p-2.5 bg-[#1A1A1A] hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Purge Admin Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 5: Update Admin Details */}
              <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2 border-b border-[#1E1E1E]/40 pb-3">
                  <Pencil className="w-5 h-5 text-[#F5A623]" /> Modify Admin details
                </h3>
                <form onSubmit={handleUpdateAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Select Target Account</label>
                    <select 
                      required
                      value={saUpdateAdminId}
                      onChange={e => {
                        const id = e.target.value;
                        setSaUpdateAdminId(id);
                        const admin = saAdmins.find(a => a._id === id);
                        if (admin) {
                          setSaUpdateName(admin.name || '');
                          setSaUpdateEmail(admin.email || '');
                        } else {
                          setSaUpdateName('');
                          setSaUpdateEmail('');
                        }
                      }}
                      className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans cursor-pointer"
                    >
                      <option value="">-- Select Admin to Edit --</option>
                      {saAdmins.map(a => (
                        <option key={a._id} value={a._id}>{a.name || 'Anonymous Admin'} ({a.email})</option>
                      ))}
                    </select>
                  </div>

                  {!!saUpdateAdminId && (
                    <div className="space-y-4 animate-fade-in pt-2 border-t border-[#1E1E1E]/40">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Modify Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Admin Name" 
                          value={saUpdateName}
                          onChange={e => setSaUpdateName(e.target.value)}
                          className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] font-sans">Modify Email</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="Admin Email" 
                          value={saUpdateEmail}
                          onChange={e => setSaUpdateEmail(e.target.value)}
                          className="w-full bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={saLoadingAction || !saUpdateAdminId}
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#2A2A2A] disabled:text-[#666666] disabled:cursor-not-allowed text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saLoadingAction ? 'Updating mainframe data...' : 'Commit Changes to Account'}
                  </button>
                </form>
              </div>

            </div>

          </div>

        </main>
      </div>
    );
  }

  if (currentPath === '/login') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#F5A623] rounded-t-2xl"></div>
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 mb-4">
              <img src="/logo.svg" alt="CampusLoot Logo" className="w-8 h-8 object-contain" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
              Student Sign In
            </h2>
            <p className="font-sans text-xs text-[#888888]">
              Sign in to explore and apply for opportunities
            </p>
          </div>
          
          {studentError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{studentError}</span>
            </div>
          )}
          
          <form onSubmit={handleStudentLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                EMAIL ADDRESS
              </label>
              <input 
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                PASSWORD
              </label>
              <input 
                type="password"
                required
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans"
              />
            </div>
            
            <button 
              type="submit"
              disabled={studentLoading}
              className="w-full py-4 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#F5A623]/50 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {studentLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-3">
            <div>
              <button 
                onClick={() => navigateTo('/register')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                New to the platform? Register Here
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigateTo('/')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Back to CampusLoot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPath === '/register') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative w-full max-w-2xl bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#F5A623] rounded-t-2xl"></div>
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 mb-4">
              <img src="/logo.svg" alt="CampusLoot Logo" className="w-8 h-8 object-contain" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
              Create Student Account
            </h2>
            <p className="font-sans text-xs text-[#888888]">
              Register to access internships, hackathons, and scholarships
            </p>
          </div>
          
          {studentRegError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{studentRegError}</span>
            </div>
          )}

          {studentRegSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{studentRegSuccess}</span>
            </div>
          )}
          
          <form onSubmit={handleStudentRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Row 1: Full Identity Name & Email Address */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  FULL NAME
                </label>
                <input 
                  type="text"
                  required
                  value={studentRegName}
                  onChange={(e) => setStudentRegName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  EMAIL ADDRESS
                </label>
                <input 
                  type="email"
                  required
                  value={studentRegEmail}
                  onChange={(e) => setStudentRegEmail(e.target.value)}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 2: Secret Passphrase & University / College */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  PASSWORD
                </label>
                <input 
                  type="password"
                  required
                  value={studentRegPassword}
                  onChange={(e) => setStudentRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  UNIVERSITY / COLLEGE
                </label>
                <input 
                  type="text"
                  required
                  value={studentRegCollege}
                  onChange={(e) => setStudentRegCollege(e.target.value)}
                  placeholder="e.g. DTU"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 3: Current Year */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  CURRENT YEAR
                </label>
                <input 
                  type="text"
                  required
                  value={studentRegYear}
                  onChange={(e) => setStudentRegYear(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 4: Academic Branch / Specialization */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  ACADEMIC BRANCH / SPECIALIZATION
                </label>
                <input 
                  type="text"
                  required
                  value={studentRegBranch}
                  onChange={(e) => setStudentRegBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={studentRegLoading}
              className="w-full py-4 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#F5A623]/50 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {studentRegLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-3">
            <div>
              <button 
                onClick={() => navigateTo('/login')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Already have an account? Log In
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigateTo('/')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Back to CampusLoot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPath === '/admin/login') {
    // Security guard: if a normal (non-admin) user is logged in, show Unauthorized instead of admin login
    const _userTok = localStorage.getItem('userToken');
    const _adminTok = localStorage.getItem('adminToken');
    if (_userTok && !_adminTok) {
      const _decoded = decodeJWT(_userTok);
      if (_decoded && _decoded.role !== 'admin' && !_decoded.isAdmin) {
        return (
          <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
            <div className="text-center">
              <ShieldCheck className="w-14 h-14 text-rose-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-white mb-2">Unauthorized</h2>
              <p className="font-sans text-xs text-[#888888] mb-6">You do not have permission to access the admin console.</p>
              <button onClick={() => navigateTo('/')} className="px-6 py-2.5 bg-[#F5A623] text-[#0B0B0B] rounded-xl font-bold text-xs hover:bg-[#D4881A] transition-all">
                Back to CampusLoot
              </button>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#F5A623] rounded-t-2xl"></div>
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="font-sans text-xs text-[#888888]">
              Login to access admin dashboard
            </p>
          </div>
          
          {adminError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}
          
          <form onSubmit={handleAdminLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                EMAIL ADDRESS
              </label>
              <input 
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@campusloot.com"
                className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                SECRET PASSPHRASE
              </label>
              <input 
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5A623] transition-all font-sans"
              />
            </div>
            
            <button 
              type="submit"
              disabled={adminLoading}
              className="w-full py-4 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#F5A623]/50 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {adminLoading ? 'Authenticating...' : 'Authenticate Console'}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-3">
            <div>
              <button 
                onClick={() => navigateTo('/admin/register')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                New to the platform matrix? Request Access Here
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigateTo('/')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Back to CampusLoot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPath === '/admin/register') {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative w-full max-w-2xl bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-[#F5A623] rounded-t-2xl"></div>
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
              Request Access
            </h2>
            <p className="font-sans text-xs text-[#888888]">
              Initialize administration credentials for the platform matrix
            </p>
          </div>
          
          {registerError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{registerError}</span>
            </div>
          )}

          {registerSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{registerSuccess}</span>
            </div>
          )}
          
          <form onSubmit={handleAdminRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Row 1: Full Identity Name & Email Address */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  FULL IDENTITY NAME
                </label>
                <input 
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g. Yogesh Kumar"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  EMAIL ADDRESS
                </label>
                <input 
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="e.g. yogesh@campusloot.com"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 2: Secret Passphrase & University / College */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  SECRET PASSPHRASE
                </label>
                <input 
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  UNIVERSITY / COLLEGE
                </label>
                <input 
                  type="text"
                  required
                  value={registerCollege}
                  onChange={(e) => setRegisterCollege(e.target.value)}
                  placeholder="e.g. IIT Delhi"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 3: Current Year */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  CURRENT YEAR
                </label>
                <input 
                  type="text"
                  required
                  value={registerYear}
                  onChange={(e) => setRegisterYear(e.target.value)}
                  placeholder="e.g. 3rd Year"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              {/* Row 4: Academic Branch / Specialization */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  ACADEMIC BRANCH / SPECIALIZATION
                </label>
                <input 
                  type="text"
                  required
                  value={registerBranch}
                  onChange={(e) => setRegisterBranch(e.target.value)}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full p-3.5 bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={registerLoading}
              className="w-full py-4 bg-[#F5A623] hover:bg-[#D4881A] disabled:bg-[#F5A623]/50 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {registerLoading ? 'Authorizing Creation...' : 'Authorize Account Creation'}
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-3">
            <div>
              <button 
                onClick={() => navigateTo('/admin/login')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Already possess execution credentials? Log In Terminal
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigateTo('/')}
                className="text-xs text-[#888888] hover:text-[#F5A623] transition-colors"
              >
                Back to CampusLoot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPath.startsWith('/admin') && currentPath !== '/admin/login' && currentPath !== '/admin/register') {
    const token = localStorage.getItem('adminToken');
    // BUG 3 FIX: Validate admin token — must exist AND have admin role
    const isValidAdmin = (() => {
      if (!token) return false;
      const decoded = decodeJWT(token);
      return decoded && (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.isAdmin);
    })();

    if (!isValidAdmin) {
      // Check if a normal user is logged in — redirect to home, not admin login
      const userTok = localStorage.getItem('userToken');
      if (userTok) {
        const userDecoded = decodeJWT(userTok);
        if (userDecoded) {
          navigateTo('/');
          return null;
        }
      }
      // No token at all — redirect to admin login
      navigateTo('/admin/login');
      return null;
    }

    // Filter existing entries based on target pipeline
    const existingEntriesList = (() => {
      if (targetPipeline === 'internships') return internships;
      if (targetPipeline === 'hackathons') return hackathons;
      if (targetPipeline === 'scholarships') return scholarships;
      if (targetPipeline === 'activities') return activities;
      return [];
    })();

    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#e4e1e9] relative overflow-x-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
        <div className="grain"></div>
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Dashboard Header */}
        <header className="fixed top-0 w-full z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#1E1E1E]/60 h-20 px-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigateTo('/')}
              className="flex items-center cursor-pointer active:opacity-80 transition-all"
            >
              <img src="/logo.svg" alt="CampusLoot Logo" className="w-5 h-5 mr-1.5 object-contain" />
              <h1 className="font-display text-lg md:text-xl font-bold tracking-[-0.03em] text-[#F5A623]">
                CampusLoot Command
              </h1>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-[4px] border text-[9px] font-bold tracking-[0.08em] uppercase bg-[#1A1A1A] border-emerald-500/40 text-emerald-400 animate-pulse">
              Command Session
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-[#888888] font-sans">
              Console ID: <strong className="text-white">{adminName}</strong>
            </span>
            <button 
              onClick={handleDisconnect}
              className="bg-transparent border border-[#2A2A2A] hover:border-rose-500 hover:text-rose-400 px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer active:opacity-90 font-medium"
            >
              Terminate Session
            </button>
          </div>
        </header>

        {/* Console Container */}
        <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E1E1E] space-y-8">
            {/* Command Header */}
            <div className="flex justify-between items-start border-b border-[#1E1E1E]/40 pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Central Command Console
                </h2>
                <p className="font-sans text-xs text-[#888888] mt-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#F5A623]" />
                  Standard Administrator Access Mode
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-glow-emerald animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-display">Database Live</span>
              </div>
            </div>

            {/* Target Stream Pipeline Dropdown */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">
                TARGET STREAM PIPELINE
              </label>
              <select 
                value={targetPipeline}
                onChange={(e) => {
                  setTargetPipeline(e.target.value as any);
                  handleResetForm();
                }}
                className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3.5 text-xs outline-none focus:border-[#F5A623] font-display transition-all cursor-pointer font-bold"
              >
                <option value="internships">Internship Packet</option>
                <option value="hackathons">Hackathon Packet</option>
                <option value="scholarships">Scholarship Packet</option>
                <option value="activities">Extra Activities Packet</option>
                <option value="contacts">Contact Messages Packet</option>
              </select>
            </div>

            {targetPipeline !== 'contacts' ? (
              <>
                {/* Render CRUD form */}
                <form onSubmit={handleConsoleFormSubmit} className="space-y-6" id="command-console-form">
              {consoleSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{consoleSuccessMsg}</span>
                </div>
              )}
              {consoleErrorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{consoleErrorMsg}</span>
                </div>
              )}

              {!!formId && (
                <div className="p-3.5 bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] rounded-xl text-xs flex items-center justify-between">
                  <span>Currently editing Entry ID: <strong className="text-white font-mono">{formId}</strong></span>
                  <button 
                    type="button" 
                    onClick={handleResetForm}
                    className="underline hover:text-white font-bold cursor-pointer"
                  >
                    Cancel Edit Mode
                  </button>
                </div>
              )}

              {targetPipeline === 'internships' && (
                <div className="space-y-4">
                  {/* Internship Title */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Opportunity Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)} 
                      placeholder="e.g. Software Engineer Intern"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>

                  {/* Company & Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Company Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formCompany} 
                        onChange={(e) => setFormCompany(e.target.value)} 
                        placeholder="e.g. Google"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Domain</label>
                      <input 
                        type="text" 
                        required 
                        value={formDomain} 
                        onChange={(e) => setFormDomain(e.target.value)} 
                        placeholder="e.g. Engineering"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                  </div>

                  {/* Stipend Rate & Location Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Stipend Rate</label>
                      <input 
                        type="text" 
                        required 
                        value={formStipend} 
                        onChange={(e) => setFormStipend(e.target.value)} 
                        placeholder="e.g. ₹45,000/Month"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Location Type</label>
                      <select 
                        value={formLocationType} 
                        onChange={(e) => setFormLocationType(e.target.value)} 
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all cursor-pointer"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Onsite">Onsite</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Duration</label>
                    <input 
                      type="text" 
                      required 
                      value={formDuration} 
                      onChange={(e) => setFormDuration(e.target.value)} 
                      placeholder="e.g. 3 Months"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>
                </div>
              )}

              {targetPipeline === 'hackathons' && (
                <div className="space-y-4">
                  {/* Hackathon Title */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Opportunity Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)} 
                      placeholder="e.g. HackMIT 2026"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>

                  {/* Organizer & Prize Pool */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Organizer</label>
                      <input 
                        type="text" 
                        required 
                        value={formOrganizer} 
                        onChange={(e) => setFormOrganizer(e.target.value)} 
                        placeholder="e.g. MIT University"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Total Prize Pool</label>
                      <input 
                        type="text" 
                        required 
                        value={formPrizePool} 
                        onChange={(e) => setFormPrizePool(e.target.value)} 
                        placeholder="e.g. $50,000"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                  </div>

                  {/* Team Size & Execution Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Team Size</label>
                      <input 
                        type="text" 
                        required 
                        value={formTeamSize} 
                        onChange={(e) => setFormTeamSize(e.target.value)} 
                        placeholder="e.g. 1-4 Members"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Execution Mode</label>
                      <select 
                        value={formMode} 
                        onChange={(e) => setFormMode(e.target.value)} 
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  {/* Platform Infrastructure & Event Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Platform Infrastructure</label>
                      <input 
                        type="text" 
                        value={formPlatform} 
                        onChange={(e) => setFormPlatform(e.target.value)} 
                        placeholder="e.g. Devfolio"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Live Event Date</label>
                      <input 
                        type="datetime-local" 
                        value={formEventDate} 
                        onChange={(e) => setFormEventDate(e.target.value)} 
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {targetPipeline === 'scholarships' && (
                <div className="space-y-4">
                  {/* Scholarship Title */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Opportunity Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)} 
                      placeholder="e.g. Reliance Foundation Scholarship"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>

                  {/* Provider & Funding Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Scholarship Provider</label>
                      <input 
                        type="text" 
                        required 
                        value={formProvider} 
                        onChange={(e) => setFormProvider(e.target.value)} 
                        placeholder="e.g. Reliance Trust"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Funding Amount</label>
                      <input 
                        type="text" 
                        required 
                        value={formAmount} 
                        onChange={(e) => setFormAmount(e.target.value)} 
                        placeholder="e.g. ₹2,00000/Yr"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                  </div>

                  {/* Target Category */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Target Student Category</label>
                    <input 
                      type="text" 
                      required 
                      value={formCategory} 
                      onChange={(e) => setFormCategory(e.target.value)} 
                      placeholder="e.g. STEM"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>

                  {/* Nested Eligibility section */}
                  <div className="border border-[#2A2A2A] rounded-xl p-4 bg-[#0B0B0B] space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623] font-display">NESTED ELIGIBILITY SCHEMA</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Annual Income Limit</label>
                        <input 
                          type="text" 
                          value={formIncomeLimit} 
                          onChange={(e) => setFormIncomeLimit(e.target.value)} 
                          placeholder="e.g. < 8 LPA"
                          className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Minimum Academic Marks</label>
                        <input 
                          type="text" 
                          value={formMinMarks} 
                          onChange={(e) => setFormMinMarks(e.target.value)} 
                          placeholder="e.g. 60% in 12th"
                          className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                        />
                      </div>
                    </div>

                    {/* Allowed Courses tag input */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Allowed Courses</label>
                      <input 
                        type="text" 
                        value={formCourseInput}
                        onChange={(e) => setFormCourseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = formCourseInput.trim();
                            if (val && !formCoursesAllowed.includes(val)) {
                              setFormCoursesAllowed([...formCoursesAllowed, val]);
                            }
                            setFormCourseInput('');
                          }
                        }}
                        placeholder="Type course and press Enter or comma (e.g. B.Tech)"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formCoursesAllowed.map(course => (
                          <span key={course} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] rounded-md px-2 py-0.5 text-[10px] flex items-center gap-1 font-display">
                            {course}
                            <button 
                              type="button" 
                              onClick={() => setFormCoursesAllowed(formCoursesAllowed.filter(c => c !== course))}
                              className="text-rose-400 hover:text-white font-bold ml-1 text-xs"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {targetPipeline === 'activities' && (
                <div className="space-y-4">
                  {/* Extra Activity Title */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Opportunity Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)} 
                      placeholder="e.g. Web3 Cryptography Challenge"
                      className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                    />
                  </div>

                  {/* Hosting Organizer & Activity Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Hosting Organizer</label>
                      <input 
                        type="text" 
                        required 
                        value={formOrganizer} 
                        onChange={(e) => setFormOrganizer(e.target.value)} 
                        placeholder="e.g. Solidity Labs"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Activity Type</label>
                      <input 
                        type="text" 
                        required 
                        value={formActivityType} 
                        onChange={(e) => setFormActivityType(e.target.value)} 
                        placeholder="e.g. Coding Challenges"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                  </div>

                  {/* Liquid Cash Drop Reward & Execution Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Liquid Cash Drop Reward</label>
                      <input 
                        type="text" 
                        required 
                        value={formCashDropReward} 
                        onChange={(e) => setFormCashDropReward(e.target.value)} 
                        placeholder="e.g. ₹50,000"
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Execution Mode</label>
                      <select 
                        value={formMode} 
                        onChange={(e) => setFormMode(e.target.value)} 
                        className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-2.5 py-2">
                    <input 
                      type="checkbox" 
                      checked={formDeployCertificate} 
                      onChange={(e) => setFormDeployCertificate(e.target.checked)} 
                      className="w-4 h-4 text-[#F5A623] focus:ring-0 rounded border-[#2A2A2A] bg-[#111111]"
                      id="deploy-cert-tokens"
                    />
                    <label htmlFor="deploy-cert-tokens" className="text-white text-xs font-medium cursor-pointer font-sans select-none">
                      Deploy Participation Certification tokens
                    </label>
                  </div>
                </div>
              )}

              {/* Links: Apply Link & Tracking Link (Common to all) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Primary Portal Apply Link</label>
                  <input 
                    type="text" 
                    required 
                    value={formApplyLink} 
                    onChange={(e) => setFormApplyLink(e.target.value)} 
                    placeholder="https://..."
                    className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Tracking/Affiliate Link</label>
                  <input 
                    type="text" 
                    value={formAffiliateLink} 
                    onChange={(e) => setFormAffiliateLink(e.target.value)} 
                    placeholder="https://..."
                    className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                  />
                </div>
              </div>

              {/* Application Expiry Deadline (Common) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#666666] mb-1.5 font-display">Application Expiry Deadline</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={formDeadline} 
                  onChange={(e) => setFormDeadline(e.target.value)} 
                  className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-lg p-3 text-xs outline-none focus:border-[#F5A623] font-display transition-all"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={consoleLoading}
                style={{ background: 'linear-gradient(90deg, #F5A623, #D4881A)', letterSpacing: '0.08em' }}
                className="w-full py-4 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
              >
                {consoleLoading ? 'TRANSMITTING...' : 'TRANSMIT DATA PAYLOAD PACKET 🔥'}
              </button>
            </form>

            {/* EXISTING ENTRIES Section */}
            <div className="border-t border-[#1E1E1E]/40 pt-8 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">EXISTING ENTRIES</h3>
              <p className="font-sans text-xs text-[#888888]">
                List of all live entries loaded under the selected target stream pipeline pipeline
              </p>
              
              {existingEntriesList.length === 0 ? (
                <p className="text-xs text-[#666666] py-4 italic font-sans">No records found inside this collection stream.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-custom">
                  {existingEntriesList.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#F5A623] transition-all"
                    >
                      <div className="text-left min-w-0">
                        <h4 className="text-xs font-bold text-white truncate font-display">{item.title}</h4>
                        <p className="text-[10px] text-[#666666] mt-0.5 font-sans truncate">
                          {item.company || item.organizer || item.provider} • {item.domain || item.category || 'Opportunity'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button 
                          onClick={() => handlePreFillEdit(item, targetPipeline)}
                          className="p-2 bg-[#2A2A2A] hover:bg-[#F5A623] hover:text-[#0B0B0B] text-white rounded-lg text-xs transition-colors cursor-pointer"
                          title="Edit Entry"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteEntry(item.id, targetPipeline, e as any)}
                          className="p-2 bg-[#2A2A2A] hover:bg-rose-500 hover:text-white text-white rounded-lg text-xs transition-colors cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1E1E1E]/40 pb-4">
              <h3 className="font-display font-bold text-lg text-white">Contact Messages</h3>
              <span className="text-xs text-[#888888]">
                Total: {contactMessages.length} | Unread: {contactMessages.filter(m => !m.isRead).length}
              </span>
            </div>

            {contactMessages.length === 0 ? (
              <p className="text-xs text-[#666666] py-4 italic font-sans">No contact messages received yet.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
                {contactMessages.map((msg) => (
                  <div 
                    key={msg._id} 
                    className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 space-y-4 hover:border-[#F5A623]/60 transition-all text-xs"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm">{msg.name}</strong>
                          {!msg.isRead && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full bg-[#F5A623] status-glow-gold"
                              title="Unread message"
                            ></span>
                          )}
                        </div>
                        <p className="text-[#888888] font-sans text-[11px]">
                          Email: <a href={`mailto:${msg.email}`} className="text-[#F5A623] hover:underline">{msg.email}</a>
                        </p>
                      </div>
                      <div className="text-[#666666] text-[10px] font-sans">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-[#1E1E1E]/40">
                      <p className="text-[#F5A623] font-semibold">Subject: {msg.subject}</p>
                      <p className="text-[#ccc3d8] whitespace-pre-wrap leading-relaxed bg-[#0B0B0B] p-3 rounded-lg border border-[#1E1E1E]/60 mt-1 font-sans">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#1E1E1E]/20">
                      {!msg.isRead && (
                        <button 
                          onClick={() => handleMarkContactRead(msg._id)}
                          className="px-3.5 py-1.5 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623] hover:text-[#0B0B0B] rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => handleDeleteContact(msg._id)}
                        className="px-3.5 py-1.5 bg-transparent border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-[#F5A623] selection:text-[#0B0B0B]">
      {/* Texture Layer */}
      <div className="grain"></div>
      
      {/* Header element conforming strictly to template layout */}
      <header className="fixed top-0 w-full z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#1E1E1E]/60 h-20 px-4 md:px-10 flex justify-between items-center transition-all">
        <div className="flex items-center gap-6 md:gap-10">
          <div 
            onClick={() => { setActiveTab('internships'); setPersonalizedFeedback(false); navigateTo('/'); }}
            className="flex items-center cursor-pointer active:opacity-80 transition-all"
            id="brand-logo"
          >
            <img src="/logo.svg" alt="CampusLoot Logo" className="w-6 h-6 mr-2 object-contain animate-pulse" />
            <h1 className="font-display text-lg md:text-xl font-bold tracking-[-0.03em] text-[#F5A623]">
              CampusLoot
            </h1>
          </div>
          
          {/* Navigation Links responsive selection state */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => { setActiveTab('internships'); navigateTo('/'); }}
              className={`premium-nav-link transition-all cursor-pointer ${
                activeTab === 'internships' && currentPath === '/'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623] pb-1' 
                  : 'text-[#ccc3d8]/80 hover:text-[#F5A623]'
              }`}
            >
              Internships
            </button>
            <button 
              onClick={() => { setActiveTab('hackathons'); navigateTo('/'); }}
              className={`premium-nav-link transition-all cursor-pointer ${
                activeTab === 'hackathons' && currentPath === '/'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623] pb-1' 
                  : 'text-[#ccc3d8]/80 hover:text-[#F5A623]'
              }`}
            >
              Hackathons
            </button>
            <button 
              onClick={() => { setActiveTab('scholarships'); navigateTo('/'); }}
              className={`premium-nav-link transition-all cursor-pointer ${
                activeTab === 'scholarships' && currentPath === '/'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623] pb-1' 
                  : 'text-[#ccc3d8]/80 hover:text-[#F5A623]'
              }`}
            >
              Scholarships
            </button>
            <button 
              onClick={() => { setActiveTab('activities'); navigateTo('/'); }}
              className={`premium-nav-link transition-all cursor-pointer ${
                activeTab === 'activities' && currentPath === '/'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623] pb-1' 
                  : 'text-[#ccc3d8]/80 hover:text-[#F5A623]'
              }`}
            >
              Activities
            </button>
          </nav>
        </div>

        {/* Right side: search bar + auth buttons */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:block" id="search-bar-wrap">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc3d8] w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="bg-[#111111] border border-[#1E1E1E] rounded-full pl-9 pr-4 py-1.5 text-xs font-sans w-52 focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] text-[#e4e1e9] placeholder-[#ccc3d8]/60 transition-all focus:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc3d8]/80 hover:text-[#e4e1e9]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Auth state buttons — Console Login is intentionally NOT here */}
          {isAdminLoggedIn ? (
            // Admin logged in: show admin name + disconnect/dashboard
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight font-sans">{adminName}</p>
                <span
                  style={{ color: '#F5A623', fontSize: '11px', letterSpacing: '0.08em', fontFamily: "'Space Grotesk', sans-serif" }}
                  className="font-bold uppercase block mt-0.5 leading-none"
                >
                  ADMIN
                </span>
              </div>
              <button
                onClick={() => navigateTo('/admin/dashboard')}
                style={{ border: '1px solid #F5A623', background: 'rgba(245, 166, 35, 0.1)' }}
                className="text-[#F5A623] px-3.5 py-1.5 rounded-[8px] text-xs font-semibold hover:bg-[#F5A623] hover:text-[#0B0B0B] transition-all cursor-pointer"
              >
                Admin Panel
              </button>
              <button
                onClick={handleDisconnect}
                style={{ border: '1px solid #2A2A2A', background: 'transparent' }}
                className="text-white px-3 py-1.5 rounded-[8px] text-xs font-semibold hover:border-[#F5A623] hover:text-[#F5A623] transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : isStudentLoggedIn ? (
            // Logged-in student: show name + logout
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight font-sans">{studentName}</p>
                <span className="text-[10px] text-[#F5A623] font-semibold uppercase tracking-wider">Student</span>
              </div>
              <button
                onClick={handleStudentLogout}
                style={{ border: '1px solid #2A2A2A', background: 'transparent' }}
                className="text-white px-3 py-1.5 rounded-[8px] text-xs font-semibold hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            // Not logged in: Sign In + Get Started only (Console Login intentionally removed from user nav)
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('/login')}
                className="text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:text-[#F5A623] transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('/register')}
                className="bg-[#F5A623] text-[#0B0B0B] px-4 py-1.5 rounded-full text-xs hover:bg-[#D4881A] transition-colors cursor-pointer active:opacity-90 font-bold whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sub-Header Mobile Navigation bar */}
      <div className="flex md:hidden fixed top-20 left-0 w-full z-45 bg-[#0B0B0B]/95 border-b border-[#1E1E1E] overflow-x-auto py-3 px-4 gap-4 scrollbar-hide">
        <button 
          onClick={() => { setActiveTab('internships'); navigateTo('/'); }}
          className={`text-[11px]  tracking-wider shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'internships' && currentPath === '/' ? 'bg-[#F5A623]/25 border border-[#F5A623]/60 text-[#F5A623]' : 'text-[#ccc3d8]'
          }`}
        >
          Internships
        </button>
        <button 
          onClick={() => { setActiveTab('hackathons'); navigateTo('/'); }}
          className={`text-[11px]  tracking-wider shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'hackathons' && currentPath === '/' ? 'bg-[#F5A623]/25 border border-[#F5A623]/60 text-[#F5A623]' : 'text-[#ccc3d8]'
          }`}
        >
          Hackathons
        </button>
        <button 
          onClick={() => { setActiveTab('scholarships'); navigateTo('/'); }}
          className={`text-[11px]  tracking-wider shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'scholarships' && currentPath === '/' ? 'bg-[#F5A623]/25 border border-[#F5A623]/60 text-[#F5A623]' : 'text-[#ccc3d8]'
          }`}
        >
          Scholarships
        </button>
        <button 
          onClick={() => { setActiveTab('activities'); navigateTo('/'); }}
          className={`text-[11px]  tracking-wider shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'activities' && currentPath === '/' ? 'bg-[#F5A623]/25 border border-[#F5A623]/60 text-[#F5A623]' : 'text-[#ccc3d8]'
          }`}
        >
          Activities
        </button>
      </div>

      {/* Main Container */}
      <main className="pt-32 md:pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-10 transition-all">

        {/* Dynamic Warning of active filter/personalized feed mode */}
        {personalizedFeedback && (
          <div className="mb-6 px-4 py-3 bg-[#111111]/60 border border-[#F5A623]/40 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5A623] animate-pulse" />
              <span>
                Personalized Feed Active: Showing exclusive opportunities matching <strong className="text-[#F5A623]">{interestRole}</strong>, with stipends from <strong className="text-emerald-400">${prefStipend}/mo</strong>.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPersonalizeFeedOpen(true)}
                className="text-[#F5A623] hover:underline hover:text-[#F5A623]  font-bold"
              >
                Modify Prefs
              </button>
              <button 
                onClick={() => setPersonalizedFeedback(false)}
                className="text-[#ccc3d8] hover:text-[#e4e1e9]  font-bold hover:underline"
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}

        {currentPath === '/about' ? (
          <div className="animate-fade-in text-left max-w-4xl mx-auto space-y-12">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">About CampusLoot</h1>
              <p className="font-sans text-sm text-[#ccc3d8] leading-relaxed">
                CampusLoot is the premier opportunities discovery network built specifically for university students. 
                Our mission is to curate the most prestigious, high-stakes student opportunities across the globe, 
                ranging from high-stipend engineering internships and elite hackathons to fully-funded scholarships 
                and advanced research initiatives.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-8 space-y-4">
              <h3 className="font-display text-xl font-bold text-white">Our Mission</h3>
              <p className="font-sans text-sm text-[#ccc3d8] leading-relaxed">
                We believe that premium opportunities shouldn't be hidden behind complex search algorithms or networks of privilege. 
                Our mission is to democratize access to elite student programs, fellowships, and placements, bridging 
                the gap between high-potential academic talent and top-tier industry organizations, technology ecosystems, and research labs.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] font-bold">1</div>
                  <h4 className="font-display text-sm font-semibold text-white">Explore & Filter</h4>
                  <p className="font-sans text-xs text-[#ccc3d8] leading-relaxed">
                    Filter opportunities by domain (Engineering, Design, Finance, AI & Research) and find options with stipends tailored to your needs.
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] font-bold">2</div>
                  <h4 className="font-display text-sm font-semibold text-white">Apply & Track</h4>
                  <p className="font-sans text-xs text-[#ccc3d8] leading-relaxed">
                    Access primary application portals directly with our pre-verified links. Build bookmarks and keep track of all your applications.
                  </p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623] font-bold">3</div>
                  <h4 className="font-display text-sm font-semibold text-white">Earn Loot & XP</h4>
                  <p className="font-sans text-xs text-[#ccc3d8] leading-relaxed">
                    Submit verified progress, complete academic quiz challenges, unlock credits, and watch your platform reputation levels grow.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">The Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623] text-2xl mx-auto">SY</div>
                  <h4 className="font-display text-sm font-semibold text-white">Sonu Yadav</h4>
                  <p className="font-sans text-[10px] text-[#F5A623] uppercase font-bold tracking-wider">Founder & Backend Developer</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623] text-2xl mx-auto">YK</div>
                  <h4 className="font-display text-sm font-semibold text-white">Yogesh Kumar</h4>
                  <p className="font-sans text-[10px] text-[#F5A623] uppercase font-bold tracking-wider">Co-Founder & UI Engineer</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-[#1E1E1E] text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623] text-2xl mx-auto">YR</div>
                  <h4 className="font-display text-sm font-semibold text-white">Yash Raj</h4>
                  <p className="font-sans text-[10px] text-[#F5A623] uppercase font-bold tracking-wider">Content & Data Manager</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentPath === '/contact' ? (
          <div className="animate-fade-in text-left max-w-2xl mx-auto space-y-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Contact CampusLoot</h1>
              <p className="font-sans text-sm text-[#ccc3d8]">
                Have a question about a listing, want to partner with us, or found a bug? Drop us a packet below.
              </p>
            </div>

            {contactSuccess && (
              <div className="p-4 bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{contactSuccess}</span>
              </div>
            )}

            {contactError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{contactError}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">FULL NAME</label>
                  <input 
                    type="text" 
                    required 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)} 
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full p-3.5 bg-[#111111] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required 
                    value={contactEmail} 
                    onChange={(e) => setContactEmail(e.target.value)} 
                    placeholder="you@example.com"
                    className="w-full p-3.5 bg-[#111111] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">SUBJECT</label>
                <input 
                  type="text" 
                  required 
                  value={contactSubject} 
                  onChange={(e) => setContactSubject(e.target.value)} 
                  placeholder="e.g. Partnership Request / Bug Report"
                  className="w-full p-3.5 bg-[#111111] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888]">MESSAGE PACKET</label>
                <textarea 
                  required 
                  rows={6}
                  value={contactMessage} 
                  onChange={(e) => setContactMessage(e.target.value)} 
                  placeholder="Write your transmission details here..."
                  className="w-full p-3.5 bg-[#111111] border border-[#1E1E1E] rounded-xl text-xs text-white placeholder-[#888888]/50 focus:outline-none focus:border-[#F5A623] transition-all font-sans resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={contactSubmitLoading}
                style={{ background: 'linear-gradient(90deg, #F5A623, #D4881A)' }}
                className="w-full py-4 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 disabled:opacity-50"
              >
                {contactSubmitLoading ? 'TRANSMITTING...' : 'SEND TRANSMISSION MESSAGE'}
              </button>
            </form>
          </div>
        ) : currentPath === '/privacy' ? (
          <div className="animate-fade-in text-left max-w-4xl mx-auto space-y-8 font-sans text-xs text-[#ccc3d8] leading-relaxed">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Privacy Policy</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#F5A623]">Last Updated: June 2026</p>
            </div>

            <p>
              At CampusLoot, we prioritize the privacy and security of our student developers and partners. 
              This document outlines how we collect, store, and utilize your platform profiles and metadata.
            </p>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">1. Data We Collect</h3>
              <p>We collect information necessary to personalize your dashboard and enable application tracking. This includes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Profile details: Name, Email address, and account passwords.</li>
                <li>Academic status: University name, current academic year, and branch of specialization.</li>
                <li>Platform activity: Bookmarked opportunities, apply clicks, and completed academic quizzes.</li>
              </ul>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">2. How We Use Your Data</h3>
              <p>Your profile data is strictly utilized to operate the platform features, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Providing customized filters and recommendations matching your field (e.g. Engineering vs. Design).</li>
                <li>Updating and persisting your user Loot Credits and prestige XP status.</li>
                <li>Securing credentials and verifying admin control status on Console pages.</li>
              </ul>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">3. Cookies and Storage</h3>
              <p>
                We use secure localStorage tokens to maintain session authorization states so you remain logged in. 
                No tracking cookies are shared with advertisers or third parties.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">4. Data Retention & User Rights</h3>
              <p>
                You possess full rights to access, export, or delete your account data. Under your rights, you can request 
                data purge by emailing our data administration inbox. Your data is retained only as long as your account remains active.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">5. Contact Information</h3>
              <p>For privacy queries, contact our policy compliance team at <a href="mailto:contact@campusloot.com" className="text-[#F5A623] hover:underline">contact@campusloot.com</a>.</p>
            </div>
          </div>
        ) : currentPath === '/terms' ? (
          <div className="animate-fade-in text-left max-w-4xl mx-auto space-y-8 font-sans text-xs text-[#ccc3d8] leading-relaxed">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Terms of Service</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#F5A623]">Last Updated: June 2026</p>
            </div>

            <p>
              By accessing CampusLoot ("Platform"), you agree to follow and be bound by these Terms of Service. 
              Please read these conditions carefully before initializing your student session.
            </p>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">1. Use of the Platform</h3>
              <p>
                CampusLoot is dedicated to student educational and career sifting. You may utilize the listings, application tracking, 
                and quiz systems only for personal, non-commercial purposes. Automated scraping or API abuse is strictly prohibited.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">2. User Accounts and Verification</h3>
              <p>
                You agree to provide true, accurate information during account registration. You are solely responsible for 
                maintaining authorization security over your session credentials. Sharing accounts is not permitted.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">3. Intellectual Property</h3>
              <p>
                All design components, text, brand identifiers, logo SVGs, and proprietary quiz data structures are the intellectual 
                property of CampusLoot. No assets may be copied or reused without prior written consent.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">4. Warranty Disclaimer & Liability</h3>
              <p>
                All student opportunities listed are provided "as-is". CampusLoot is a discovery aggregate and does not guarantee 
                admission, placement, scholarships, or internship hiring. We are not liable for any indirect damages resulting from platform downtime.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">5. Governing Law</h3>
              <p>
                These terms shall be governed and interpreted in accordance with the laws of India. Any legal disputes arising 
                under these terms shall be subject to the exclusive jurisdiction of the courts of India.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">6. Contact Information</h3>
              <p>For Terms of Service clarifications, email us at <a href="mailto:contact@campusloot.com" className="text-[#F5A623] hover:underline">contact@campusloot.com</a>.</p>
            </div>
          </div>
        ) : currentPath === '/careers' ? (
          <div className="animate-fade-in text-center max-w-2xl mx-auto space-y-8 py-12">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center text-[#F5A623] text-2xl mx-auto animate-bounce">
              💼
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Join Our Mission</h1>
              <p className="font-sans text-sm text-[#ccc3d8] leading-relaxed max-w-md mx-auto">
                We're not hiring right now but we're always looking for passionate people.
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => navigateTo('/contact')}
                style={{ background: 'linear-gradient(90deg, #F5A623, #D4881A)' }}
                className="px-8 py-3.5 text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:opacity-95"
              >
                Send us your resume
              </button>
            </div>
          </div>
        ) : currentPath === '/cookies' ? (
          <div className="animate-fade-in text-left max-w-4xl mx-auto space-y-8 font-sans text-xs text-[#ccc3d8] leading-relaxed">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">Cookie Policy</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#F5A623]">Last Updated: June 2026</p>
            </div>

            <p>
              CampusLoot utilizes cookies and local storage state components to optimize session performance 
              and verify authentication credentials. This Cookie Policy explains the details of these storage mechanisms.
            </p>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">1. What Cookies We Use</h3>
              <p>
                We use small data fragments called cookies (stored on your client device) and localStorage key-value storage 
                to enable standard website operations.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">2. Essential Cookies</h3>
              <p>
                These are mandatory parameters required for the basic functionality of the platform, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Authentication Tokens</strong>: We store JWT tokens (`userToken` and `adminToken` in localStorage) to recognize active sessions.</li>
                <li><strong>User Settings Caching</strong>: Temporarily caching preference coordinates, bookmarked opportunity indexes, and state filters.</li>
              </ul>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">3. Analytics Cookies</h3>
              <p>
                We utilize minimal client tracking queries to count traffic metrics, search keywords, and dashboard redirects. 
                All parameters collected are fully anonymized.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">4. How to Disable Cookies</h3>
              <p>
                You can block or purge cookies via your internet browser settings at any time. However, disabling all cookies 
                will prevent you from signing in or persisting application bookmarks.
              </p>
            </div>

            <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">5. Contact Information</h3>
              <p>
                For questions regarding our cookies configuration, contact our team at <a href="mailto:contact@campusloot.com" className="text-[#F5A623] hover:underline">contact@campusloot.com</a>.
              </p>
            </div>
          </div>
        ) : isDetailsPage ? (
          <div className="animate-fade-in text-left max-w-4xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2 text-xs text-[#ccc3d8] hover:text-[#F5A623] transition-colors mb-6 font-bold cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rotate-180 text-[#ccc3d8]" />
              Back to Opportunities
            </button>

            {detailsLoading ? (
              <div className="text-center py-20">
                <Zap className="text-[#F5A623] w-10 h-10 animate-spin mx-auto mb-4" />
                <p className="text-xs text-[#ccc3d8]">Loading opportunity details...</p>
              </div>
            ) : detailsError ? (
              <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto">
                <Info className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Opportunity Not Found</h4>
                <p className="text-xs text-[#ccc3d8] mb-6">{detailsError}</p>
                <button 
                  onClick={() => navigateTo('/')}
                  className="px-4 py-2 bg-[#F5A623] rounded-lg text-xs text-white"
                >
                  Go Back Home
                </button>
              </div>
            ) : detailsItem ? (() => {
              const item = detailsItem;
              const initials = getInitials(item);
              const isApplied = registeredItems.includes(item.id);
              const isSaved = savedItems.includes(item.id);

              let labelName = 'Stipend';
              let amountVal = item.stipendText || (item.stipend ? `$${item.stipend.toLocaleString()}/mo` : 'N/A');
              let secondaryMetricLabel = 'Duration';
              let secondaryMetricVal = item.duration || 'N/A';
              
              if (detailsStream === 'hackathons') {
                labelName = 'Prize Pool';
                amountVal = item.prizeText || (item.totalPrize ? `$${item.totalPrize.toLocaleString()}` : 'N/A');
                secondaryMetricLabel = 'Team Size';
                secondaryMetricVal = item.teamSize || 'N/A';
              } else if (detailsStream === 'scholarships') {
                labelName = 'Scholarship Amount';
                amountVal = item.amountText ? `₹${item.amountText}` : (item.amount ? `$${item.amount.toLocaleString()}` : 'N/A');
                secondaryMetricLabel = 'Income Limit';
                secondaryMetricVal = item.eligibility?.incomeLimit || 'No Bar';
              } else if (detailsStream === 'activities') {
                labelName = 'Rewards';
                amountVal = item.rewardText || 'Prestige Points';
                secondaryMetricLabel = 'Difficulty';
                secondaryMetricVal = item.level || 'Elite Level';
              }

              return (
                <div className="space-y-8">
                  {/* Cover Image Header */}
                  <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden rounded-2xl border border-[#1E1E1E]">
                    <img 
                      src={item.image || getRandomImage(item.id)} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center text-[#F5A623] font-bold text-4xl">
                      {initials}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent"></div>
                  </div>

                  {/* Content Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Info */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2.5 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]">
                            {item.category || item.domain || 'Opportunity'}
                          </span>
                          {item.status && (
                            <span className="px-2.5 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase bg-[#1A1A1A] border-[#F5A623]/40 text-[#F5A623]">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                          {item.title}
                        </h1>
                        <p className="text-sm text-[#ccc3d8] mt-2">
                          by <strong className="text-white">{item.company || item.organizer || item.provider || 'CampusLoot Partner'}</strong>
                        </p>
                      </div>

                      <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Opportunity Overview</h3>
                        <p className="text-xs text-[#ccc3d8] leading-relaxed whitespace-pre-line">
                          {item.description || `This exclusive student opportunity is offered by ${item.company || item.organizer || item.provider}. Apply to gain hands-on experience, enhance your portfolio, and earn rewards.`}
                        </p>
                      </div>

                      {detailsStream === 'internships' && (
                        <div className="border-t border-[#1E1E1E]/40 pt-6 grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Location Type</span>
                            <span className="text-white font-medium block mt-1">{item.locationType || 'Remote'}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Duration</span>
                            <span className="text-white font-medium block mt-1">{item.duration || 'N/A'}</span>
                          </div>
                        </div>
                      )}

                      {detailsStream === 'hackathons' && (
                        <div className="border-t border-[#1E1E1E]/40 pt-6 grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Event Platform</span>
                            <span className="text-white font-medium block mt-1">{item.platform || 'Independent'}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Team Size</span>
                            <span className="text-white font-medium block mt-1">{item.teamSize || '1-4 Members'}</span>
                          </div>
                        </div>
                      )}

                      {detailsStream === 'scholarships' && item.eligibility && (
                        <div className="border-t border-[#1E1E1E]/40 pt-6 space-y-4 text-xs">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Eligibility Criteria</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[#666666] font-semibold block uppercase">Income Limit</span>
                              <span className="text-white font-medium block mt-1">{item.eligibility.incomeLimit || 'No Bar'}</span>
                            </div>
                            <div>
                              <span className="text-[#666666] font-semibold block uppercase">Minimum Academic Marks</span>
                              <span className="text-white font-medium block mt-1">{item.eligibility.minMarks || 'N/A'}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[#666666] font-semibold block uppercase">Eligible Courses</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {(item.eligibility.courseAllowed || []).map((course: string) => (
                                  <span key={course} className="premium-tag">{course}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {detailsStream === 'activities' && (
                        <div className="border-t border-[#1E1E1E]/40 pt-6 grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Activity Mode</span>
                            <span className="text-white font-medium block mt-1">{item.mode || 'Online'}</span>
                          </div>
                          <div>
                            <span className="text-[#666666] font-semibold block uppercase">Certificate on Completion</span>
                            <span className="text-white font-medium block mt-1">{item.rewards?.hasCertificate ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar Action Widget */}
                    <div className="space-y-6">
                      <div className="glass-panel p-6 rounded-2xl border border-[#1E1E1E] space-y-6">
                        <div>
                          <span className="text-[#666666] text-[10px] font-semibold tracking-wider uppercase block mb-1">{labelName}</span>
                          <span className="text-[#F5A623] font-bold text-2xl">{amountVal}</span>
                        </div>

                        <div className="space-y-4 text-xs border-t border-[#1E1E1E]/20 pt-4">
                          <div className="flex justify-between">
                            <span className="text-[#666666]">{secondaryMetricLabel}:</span>
                            <span className="text-white font-semibold">{secondaryMetricVal}</span>
                          </div>
                          {item.deadline && (
                            <div className="flex justify-between">
                              <span className="text-[#666666]">Deadline:</span>
                              <span className="text-white font-semibold">
                                {typeof item.deadline === 'string' ? item.deadline : new Date(item.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 pt-2">
                          <button 
                            onClick={() => {
                              if (detailsStream === 'internships') {
                                handleApplyClick(item, 'internships');
                              } else if (detailsStream === 'hackathons') {
                                handleApplyClick(item, 'hackathons', item.isPartner ? 1000 : 200, item.isPartner ? 500 : 150);
                              } else if (detailsStream === 'scholarships') {
                                handleApplyClick(item, 'scholarships', item.id === 'sch-1' ? 800 : (item.id === 'sch-2' ? 1000 : 400), item.id === 'sch-1' ? 400 : (item.id === 'sch-2' ? 500 : 200));
                              } else if (detailsStream === 'activities') {
                                handleApplyClick(item, 'activities');
                              }
                            }}
                            className={`w-full py-3 font-display text-sm font-bold tracking-wide rounded-xl transition-all duration-200 border text-center block cursor-pointer ${
                              isApplied
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-[#F5A623] border-[#F5A623] text-[#0B0B0B] hover:bg-[#D4881A]'
                            }`}
                          >
                            {isApplied ? 'Application Filed' : 'Register / Apply'}
                          </button>
                          
                          <button 
                            onClick={(e) => toggleSaveItem(item.id, e)}
                            className="w-full py-2.5 bg-transparent border border-[#2A2A2A] hover:border-[#F5A623] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#F5A623] text-[#F5A623]' : ''}`} />
                            {isSaved ? 'Saved to Bookmarks' : 'Save for Later'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : null}
          </div>
        ) : (
          <>
            {/* ----------------------------------------------------
                TAB 1: INTERNSHIPS SCREEN
                ---------------------------------------------------- */}
            {activeTab === 'internships' && (
          <section className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative py-12 md:py-16 mb-8 overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_top_right,#0B0B0B_0%,transparent_50%)] border border-[#1E1E1E]/20 px-6 md:px-12 flex flex-col justify-center min-h-[420px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent"></div>
              <div className="max-w-2xl relative z-10">
                <span className="inline-block py-1 px-3 mb-4 bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40 rounded-lg  text-[10px] uppercase tracking-widest">
                  Premium Student Network
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-[1.05]">
                  Discover Your Next <span className="text-[#F5A623] italic">Edge</span>
                </h2>
                <p className="font-sans text-[#ccc3d8] text-sm md:text-base mb-8 max-w-lg leading-relaxed">
                  Access hyper-exclusive internship opportunities from the world's most innovative engineering firms and creative studios.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      setInternshipCategory('All');
                      setSearchQuery('');
                      setPersonalizedFeedback(false);
                      const target = document.getElementById('listings-grid');
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#F5A623] text-white px-6 py-3.5 rounded-xl  text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer font-bold duration-200"
                  >
                    View All Openings
                    <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                  </button>
                  <button 
                    onClick={() => setPersonalizeFeedOpen(true)}
                    className="border border-[#4a4455] text-[#e4e1e9] hover:bg-[#161616]/50 px-6 py-3.5 rounded-xl  text-xs transition-all active:opacity-90 font-bold"
                  >
                    Personalize Feed
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4" id="listings-grid">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-full">
                {['All', 'Engineering', 'Design', 'Finance', 'AI & Research'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setInternshipCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg  text-xs transition-all cursor-pointer ${
                      internshipCategory === cat 
                        ? 'bg-[#e4e1e9] text-[#0B0B0B] font-bold' 
                        : 'bg-[#111111] border border-[#1E1E1E] text-[#ccc3d8] hover:border-[#F5A623]/60 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className=" text-xs text-[#ccc3d8]">Sort by:</span>
                <select 
                  value={internshipSort}
                  onChange={(e) => setInternshipSort(e.target.value)}
                  className="bg-[#131318] border-none text-[#F5A623]  text-xs py-1.5 px-3 focus:ring-0 cursor-pointer outline-none font-bold"
                >
                  <option value="Highest Stipend">Highest Stipend</option>
                  <option value="Newest First">Newest First</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Grid of Internships */}
            {opportunitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderSkeletons()}
              </div>
            ) : filteredInternships.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto">
                <Info className="w-8 h-8 text-[#ccc3d8] mx-auto mb-3" />
                <h4 className=" text-sm font-bold text-white mb-1">No vacancies found</h4>
                <p className="text-xs text-[#ccc3d8] mb-4">Try clearing your filters or testing with a different search phrase.</p>
                <button 
                  onClick={() => {
                    setInternshipCategory('All');
                    setSearchQuery('');
                    setPersonalizedFeedback(false);
                  }}
                  className="px-4 py-2 bg-[#F5A623] rounded-lg  text-xs text-white"
                >
                  Reset Settings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.slice(0, visibleInternshipsCount).map(item => {
                  const isApplied = registeredItems.includes(item.id);
                  const isSaved = savedItems.includes(item.id);
                  const initials = item.company ? item.company.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CL';
                  return (
                    <div 
                      key={item.id} 
                      className="glass-panel loaded-card rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-default"
                      id={`internship-card-${item.id}`}
                    >
                      <div className="relative w-full h-[180px] overflow-hidden rounded-t-[10px]">
                        <img 
                          src={item.image || getRandomImage(item.id)} 
                          alt={item.title} 
                          className="w-full h-full object-cover display-block"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextSibling as HTMLElement;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                        />
                        <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center text-[#F5A623] font-bold text-xl">
                          {initials}
                        </div>
                        <div className="absolute inset-0 bg-[#F5A623]/0 group-hover:bg-[#F5A623]/10 transition-colors duration-200"></div>
                      </div>

                      <div className="p-5 flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className="bg-[#1A1A1A] border border-[#1E1E1E] p-[8px] rounded-[8px] flex items-center justify-center">
                              {item.category === 'Design' ? (
                                <Brush className="text-[#F5A623] w-5 h-5" />
                              ) : item.category === 'Finance' ? (
                                <TrendingUp className="text-[#F5A623] w-5 h-5" />
                              ) : item.category === 'AI & Research' ? (
                                <Rocket className="text-[#F5A623] w-5 h-5" />
                              ) : (
                                <Terminal className="text-[#F5A623] w-5 h-5" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.status && (() => {
                                const statusUpper = item.status.toUpperCase();
                                let badgeStyleClass = '';
                                if (statusUpper === 'HIGH DEMAND') {
                                  badgeStyleClass = 'bg-[#F5A623] text-[#0B0B0B] border-[#F5A623]';
                                } else if (statusUpper === 'TOP CHOICE') {
                                  badgeStyleClass = 'bg-[#0B0B0B] text-[#F5A623] border-[#F5A623]';
                                } else if (statusUpper === 'ACTIVE NOW') {
                                  badgeStyleClass = 'bg-[#1A1A1A] text-[#F5A623] border-[#F5A623]';
                                } else {
                                  badgeStyleClass = item.statusType === 'success'
                                    ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30'
                                    : item.statusType === 'warning'
                                    ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                                    : 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/30';
                                }
                                return (
                                  <span className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase ${badgeStyleClass}`}>
                                    {item.status}
                                  </span>
                                );
                              })()}
                              <button 
                                onClick={(e) => toggleSaveItem(item.id, e)}
                                className="text-[#444444] hover:text-[#F5A623] transition-colors p-1"
                                title={isSaved ? "Saved" : "Save Opportunity"}
                              >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#F5A623] text-[#F5A623]' : ''}`} />
                              </button>
                              {isAdminLoggedIn && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handlePreFillEdit(item, 'internships');
                                      navigateTo('/admin/console');
                                    }}
                                    className="text-white hover:text-[#F5A623] transition-colors p-1"
                                    title="Edit Opportunity"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleDeleteEntry(item.id, 'internships', e);
                                    }}
                                    className="text-red-500 hover:text-red-400 transition-colors p-1"
                                    title="Delete Opportunity"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="font-display font-semibold text-[1.2rem] tracking-[-0.01em] text-white group-hover:text-[#F5A623] transition-colors mb-1">
                              {item.title}
                            </h3>
                            <p className=" text-[13px] text-[#666666] tracking-[0.01em]">
                              {item.company} • {item.location}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-[#1E1E1E]/40 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase font-sans">Stipend</span>
                            <span className="text-[#F5A623] font-bold text-[1rem] font-sans">
                              {item.stipendText || `$${item.stipend.toLocaleString()}/mo`}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map(tag => (
                              <span key={tag} className="premium-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => handleApplyClick(item, 'internships')}
                            className={`w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] transition-all duration-200 border ${
                              isApplied
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                                : 'bg-transparent border-[#2A2A2A] text-white hover:bg-[#F5A623] hover:text-[#0B0B0B] hover:border-[#F5A623]'
                            }`}
                          >
                            {isApplied ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Application Pending
                              </span>
                            ) : (
                              'Apply Now'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load more element list */}
            {filteredInternships.length > visibleInternshipsCount && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setVisibleInternshipsCount(prev => prev + 3)}
                  className=" text-xs text-[#ccc3d8] hover:text-[#F5A623] transition-colors flex items-center gap-1 mx-auto py-2 px-4 rounded-lg bg-[#111111] border border-[#1E1E1E] cursor-pointer"
                >
                  Load more opportunities
                  <ChevronDown className="w-3 h-3 text-[#ccc3d8]/80" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ----------------------------------------------------
            TAB 2: HACKATHONS SCREEN
            ---------------------------------------------------- */}
        {activeTab === 'hackathons' && (
          <section className="animate-fade-in">
            {/* Hero Section */}
            <header className="relative py-12 mb-8" id="hackathons-header">
              <div className="relative z-10 space-y-4">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white max-w-2xl leading-tight">
                  Forge the Future: Elite Hackathons for Visionary Builders
                </h1>
                <p className="font-sans text-sm md:text-base text-[#ccc3d8] max-w-2xl leading-relaxed">
                  Curated, high-stakes coding competitions designed for the top 1% of student talent. Win capital, secure mentorship, and claim your place in the ecosystem.
                </p>

                {/* Filters Chips row */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {['All', 'AI & ML', 'Web3 & Decentralization', 'Sustainability Tech'].map(tech => (
                    <button
                      key={tech}
                      onClick={() => setHackathonCategory(tech === 'All' ? 'All' : tech)}
                      className={`px-4 py-2 rounded-lg  text-xs tracking-tight flex items-center gap-2 transition-all cursor-pointer border ${
                        (tech === 'All' ? hackathonCategory === 'All' : hackathonCategory === tech)
                          ? 'bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623]'
                          : 'bg-[#111111] border-[#1E1E1E] text-[#ccc3d8] hover:border-purple-800'
                      }`}
                    >
                      {tech === 'All' && (
                        <span className="w-2 h-2 rounded-full bg-[#F5A623] status-glow-gold"></span>
                      )}
                      {tech === 'All' ? 'All Hackathons' : tech}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* Hackathons Feed */}
            <div className="hackathons-grid">
              {opportunitiesLoading ? (
                renderSkeletons()
              ) : (
                filteredHackathons.map(item => {
                  const isApplied = registeredItems.includes(item.id);
                  const orgInitials = item.roleType ? item.roleType.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CL';
                  return (
                    <div 
                      key={item.id} 
                      className="glass-panel loaded-card rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-default"
                      id={`hackathon-card-${item.id}`}
                    >
                    <div className="relative w-full h-[180px] overflow-hidden rounded-t-[10px]">
                      <img 
                        src={item.image || getRandomImage(item.id)} 
                        alt={item.title} 
                        className="w-full h-full object-cover display-block"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const sibling = e.currentTarget.nextSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center text-[#F5A623] font-bold text-xl">
                        {orgInitials}
                      </div>
                      <div className="absolute inset-0 bg-[#F5A623]/0 group-hover:bg-[#F5A623]/10 transition-colors duration-200"></div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-[#1A1A1A] border border-[#1E1E1E] p-[8px] rounded-[8px] flex items-center justify-center">
                            {item.category === 'AI & ML' ? (
                              <Cpu className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Web3 & Decentralization' ? (
                              <Database className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Sustainability Tech' ? (
                              <Flame className="text-[#F5A623] w-5 h-5" />
                            ) : (
                              <Terminal className="text-[#F5A623] w-5 h-5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 w-full justify-between pl-3">
                            {item.status && (() => {
                              const statusUpper = item.status.toUpperCase();
                              let badgeStyleClass = '';
                              if (statusUpper === 'ONLINE') {
                                badgeStyleClass = 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]';
                              } else if (statusUpper === 'HYBRID') {
                                badgeStyleClass = 'bg-amber-400/10 border-amber-400/30 text-amber-400';
                              } else {
                                badgeStyleClass = 'bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]';
                              }
                              return (
                                <span className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase ${badgeStyleClass}`}>
                                  {item.status}
                                </span>
                              );
                            })()}
                            <div className="flex items-center gap-2 ml-auto">
                              <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase font-sans">
                                Ends: {item.deadline}
                              </span>
                              {isAdminLoggedIn && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handlePreFillEdit(item, 'hackathons');
                                      navigateTo('/admin/console');
                                    }}
                                    className="text-white hover:text-[#F5A623] transition-colors p-1"
                                    title="Edit Opportunity"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleDeleteEntry(item.id, 'hackathons', e);
                                    }}
                                    className="text-red-500 hover:text-red-400 transition-colors p-1"
                                    title="Delete Opportunity"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-display font-semibold text-[1.2rem] tracking-[-0.01em] text-white group-hover:text-[#F5A623] transition-colors mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-[#666666] tracking-[0.01em]">
                            {item.roleType || 'CampusLoot Partner'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#1E1E1E]/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase font-sans">Pool</span>
                          <span className="text-[#F5A623] font-bold text-[1rem] font-sans">
                            {item.prizeText || `$${item.totalPrize.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[item.status, item.category].filter(Boolean).map(tag => (
                            <span key={tag} className="premium-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => handleApplyClick(item, 'hackathons', item.isPartner ? 1000 : 200, item.isPartner ? 500 : 150)}
                          className={`w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] transition-all duration-200 border ${
                            isApplied
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                              : 'bg-transparent border-[#2A2A2A] text-white hover:bg-[#F5A623] hover:text-[#0B0B0B] hover:border-[#F5A623]'
                          }`}
                        >
                          {isApplied ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Application Pending
                            </span>
                          ) : (
                            'Apply Opportunity'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>

            {/* Pagination Mock Footer */}
            <footer className="mt-12 py-6 border-t border-[#1E1E1E]/40 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <p className=" text-xs text-[#ccc3d8]">Showing 12 of 148 hackathons</p>
                <div className="flex gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-[#1E1E1E] bg-[#111111] text-white  text-xs">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-[#1E1E1E] text-[#ccc3d8]  text-xs hover:bg-[#111111]">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-[#1E1E1E] text-[#ccc3d8]  text-xs hover:bg-[#111111]">3</button>
                  <span className="text-[#ccc3d8]">..</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-[#1E1E1E] text-[#ccc3d8]  text-xs hover:bg-[#111111]">12</button>
                </div>
              </div>
              <p className=" text-[11px] text-[#ccc3d8]">© 2024 CampusLoot Ecosystem. Precision Instruments for Student Growth.</p>
            </footer>
          </section>
        )}

        {/* ----------------------------------------------------
            TAB 3: SCHOLARSHIPS SCREEN
            ---------------------------------------------------- */}
        {activeTab === 'scholarships' && (
          <section className="animate-fade-in text-left">
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#F5A623] status-glow-gold animate-ping"></div>
                <span className=" text-xs text-[#F5A623] tracking-widest uppercase">Ethereal Academic Vault</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white mb-4">
                Academic Excellence <br /><span className="text-[#F5A623]">Fully Funded.</span>
              </h1>
              <p className="font-sans text-sm md:text-base text-[#ccc3d8] max-w-2xl leading-relaxed">
                Explore a curated directory of high-prestige grants and exclusive scholarships designed for the world's most ambitious students.
              </p>
            </header>

            {/* Filter Bar */}
            <div className="glass-panel rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {['All', 'STEM', 'Liberal Arts', 'International'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setScholarshipCategory(chip === 'All' ? 'All' : chip)}
                    className={`px-4 py-2 border rounded-lg  text-xs transition-colors cursor-pointer ${
                      (chip === 'All' ? scholarshipCategory === 'All' : scholarshipCategory === chip)
                        ? 'bg-[#F5A623]/10 border-[#F5A623]/50 text-[#F5A623] font-bold'
                        : 'border-transparent text-[#ccc3d8]/80 hover:bg-[#111111]'
                    }`}
                  >
                    {chip === 'All' ? 'All Grants' : chip}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className=" text-xs text-[#ccc3d8]">Sort by:</span>
                <select 
                  value={scholarshipSort}
                  onChange={(e) => setScholarshipSort(e.target.value)}
                  className="bg-transparent border-none text-xs  text-[#e4e1e9] focus:ring-0 cursor-pointer outline-none font-bold"
                >
                  <option value="Highest Amount">Highest Amount</option>
                  <option value="Ending Soon">Ending Soon</option>
                </select>
              </div>
            </div>

            {/* Scholarships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunitiesLoading ? (
                renderSkeletons()
              ) : (
                filteredScholarships.map(item => {
                  const isApplied = registeredItems.includes(item.id);
                  const isSaved = savedItems.includes(item.id);
                  const provInitials = item.provider ? item.provider.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CL';
                  return (
                    <div 
                      key={item.id} 
                      className="glass-panel loaded-card rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-default"
                      id={`scholarship-card-${item.id}`}
                    >
                    <div className="relative w-full h-[180px] overflow-hidden rounded-t-[10px]">
                      <img 
                        src={item.image || getRandomImage(item.id)} 
                        alt={item.title} 
                        className="w-full h-full object-cover display-block"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const sibling = e.currentTarget.nextSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center text-[#F5A623] font-bold text-xl">
                        {provInitials}
                      </div>
                      <div className="absolute inset-0 bg-[#F5A623]/0 group-hover:bg-[#F5A623]/10 transition-colors duration-200"></div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-[#1A1A1A] border border-[#1E1E1E] p-[8px] rounded-[8px] flex items-center justify-center">
                            {item.category === 'STEM' ? (
                              <Cpu className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Liberal Arts' ? (
                              <Brush className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'International' ? (
                              <Compass className="text-[#F5A623] w-5 h-5" />
                            ) : (
                              <Award className="text-[#F5A623] w-5 h-5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const badgeText = item.status || (item.tags && item.tags[0]) || 'MERIT-BASED';
                              const badgeStyleClass = item.statusType === 'danger'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                : 'bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]';
                              return (
                                <span className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase ${badgeStyleClass}`}>
                                  {badgeText}
                                </span>
                              );
                            })()}
                            <button 
                              onClick={(e) => toggleSaveItem(item.id, e)}
                              className="text-[#444444] hover:text-[#F5A623] transition-colors p-1"
                              title={isSaved ? "Saved" : "Save Opportunity"}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#F5A623] text-[#F5A623]' : ''}`} />
                            </button>
                            {isAdminLoggedIn && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handlePreFillEdit(item, 'scholarships');
                                    navigateTo('/admin/console');
                                  }}
                                  className="text-white hover:text-[#F5A623] transition-colors p-1"
                                  title="Edit Opportunity"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDeleteEntry(item.id, 'scholarships', e);
                                  }}
                                  className="text-red-500 hover:text-red-400 transition-colors p-1"
                                  title="Delete Opportunity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-display font-semibold text-[1.2rem] tracking-[-0.01em] text-white group-hover:text-[#F5A623] transition-colors mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-[#666666] tracking-[0.01em]">
                            {item.provider}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#1E1E1E]/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase font-sans">Amount</span>
                          <span className="text-[#F5A623] font-bold text-[1rem] font-sans">
                            {item.amountText ? `₹${item.amountText}` : `$${item.amount.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map(tag => (
                            <span key={tag} className="premium-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => handleApplyClick(item, 'scholarships', item.id === 'sch-1' ? 800 : (item.id === 'sch-2' ? 1000 : 400), item.id === 'sch-1' ? 400 : (item.id === 'sch-2' ? 500 : 200))}
                          className={`w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] transition-all duration-200 border ${
                            isApplied
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                              : 'bg-transparent border-[#2A2A2A] text-white hover:bg-[#F5A623] hover:text-[#0B0B0B] hover:border-[#F5A623]'
                          }`}
                        >
                          {isApplied ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Application Filed
                            </span>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>

            {/* CTA form */}
            <footer className="mt-20 pt-12 border-t border-[#1E1E1E]/40 text-center max-w-2xl mx-auto">
              <h4 className="font-display text-2xl font-semibold text-white mb-2">Don't see your niche?</h4>
              <p className="font-sans text-xs text-[#ccc3d8] mb-8">
                Our curators update specialized scholarships every week. Get direct intelligence briefings.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={() => setAlertsModalOpen(true)}
                  className="px-6 py-3 border border-[#1E1E1E] text-[#e4e1e9] hover:bg-[#161616]/40 rounded-xl  text-xs font-bold transition-all"
                >
                  Subscribe to Alerts
                </button>
                <button 
                  onClick={() => {
                    setScholarshipCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-[#F5A623] text-[#0B0B0B] rounded-xl  text-xs font-bold hover:bg-[#D4881A] transition-all"
                >
                  Browse Full Archive
                </button>
              </div>
              <p className="mt-12 text-[10px]  text-[#ccc3d8]">© 2024 CampusLoot. Designed for the mission-driven.</p>
            </footer>
          </section>
        )}


        {/* ----------------------------------------------------
            TAB 4: ACTIVITIES (ACADEMIC ARENA) SCREEN
            ---------------------------------------------------- */}
        {activeTab === 'activities' && (
          <section className="animate-fade-in text-left">
            <header className="mb-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-3">
                <div>
                  <h1 className="font-display text-4xl font-bold text-white mb-1">Academic Arena</h1>
                  <p className="font-sans text-xs md:text-sm text-[#ccc3d8] max-w-lg leading-relaxed">
                    Challenge your intellect, earn prestige, and unlock exclusive academic loot through curated activities.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-2.5">
                    <Award className="text-[#F5A623] w-5 h-5 fill-[#F5A623]/15" />
                    <div>
                      <p className="text-[9px]  text-[#ccc3d8] uppercase tracking-widest leading-none mb-1">Active Rank</p>
                      <p className=" text-xs font-bold text-white text-emerald-400">Vanguard Alpha</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Category selection */}
            <section className="flex flex-wrap gap-2 mb-8">
              {['All', 'Coding Challenges', 'Academic Quizzes', 'Workshops', 'Research Labs'].map(actCat => (
                <button
                  key={actCat}
                  onClick={() => setActivityCategory(actCat === 'All' ? 'All' : actCat)}
                  className={`px-4 py-2 rounded-lg  text-xs uppercase tracking-tight transition-all cursor-pointer ${
                    (actCat === 'All' ? activityCategory === 'All' : activityCategory === actCat)
                      ? 'bg-[#F5A623] text-white font-bold text-[#0B0B0B]'
                      : 'glass-panel text-[#ccc3d8] hover:text-[#F5A623]'
                  }`}
                >
                  {actCat === 'All' ? 'All Activities' : actCat}
                </button>
              ))}
            </section>

            {/* Bento Activity Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunitiesLoading ? (
                renderSkeletons()
              ) : (
                filteredActivities.map(item => {
                  const isApplied = registeredItems.includes(item.id);
                  const isSaved = savedItems.includes(item.id);
                  const isMystery = item.isMystery;
                  
                  const badgeText = item.category === 'Coding Challenges' ? 'CHALLENGE'
                                  : item.category === 'Academic Quizzes' ? 'QUIZ'
                                  : item.category === 'Workshops' ? 'WORKSHOP'
                                  : 'EVENT';

                  const initials = item.category ? item.category.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ACT';
                  
                  return (
                    <div 
                      key={item.id} 
                      className="glass-panel loaded-card rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-default"
                      id={`activity-card-${item.id}`}
                    >
                    <div className="relative w-full h-[180px] overflow-hidden rounded-t-[10px]">
                      <img 
                        src={item.image || getRandomImage(item.id)} 
                        alt={item.title} 
                        className="w-full h-full object-cover display-block"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const sibling = e.currentTarget.nextSibling as HTMLElement;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center text-[#F5A623] font-bold text-xl">
                        {initials}
                      </div>
                      <div className="absolute inset-0 bg-[#F5A623]/0 group-hover:bg-[#F5A623]/10 transition-colors duration-200"></div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-[#1A1A1A] border border-[#1E1E1E] p-[8px] rounded-[8px] flex items-center justify-center">
                            {isMystery ? (
                              <Lock className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Coding Challenges' ? (
                              <Terminal className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Academic Quizzes' ? (
                              <Brain className="text-[#F5A623] w-5 h-5" />
                            ) : item.category === 'Workshops' ? (
                              <Brush className="text-[#F5A623] w-5 h-5" />
                            ) : (
                              <Award className="text-[#F5A623] w-5 h-5" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-[4px] border text-[10px] font-bold tracking-[0.08em] uppercase bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]">
                              {badgeText}
                            </span>
                            {!isMystery && (
                              <button 
                                onClick={(e) => toggleSaveItem(item.id, e)}
                                className="text-[#444444] hover:text-[#F5A623] transition-colors p-1"
                                  title={isSaved ? "Saved" : "Save Opportunity"}
                              >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#F5A623] text-[#F5A623]' : ''}`} />
                              </button>
                            )}
                            {isAdminLoggedIn && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handlePreFillEdit(item, 'activities');
                                    navigateTo('/admin/console');
                                  }}
                                  className="text-white hover:text-[#F5A623] transition-colors p-1"
                                  title="Edit Opportunity"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDeleteEntry(item.id, 'activities', e);
                                  }}
                                  className="text-red-500 hover:text-red-400 transition-colors p-1"
                                  title="Delete Opportunity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-display font-semibold text-[1.2rem] tracking-[-0.01em] text-white group-hover:text-[#F5A623] transition-colors mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-[#666666] tracking-[0.01em]">
                            {item.category || 'CampusLoot Academy'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#1E1E1E]/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[#666666] text-[11px] font-medium tracking-[0.06em] uppercase font-sans">Date</span>
                          <span className="text-[#F5A623] font-bold text-[1rem] font-sans">
                            {item.status || 'Jun 21, 2026'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[item.level, item.xpText].filter(Boolean).map(tag => (
                            <span key={tag} className="premium-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {isMystery ? (
                          <button 
                            disabled
                            className="w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] bg-[#0E0E13] border border-[#1E1E1E]/40 text-[#ccc3d8] cursor-not-allowed"
                          >
                            Locked (Incomplete criteria)
                          </button>
                        ) : item.quizId ? (
                          <button 
                            onClick={() => {
                              if (!isApplied) {
                                setActiveQuizActivityId(item.id);
                                setQuizModalOpen(true);
                              }
                            }}
                            className={`w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] transition-all duration-200 border ${
                              isApplied
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                                : 'bg-transparent border-[#2A2A2A] text-white hover:bg-[#F5A623] hover:text-[#0B0B0B] hover:border-[#F5A623]'
                            }`}
                          >
                            {isApplied ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Completed (500 pts won)
                              </span>
                            ) : (
                              'Start Quiz'
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApplyClick(item, 'activities')}
                            className={`w-full py-2 font-display text-[14px] font-semibold tracking-[0.03em] rounded-[8px] transition-all duration-200 border ${
                              isApplied
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                                : 'bg-transparent border-[#2A2A2A] text-white hover:bg-[#F5A623] hover:text-[#0B0B0B] hover:border-[#F5A623]'
                            }`}
                          >
                            {isApplied ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                {item.id === 'act-3' ? 'On Waiting List' : 'Registered'}
                              </span>
                            ) : (
                              item.id === 'act-3' ? 'Join Waiting List' : 'Register Now'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
              )}

            </div>
          </section>
        )}
          </>
        )}

      </main>

      {/* ----------------------------------------------------
          FOOTER COMPONENT (4-Column Layout with Black & Gold Theme)
          ---------------------------------------------------- */}
      <footer className="border-t border-[#1E1E1E] py-16 bg-[#0B0B0B] px-4 md:px-10 mt-12 transition-all font-sans text-xs text-[#ccc3d8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('internships'); setPersonalizedFeedback(false); navigateTo('/'); }}>
                <img src="/logo.svg" alt="CampusLoot Logo" className="w-6 h-6 object-contain animate-pulse" />
                <span className="font-display text-lg font-bold text-[#F5A623] tracking-[-0.03em]">CampusLoot</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your campus opportunities, all in one place. Access high-stipend internships, elite hackathons, and scholarships.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#linkedin" className="text-[#ccc3d8] hover:text-[#F5A623] transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#twitter" className="text-[#ccc3d8] hover:text-[#F5A623] transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#instagram" className="text-[#ccc3d8] hover:text-[#F5A623] transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white uppercase tracking-wider text-[11px]">Explore</h4>
              <ul className="space-y-2 text-left">
                <li>
                  <button onClick={() => { setActiveTab('internships'); navigateTo('/'); }} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Internships</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('hackathons'); navigateTo('/'); }} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Hackathons</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('scholarships'); navigateTo('/'); }} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Scholarships</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('activities'); navigateTo('/'); }} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Extra Activities</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white uppercase tracking-wider text-[11px]">Company</h4>
              <ul className="space-y-2 text-left">
                <li>
                  <button onClick={() => navigateTo('/about')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">About Us</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/contact')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Contact Us</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/careers')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Careers</button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white uppercase tracking-wider text-[11px]">Legal</h4>
              <ul className="space-y-2 text-left">
                <li>
                  <button onClick={() => navigateTo('/privacy')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Privacy Policy</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/terms')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Terms of Service</button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/cookies')} className="hover:text-[#F5A623] transition-colors text-left cursor-pointer">Cookie Policy</button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#1E1E1E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#888888]">
            <div>
              © 2026 CampusLoot. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>DeepTech Initiative Corp.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ----------------------------------------------------
          MODALS & CUSTOM INTERACTIVES
          ---------------------------------------------------- */}

      {/* 1. QUIZ CHALLENGE DIALOG MODAL */}
      {quizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#F5A623]/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-[5px] bg-[#F5A623]"></div>
            
            <button 
              onClick={() => setQuizModalOpen(false)}
              className="absolute top-4 right-4 text-[#ccc3d8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!quizFinished ? (
              <div>
                <div className="flex items-center gap-2 mb-4 bg-transparent">
                  <Brain className="w-5 h-5 text-[#F5A623]" />
                  <span className=" text-xs text-[#F5A623] font-bold">
                    Question {currentQuestionIndex + 1} of {NEURAL_NETWORKS_QUIZ.length}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-medium text-white mb-6">
                  {NEURAL_NETWORKS_QUIZ[currentQuestionIndex].question}
                </h3>

                <div className="space-y-3 mb-8">
                  {NEURAL_NETWORKS_QUIZ[currentQuestionIndex].options.map((opt, optionIdx) => {
                    const isSelected = selectedAnswerIndex === optionIdx;
                    return (
                      <button
                        key={opt}
                        onClick={() => setSelectedAnswerIndex(optionIdx)}
                        className={`w-full text-left p-4 rounded-xl font-sans text-xs border transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-[#F5A623]/20 border-[#F5A623] text-white font-semibold' 
                            : 'bg-[#111111] border-[#1E1E1E] text-[#ccc3d8] hover:border-[#F5A623]/50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623] shadow-[0_0_8px_#F5A623]"></span>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#1E1E1E]/20">
                  <span className=" text-[9px] text-[#ccc3d8]">Reward index scaled with points</span>
                  <button 
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswerIndex === null}
                    className="bg-[#F5A623] text-white  text-xs px-6 py-2 rounded-lg font-bold hover:bg-[#D4881A] disabled:bg-[#4a4455] disabled:cursor-not-allowed transition-all"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
                <p className="font-sans text-xs text-[#ccc3d8] mb-6">
                  You scored <strong className="text-emerald-400 font-bold">{quizScore} out of {NEURAL_NETWORKS_QUIZ.length}</strong> correct.
                </p>

                <div className="bg-[#111111] border border-[#1E1E1E] p-4 rounded-xl mb-8 space-y-2 text-xs  text-left max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span>Loot Credits Won:</span>
                    <span className="text-emerald-400 font-bold">+${quizScore * 125}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prestige XP Gained:</span>
                    <span className="text-[#F5A623] font-bold">+{quizScore * 60} XP</span>
                  </div>
                </div>

                <button 
                  onClick={claimQuizPrize}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black  text-xs px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Claim Academic Loot Credits
                </button>
              </div>
            )}
          </div>
        </div>
      )}      {/* 2. PERSONALIZE FEED PREFERENCES CONFIG DRAWER */}
      {personalizeFeedOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-[#111111] border-l border-[#1E1E1E] w-full max-w-md h-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between animate-slide-left">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F5A623]" /> Personalize Feed Coordinates
                </h3>
                <button 
                  onClick={() => setPersonalizeFeedOpen(false)}
                  className="text-[#ccc3d8] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 text-xs">
                <div>
                  <label className="block text-[#ccc3d8]  mb-2 font-semibold uppercase">Primary Field of Exploration</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Engineering', 'Design', 'Finance', 'AI & Research'].map(role => (
                      <button
                        key={role}
                        onClick={() => setInterestRole(role as any)}
                        className={`p-3 rounded-lg border text-left font-sans ${
                          interestRole === role 
                            ? 'bg-[#F5A623]/15 border-[#F5A623] text-[#F5A623]' 
                            : 'bg-[#111111] border-[#1E1E1E] text-[#ccc3d8] hover:border-[#ccc3d8]/40'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#ccc3d8]  mb-2 font-semibold uppercase">Academic Standing</label>
                  <select 
                    value={prefLevel}
                    onChange={(e) => setPrefLevel(e.target.value)}
                    className="w-full bg-[#111111] border border-[#1E1E1E] rounded-lg p-2.5 font-sans font-medium text-white outline-none"
                  >
                    <option value="Undergraduate">Undergraduate Student</option>
                    <option value="Graduate">Master's Program</option>
                    <option value="Post-Graduate">PhD / Fellow Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#ccc3d8]  mb-1.5 font-semibold uppercase flex justify-between">
                    <span>Minimum Index Stipend</span>
                    <span className="text-[#10b981] font-bold">${prefStipend}/mo</span>
                  </label>
                  <input 
                    type="range" 
                    min="3000" 
                    max="12000" 
                    step="500" 
                    value={prefStipend} 
                    onChange={(e) => setPrefStipend(Number(e.target.value))}
                    className="w-full text-[#F5A623]" 
                  />
                  <div className="flex justify-between  text-[9px] text-[#ccc3d8] mt-1">
                    <span>$3,000</span>
                    <span>$12,000</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b border-[#1E1E1E]/20">
                  <div>
                    <label className="text-white  font-semibold block">Require Remote Opportunities</label>
                    <span className="text-[10px] text-[#ccc3d8]/70 block font-sans">Only view places with remote tag enabled</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={prefRemote} 
                    onChange={(e) => setPrefRemote(e.target.checked)} 
                    className="w-4 h-4 text-[#F5A623]" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={() => {
                  setPersonalizedFeedback(true);
                  setPersonalizeFeedOpen(false);
                  setActiveTab('internships');
                }}
                className="w-full bg-[#F5A623] text-white hover:bg-[#D4881A] py-3 rounded-xl  text-xs font-bold transition-all text-center"
              >
                Apply Parameters & Align List
              </button>
              <button
                onClick={() => {
                  setPersonalizedFeedback(false);
                  setPersonalizeFeedOpen(false);
                }}
                className="w-full border border-[#1E1E1E] hover:bg-[#111111] text-white py-2.5 rounded-xl  text-xs transition-all text-center"
              >
                Turn Off Customization
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 3. ALERST INTEL MODAL */}
      {alertsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden animate-scale-up">
            <button 
              onClick={() => setAlertsModalOpen(false)}
              className="absolute top-4 right-4 text-[#ccc3d8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!alertsSubscribed ? (
              <form onSubmit={handleSubscribeAlerts} className="space-y-4">
                <div className="text-center">
                  <Mail className="w-10 h-10 text-[#F5A623] mx-auto mb-3" />
                  <h3 className="font-display font-bold text-lg text-white mb-2">Subscribe to Loot Alerts</h3>
                  <p className="font-sans text-xs text-[#ccc3d8] mb-6">
                    Get instantly notified about premium fully-funded scholarships, grants and elite student fellowships.
                  </p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className=" text-[10px] text-[#ccc3d8] font-semibold">UNIVERSITY EMAIL ADDRESS</label>
                  <input 
                    type="email"
                    required
                    value={alertsEmail}
                    onChange={(e) => setAlertsEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full p-3 bg-[#111111] border border-[#1E1E1E] rounded-lg text-xs outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#F5A623] text-[#0B0B0B] py-3 rounded-xl  text-xs font-bold hover:bg-[#D4881A] transition-all"
                >
                  Activate Loot Notifications
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h3 className="font-display text-xl font-bold text-white">System Activated!</h3>
                <p className="font-sans text-xs text-[#ccc3d8]">
                  Weekly summaries are now prioritized to be dispatched to <strong>{alertsEmail}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. GENERAL DETAILS OVERVIEW DRAWER OR POPUP */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 max-w-lg w-full relative animate-scale-up">
            <button 
              onClick={() => setActiveDetailItem(null)}
              className="absolute top-4 right-4 text-[#ccc3d8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="bg-[#F5A623]/25 text-[#F5A623] border border-[#F5A623]/40 px-2.5 py-0.5 rounded  text-[9px] uppercase tracking-widest inline-block">
                Brief details
              </span>
              <h3 className="font-display font-bold text-lg md:text-xl text-white">
                {activeDetailItem.title}
              </h3>
              {activeDetailItem.partner && (
                <p className=" text-xs text-[#ccc3d8]">
                  Provider/Partner: <strong className="text-[#F5A623]">{activeDetailItem.partner}</strong>
                </p>
              )}
              {activeDetailItem.amount && (
                <p className=" text-xs text-[#ccc3d8]">
                  Compensation: <strong className="text-emerald-400">${activeDetailItem.amount}</strong>
                </p>
              )}
              <p className="font-sans text-xs text-[#ccc3d8] leading-relaxed pt-2 border-t border-[#1E1E1E]/20">
                {activeDetailItem.description}
              </p>

              {activeDetailItem.tags && (
                <div className="flex flex-wrap gap-1 pt-3">
                  {activeDetailItem.tags.map(t => (
                    <span key={t} className="bg-[#161616]/75 text-white px-2 py-0.5 rounded text-[9px] ">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setActiveDetailItem(null)}
                className="w-full mt-6 bg-[#111111] hover:bg-[#1E1E1E] text-white py-2.5 rounded-lg text-xs  font-bold transition-all border border-[#1E1E1E]"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
