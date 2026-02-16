import type { SQLiteDatabase } from 'expo-sqlite';

export async function saveCorrectWord(db: SQLiteDatabase, word: string) {
  await db.runAsync(
    `INSERT INTO correct_words (word, created_at) VALUES (?, ?);`,
    [word, new Date().toISOString()]
  );
}
