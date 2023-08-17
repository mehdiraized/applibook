import Dexie from 'dexie';

export const db = new Dexie('applibookDb');
db.version(2).stores({
	users:
		'++id, createAt, updateAt, name, family, phone, nationalCode, unit, rank, startDate, arriveDate, books',
	books: '++id, createAt, updateAt, name, author, description, category, date, publishers' // Primary key and indexed props
});
