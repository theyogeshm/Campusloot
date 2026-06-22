// backend/middleware/validate.js
// Centralized input validation using express-validator
// Prevents NoSQL injection, XSS, and bad data from reaching controllers.

const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// ─── Validation Error Handler ─────────────────────────────────────────────────
// Call this as the LAST item in a route's middleware chain to return errors.
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// ─── Auth Validation Rules ────────────────────────────────────────────────────

const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email too long'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters'),
    body('college')
        .optional()
        .trim()
        .isLength({ max: 120 }).withMessage('College name too long')
        .escape(),
    body('branch')
        .optional()
        .trim()
        .isLength({ max: 80 }).withMessage('Branch name too long')
        .escape(),
    body('year')
        .optional()
        .isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
    handleValidation
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email too long'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password too long'),
    handleValidation
];

// ─── Contact Validation Rules ─────────────────────────────────────────────────

const validateContact = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email too long'),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 3, max: 150 }).withMessage('Subject must be 3–150 characters')
        .escape(),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters')
        .escape(),
    handleValidation
];

// ─── MongoDB ObjectId Validator ───────────────────────────────────────────────
// Use as middleware on any route with an :id param to guard against CastError.
const validateObjectId = (paramName = 'id') => [
    param(paramName).custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid ID format');
        }
        return true;
    }),
    handleValidation
];

module.exports = {
    validateRegister,
    validateLogin,
    validateContact,
    validateObjectId,
    handleValidation
};
