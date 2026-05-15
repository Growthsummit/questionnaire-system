import express from 'express';
import cors from 'cors';
import responsesRouter from './routes/responses.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(cors({
  origin: '*', // Allow all origins for now to resolve "Failed to fetch"
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/responses', responsesRouter);
app.use('/api/admin', adminRouter);
app.get('/api/ping', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/', (req, res) => res.send('Questionnaire-system server is running.'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
