import { initTestDb, resetDb } from "@/utils.js";
import { genAid } from '@/aid.js';
import { DataSource, MoreThan, Repository } from "typeorm";
import { Uri } from "@/models/uri.js";

describe('test', () => {
    let db: DataSource;
    let uriRepository: Repository<Uri>;
    let sizes: Map<Date, {
        comment: string;
        uri: string;
        unique: string;
        notUnique: string;
    }> = new Map();
    let log = '';

    async function checkSize(db: DataSource, comment = '') {
        const uriSize = await db.query(`SELECT pg_size_pretty(pg_total_relation_size('uri'));`);

        const idx = await db.query(`SELECT tablename, indexname, relpages, pg_size_pretty(pg_relation_size(N.oid)) FROM pg_indexes IX
            LEFT JOIN pg_class N on (N.relname = IX.indexname)
            WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
            ORDER BY pg_relation_size(N.oid) DESC;`);

        sizes.set(new Date(), {
            comment,
            uri: uriSize[0].pg_size_pretty,
            unique: idx.find((d: any) => d.indexname === 'IDX_410acbc30b592c07d9789dc80e')?.pg_size_pretty || 'unknown',
            notUnique: idx.find((d: any) => d.indexname === 'IDX_f9780e670b8af92bb34e0307b0')?.pg_size_pretty || 'unknown',
        });
    }

    beforeEach(async () => {
        log = '';
        // Initialize the test database
        db = await initTestDb();
        uriRepository = db.getRepository(Uri);
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
            log += `  DB: ${size.uri}  UNIQUE: ${size.unique}  NOT UNIQUE: ${size.notUnique}\n`;
        }
        console.log(log);
        //#endregion
    });

    test('Test $operation ', async () => {
        log += `\n\n=== URI ===\n`;

        let shift = 0;

        await uriRepository.insert(Array.from({ length: 5000 }, (_, i) => {
            shift++;
            const id = genAid(Date.now() + shift);
            // random 32~96 characters
            const uri = Array.from({ length: Math.floor(Math.random() * (96 - 32 + 1)) + 32 }, () => Math.random().toString(36)[2]).join('');
            return {
                id,
                uri,
                uriu: uri,
            };
        }));

        await checkSize(db, 'After inserting 5000 entries');

        await db.query(`VACUUM;`);
        await checkSize(db, 'After VACUUM');
        await db.query(`REINDEX TABLE CONCURRENTLY uri;`);
        await checkSize(db, 'After REINDEX');

        await uriRepository.delete({
            id: MoreThan('0'),
        });
        await checkSize(db, 'After deleting all entries');
        console.log(await uriRepository.count());

        await db.query(`VACUUM;`);
        await checkSize(db, 'After VACUUM');
        await db.query(`REINDEX TABLE CONCURRENTLY uri;`);
        await checkSize(db, 'After REINDEX');
    });
});
