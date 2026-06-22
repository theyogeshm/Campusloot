// backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
// Import Routes
const authRoutes = require('./routes/authRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userRoutes = require('./routes/userRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables from backend/.env regardless of where node is invoked from
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// ─── SECURITY: Helmet — sets secure HTTP response headers automatically ───────
// Prevents XSS, clickjacking, MIME sniffing, and more.
app.use(helmet());

// Connect to MongoDB Atlas
connectDB();

// ─── RATE LIMITERS ────────────────────────────────────────────────────────────

// Login: max 5 attempts per 15 minutes (brute-force protection)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Register: max 3 accounts per hour (spam account prevention)
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many accounts created. Please try again after an hour.' }
});

// Contact form: max 5 submissions per hour (spam prevention)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many contact requests. Please try again later.' }
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allowed origins: Vite dev (3000), Astro dev (4321), legacy Vite (5173), and production URL from env
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4321',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

// Body parser with size limit (prevents large-payload / DoS attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Base Health Route ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'StudentStack API Server Running Smoothly... 🚀'
    });
});

// ─── Mount Routes with Rate Limiters applied at the route prefix level ────────
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/signup', registerLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use(errorMiddleware);

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server blasting off on port ${PORT} 🔥`);
}); 