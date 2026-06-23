// server/repository/FileIncidentRepository.js
import fs from 'fs/promises';
import path from 'path';
import IncidentRepository from './IncidentRepository.js';

export default class FileIncidentRepository extends IncidentRepository {
  constructor(storagePath) {
    super();
    this.storagePath = storagePath;
    this.directory = path.dirname(storagePath);
    this.lock = Promise.resolve();
  }

  async initialize() {
    try {
      await fs.mkdir(this.directory, { recursive: true });
      try {
        await fs.access(this.storagePath);
      } catch {
        console.log(`[Storage] Creating new storage file at ${this.storagePath}`);
        await fs.writeFile(this.storagePath, JSON.stringify([]), 'utf8');
      }
      console.log(`[Storage] Successfully initialized at ${this.storagePath}`);
    } catch (error) {
      console.error('[Storage] Error initializing file storage:', error);
    }
  }

  async loadAll() {
    return this._synchronized(async () => {
      try {
        const data = await fs.readFile(this.storagePath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        console.error('[Storage] Error reading file, returning empty collection:', error);
        return [];
      }
    });
  }

  async save(incident) {
    return this._synchronized(async () => {
      try {
        let incidents = [];
        try {
          const data = await fs.readFile(this.storagePath, 'utf8');
          incidents = JSON.parse(data);
        } catch (e) {
          console.error('[Storage] File unreadable/missing during save, starting fresh.');
        }

        const existingIndex = incidents.findIndex(i => i.id === incident.id);
        if (existingIndex >= 0) {
          incidents[existingIndex] = incident;
        } else {
          incidents.push(incident);
        }

        await fs.writeFile(this.storagePath, JSON.stringify(incidents, null, 2), 'utf8');
        return incident;
      } catch (error) {
        console.error('[Storage] Error saving incident:', error);
        throw error;
      }
    });
  }

  async delete(id) {
    return this._synchronized(async () => {
      try {
        let incidents = [];
        const data = await fs.readFile(this.storagePath, 'utf8');
        incidents = JSON.parse(data);
        incidents = incidents.filter(i => i.id !== id);
        await fs.writeFile(this.storagePath, JSON.stringify(incidents, null, 2), 'utf8');
        console.log(`[Storage] Deleted incident ${id}`);
        return true;
      } catch (error) {
        console.error('[Storage] Error deleting incident:', error);
        throw error;
      }
    });
  }

  async _synchronized(action) {
    let release;
    const currentLock = this.lock;
    this.lock = new Promise(resolve => { release = resolve; });
    await currentLock;
    try {
      return await action();
    } finally {
      release();
    }
  }
}