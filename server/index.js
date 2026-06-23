import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import FileIncidentRepository from './repository/FileIncidentRepository.js';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const storagePath = process.env.INCIDENT_STORAGE_PATH || path.join(__dirname, 'data', 'incidents.json');
const repository = new FileIncidentRepository(storagePath);

app.get('/api/incidents', async (req, res) => {
  const incidents = await repository.loadAll();
  res.json(incidents);
});

app.post('/api/incidents', async (req, res) => {
  try {
    const incident = await repository.save(req.body);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save incident' });
  }
});

const PORT = process.env.PORT || 3001;

repository.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Incident API running on port ${PORT}`);
  });
});