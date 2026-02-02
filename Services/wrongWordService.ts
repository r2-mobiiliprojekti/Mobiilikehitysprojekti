import type { SQLiteDatabase } from 'expo-sqlite';

export async function saveWrongWord(db: SQLiteDatabase, word: string) {
  await db.runAsync(
    `INSERT INTO wrong_words (word, created_at) VALUES (?, ?);`,
    [word, new Date().toISOString()]
  );
}
