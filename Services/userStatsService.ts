import type { SQLiteDatabase } from 'expo-sqlite';

export async function getUserStats(db: SQLiteDatabase) {
  const result = await db.getFirstAsync(`
    SELECT
      current_streak,
      best_streak,
      current_wrong_streak,
      worst_wrong_streak
    FROM user_stats
    WHERE id = 1
  `);

  return result ?? {
    current_streak: 0,
    best_streak: 0,
    current_wrong_streak: 0,
    worst_wrong_streak: 0,
  };
}
