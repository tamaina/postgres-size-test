import { initTestDb, resetDb } from "./utils.js";
import { Note } from './models/note.js';
import { genAid } from './aid.js';
import config from "./config.js";

const db = await initTestDb();
const notesRepository = db.getRepository(Note);

const sizes = new Map<Date, { comment: string; note: string; whole: string; }>();

async function checkSize(comment = '') {
    const noteSize = await db.query(`SELECT pg_size_pretty(pg_total_relation_size('note'));`);
    const whole = await db.query(`SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;`);
    sizes.set(new Date(), { comment, note: noteSize[0].pg_size_pretty, whole: whole.find((d: any) => d.datname === config.db.db)?.pg_size_pretty || 'unknown' });
}

await resetDb(db);
await db.query(`VACUUM;`);
await db.query(`VACUUM FULL;`);

await checkSize('Initial');

let ids = new Set<string>();
let renoteIds = new Set<string>();
let shift = 0;

await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
    shift++;
    const id = genAid(Date.now() + shift);
    ids.add(id);
    return {
        id,
        text: 'a'.repeat(512),
        renoteId: null,
    };
}));

await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
    shift++;
    const id = genAid(Date.now() + shift);
    ids.add(id);
    return {
        id,
        text: 'a'.repeat(512),
        // Pick a random renote ID from the previous set
        renoteId: ids.size > 0 ? Array.from(ids)[Math.floor(Math.random() * ids.size)] : null,
    };
}));

await checkSize('After inserting 1024 notes');

await db.query(`VACUUM;`);

await checkSize('After VACUUM');

console.log('Sizes:');
for (const [date, size] of sizes) {
    console.log(date.toISOString(), size.comment);
    console.log('  Note: ', size.note, '  Whole DB: ', size.whole);
}

db.destroy().catch(console.error);
