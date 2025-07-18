import { DataSource } from 'typeorm';
import config from './built/config.js';
import { models } from './built/models-index.js';

export default new DataSource({
	type: 'postgres',
	host: config.db.host,
	port: config.db.port,
	username: config.db.user,
	password: config.db.password,
	database: config.db.db,

	entities: models,
	migrations: ['migration/*.js'],
	migrationsTransactionMode: 'each',
});
