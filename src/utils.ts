import config from './config.js';
import { DataSource } from "typeorm";
import { Note } from './models/note.js';

export async function initTestDb(justBorrow = false, initEntities?: any[]) {
	const db = new DataSource({
		type: 'postgres',
		host: config.db.host,
		port: config.db.port,
		username: config.db.user,
		password: config.db.password,
		database: config.db.db,
		synchronize: true && !justBorrow,
		dropSchema: true && !justBorrow,
		entities: [
            Note,
        ],
	});

	await db.initialize();

	return db;
}

export async function resetDb(db: DataSource) {
	const tables = await db.query(`SELECT relname AS "table"
	FROM pg_class C LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
	WHERE nspname NOT IN ('pg_catalog', 'information_schema')
		AND C.relkind = 'r'
		AND nspname !~ '^pg_toast';`);
	for (const table of tables) {
		await db.query(`DELETE FROM "${table.table}" CASCADE`);
	}
};
