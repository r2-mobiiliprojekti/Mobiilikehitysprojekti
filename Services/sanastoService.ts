import { Sanasto } from "../Types/sanasto"

const DATA = require('../Data/sanasto.json') as Sanasto[]

export function getRandomWord(): Sanasto {
  //return DATA[Math.floor(Math.random() * DATA.length)]
  const word = DATA[Math.floor(Math.random() * DATA.length)];
  return {
    ...word,
    translations: word.translations || [], // Ensure translations is always an array
  };
}

export function isCorrect(word: Sanasto, answer: string): boolean {
  const user = answer.trim().toLowerCase()
  return word.translations.some(
    (t) => t.trim().toLowerCase() === user
  )
}