import { createContext } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';

export const DbContext = createContext<SQLiteDatabase | null>(null);
