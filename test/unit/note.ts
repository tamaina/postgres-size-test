import { initTestDb, resetDb } from "@/utils.js";
import { Note } from '@/models/note.js';
import { genAid } from '@/aid.js';
import config from "@/config.js";
import { DataSource, IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Repository } from "typeorm";

describe('test', () => {
    let db: DataSource;
    let notesRepository: Repository<Note>;
    let sizes: Map<Date, {
        comment: string;
        note: string;
        whole: string;
        pk: string;
        rnIdx: string;
    }> = new Map();
    let log = '';

    async function checkSize(db: DataSource, comment = '') {
        const noteSize = await db.query(`SELECT pg_size_pretty(pg_total_relation_size('note'));`);
        const whole = await db.query(`SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;`);

        const idx = await db.query(`SELECT tablename, indexname, relpages, pg_size_pretty(pg_relation_size(N.oid)) FROM pg_indexes IX
            LEFT JOIN pg_class N on (N.relname = IX.indexname)
            WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
            ORDER BY pg_relation_size(N.oid) DESC;`);
            
        sizes.set(new Date(), {
            comment,
            note: noteSize[0].pg_size_pretty,
            whole: whole.find((d: any) => d.datname === config.db.db)?.pg_size_pretty || 'unknown',
            pk: idx.find((d: any) => d.indexname === 'PK_96d0c172a4fba276b1bbed43058')?.pg_size_pretty || 'unknown',
            rnIdx: idx.find((d: any) => d.indexname === 'IDX_52ccc804d7c69037d558bac4c9')?.pg_size_pretty || 'unknown',
        });
    }

    beforeEach(async () => {
        log = '';
        // Initialize the test database
        db = await initTestDb();
        notesRepository = db.getRepository(Note);
        sizes = new Map();
        await resetDb(db);
        await db.query(`VACUUM;`);
        await db.query(`VACUUM FULL;`);

        await checkSize(db, 'Initial');
    });

    afterEach(async () => {
        await db.destroy();

        //#region log
        for (const [date, size] of sizes) {
            log += size.comment + '\t';
            log += date.toISOString() + '\n';
            log += `  Note: ${size.note}  Whole DB: ${size.whole}  PK: ${size.pk}  RN IDX: ${size.rnIdx}\n`;
        }
        console.log(log);
        //#endregion
    });

    test.each([
        {operation: 'UPDATE', vacuum: true},
        {operation: 'DELETE', vacuum: true},
        {operation: 'UPDATE', vacuum: false},
        {operation: 'DELETE', vacuum: false},
    ])('Test $operation ', async ({operation, vacuum}) => {
        log += `\n\n=== ${operation}, VACUUM: ${vacuum} ===\n`;

        let ids = new Set<string>();
        let firstId = genAid(Date.now());
        let renoteIds = new Set<string>();
        let shift = 0;

        await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
            shift++;
            const id = i === 0 ? firstId : genAid(Date.now() + shift);
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
            renoteIds.add(id);
            return {
                id,
                text: 'b'.repeat(512),
                // Pick a random renote ID from the previous set
                renoteId: firstId,
            };
        }));

        await checkSize(db, 'After inserting 1024 notes');

        // 前半256件を削除したい
        if (operation === 'DELETE') {
            // Delete 256 notes without firstId
            const idsToDelete = Array.from(ids).filter(id => id !== firstId).slice(0, 256);
            await notesRepository.delete(idsToDelete);
        } else if (operation === 'UPDATE') {
            const lessThanId = Array.from(ids)
                .filter(id => id !== firstId)
                .sort((a, b) => a.localeCompare(b))[255];
            // Update all notes to set text to ''
            await notesRepository.createQueryBuilder()
                .update(Note)
                .set({ text: '' })
                .where({ id: MoreThan(firstId) })
                .andWhere({ id: LessThanOrEqual(lessThanId) })
                .execute();
        }

        await checkSize(db, `After ${operation}`);
        const cnt = await notesRepository.createQueryBuilder('note')
            .where({ text: Not(IsNull()) })
            .andWhere({ text: Not('') })
            .getCount();
        log += `Count after ${operation}: ${cnt}\n`;

        if (vacuum) {
            await db.query(`VACUUM;`);
            await checkSize(db, `After VACUUM`);
        }

        let secondIds = [] as string[];
        await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
            shift++;
            const id = genAid(Date.now() + shift);
            secondIds.push(id);
            return {
                id,
                text: 'c'.repeat(512),
                renoteId: null,
            };
        }));
        await checkSize(db, `After inserting 512 notes (2nd wave)`);

        await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
            shift++;
            const id = genAid(Date.now() + shift);
            return {
                id,
                text: 'd'.repeat(512),
                renoteId: firstId,
            };
        }));
        await checkSize(db, `After inserting 512 notes (3rd wave)`);

        // secondIdsは全部消す
        if (operation === 'DELETE') {
            await notesRepository.delete(secondIds);
        } else if (operation === 'UPDATE') {
            // Update all notes to set text to ''
            await notesRepository.createQueryBuilder()
                .update(Note)
                .set({ text: '' })
                .where({ id: MoreThanOrEqual(secondIds[0]) })
                .andWhere({ id: LessThanOrEqual(secondIds[secondIds.length - 1]) })
                .execute();
        }
        await checkSize(db, `After ${operation} secondIds`);

        if (vacuum) {
            await db.query(`VACUUM;`);
            await checkSize(db, `After VACUUM`);
        }

        await notesRepository.insert(Array.from({ length: 512 }, (_, i) => {
            shift++;
            const id = genAid(Date.now() + shift);
            return {
                id,
                text: 'e'.repeat(512),
                renoteId: null,
            };
        }));
        await checkSize(db, `After inserting 512 notes (4th wave)`);
    });
});
