import type { SQLiteDatabase } from 'expo-sqlite';

export async function getStats(db: SQLiteDatabase) {
  const wrong = await db.getAllAsync(
    `SELECT COUNT(*) as c FROM wrong_words;`
  );

  const correct = await db.getAllAsync(
    `SELECT COUNT(*) as c FROM correct_words;`
  );

  return {
    wrong: wrong?.[0]?.c ?? 0,
    correct: correct?.[0]?.c ?? 0,
  };
}
