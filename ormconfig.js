import { DataSource } from 'typeorm';
import config from './built/config.js';
import { Note } from './built/models/note.js';

export default new DataSource({
	type: 'postgres',
	host: config.db.host,
	port: config.db.port,
	username: config.db.user,
	password: config.db.password,
	database: config.db.db,

	entities: [
		Note,
	],
	migrations: ['migration/*.js'],
	migrationsTransactionMode: 'each',
});
