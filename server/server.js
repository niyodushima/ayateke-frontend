import express from 'express';
import cors from 'cors';
import attendanceRoutes from './routes/attendance.js';
import usersRoutes from './routes/users.js'; // we’ll create this

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
