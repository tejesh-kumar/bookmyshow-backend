import { InitializeConfig } from '../server-config';
import db from '../db/mysql';

InitializeConfig();

async function tableSeeder<T extends Record<string, any>>(
  tableName: string,
  data: T[]
) {
  if (!data.length) return;

  const columns = Object.keys(data[0]!);

  const placeholders = columns.map(() => '?').join(', ');
  const updateClause = columns
    .map((col) => `${col} = VALUES(${col})`)
    .join(', ');

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    ON DUPLICATE KEY UPDATE ${updateClause}
  `;

  try {
    for (const row of data) {
      const values = columns.map((col) => row[col]);
      await db.execute(query, values);
    }
    console.log(`✅ Seeded ${tableName}`);
  } catch (err) {
    console.error(`❌ Error seeding ${tableName}:`, err);
    throw err;
  }
}

export async function clearTable(tableName: string) {
  try {
    await db.execute('SET FOREIGN_KEY_CHECKS = 0;');
    await db.execute(`TRUNCATE TABLE ${tableName};`);
    await db.execute(`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log(`✅ Cleared records of ${tableName}`);
  } catch (err) {
    console.error(`❌ Error clearing ${tableName}:`, err);
    throw err;
  }
}

export default tableSeeder;
