// routes/attendance.js
import express from 'express';

const router = express.Router();

// In-memory attendance for today (swap with DB later)
let records = []; // [{ email, name, date: 'YYYY-MM-DD', checkIn, checkOut, status }]

const todayStr = () => new Date().toISOString().split('T')[0];

// GET today's attendance list
router.get('/today', (req, res) => {
  const today = todayStr();
  const todayRecs = records.filter((r) => r.date === today);
  res.json(todayRecs);
});

// POST check-in
router.post('/checkin', (req, res) => {
  const { email, name } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: 'email and name required' });

  const today = todayStr();
  const existing = records.find((r) => r.email === email && r.date === today);

  if (existing?.checkIn) {
    return res.status(409).json({ error: 'Already checked in today' });
  }

  const rec =
    existing || { email, name, date: today, checkIn: null, checkOut: null, status: 'Present' };

  rec.checkIn = new Date().toISOString();
  rec.status = 'Present';

  if (!existing) records.push(rec);
  return res.json(rec);
});

// POST check-out
router.post('/checkout', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  const today = todayStr();
  const existing = records.find((r) => r.email === email && r.date === today);

  if (!existing?.checkIn) {
    return res.status(404).json({ error: 'No check-in found for today' });
  }
  if (existing.checkOut) {
    return res.status(409).json({ error: 'Already checked out today' });
  }

  existing.checkOut = new Date().toISOString();
  existing.status = 'Completed';

  return res.json(existing);
});

export default router;
