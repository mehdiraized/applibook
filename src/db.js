import Dexie from 'dexie';

export const db = new Dexie('applibookDb');
db.version(2).stores({
	users:
		'++id, createAt, updateAt, name, family, phone, nationalCode, unit, rank, startDate, arriveDate, book',
	books: '++id, createAt, updateAt, name, author, description, category, year, publishers, image' // Primary key and indexed props
});
