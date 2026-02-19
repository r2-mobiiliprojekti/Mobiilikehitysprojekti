export async function updateStreak(db, isCorrect: boolean) {
  await db.runAsync(`
    INSERT OR IGNORE INTO user_stats (
      id, current_streak, best_streak, current_wrong_streak, worst_wrong_streak
    ) VALUES (1, 0, 0, 0, 0);
  `);

  const r = await db.getFirstAsync(`
    SELECT current_streak, best_streak, current_wrong_streak, worst_wrong_streak
    FROM user_stats WHERE id = 1
  `);

  const current = r?.current_streak ?? 0;
  const best = r?.best_streak ?? 0;
  const curWrong = r?.current_wrong_streak ?? 0;
  const worstWrong = r?.worst_wrong_streak ?? 0;

  let newCurrent = current;
  let newBest = best;
  let newCurWrong = curWrong;
  let newWorstWrong = worstWrong;

  if (isCorrect) {
    newCurrent = current + 1;
    newBest = Math.max(best, newCurrent);
    newCurWrong = 0; 
  } else {
    newCurrent = 0; 
    newCurWrong = curWrong + 1;
    newWorstWrong = Math.max(worstWrong, newCurWrong);
  }

  await db.runAsync(
    `UPDATE user_stats
     SET current_streak = ?, best_streak = ?,
         current_wrong_streak = ?, worst_wrong_streak = ?
     WHERE id = 1`,
    [newCurrent, newBest, newCurWrong, newWorstWrong]
  );

  return {
    current_streak: newCurrent,
    best_streak: newBest,
    current_wrong_streak: newCurWrong,
    worst_wrong_streak: newWorstWrong,
  };
}
