import { initTestDb, resetDb } from "./utils.js";
import { Note } from './models/note.js';

const db = await initTestDb();
await resetDb(db);
const notesRepository = db.getRepository(Note);
