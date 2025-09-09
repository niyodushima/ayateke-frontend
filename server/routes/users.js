import express from 'express';
const router = express.Router();

const users = [
  { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'staff' },
];

router.get('/', (req, res) => {
  res.json(users);
});

export default router;
