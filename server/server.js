import express from 'express';
import cors from 'cors';
import responsesRouter from './routes/responses.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/responses', responsesRouter);
app.use('/api/admin', adminRouter);
app.get('/', (req, res) => res.send('Questionnaire-system server is running.'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
