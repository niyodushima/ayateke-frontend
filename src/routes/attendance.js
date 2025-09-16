import express from 'express';
import { body, validationResult } from 'express-validator';
import Attendance from '../models/attendance.js';

const router = express.Router();

const validateAttendance = [
  body('employee_id').notEmpty().withMessage('Employee ID is required'),
  body('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  body('clock_in')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Clock In must be in HH:MM format'),
  body('clock_out')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Clock Out must be in HH:MM format'),
];

router.post('/', validateAttendance, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newLog = await Attendance.addLog(req.body);
    res.status(201).json({ message: '✅
