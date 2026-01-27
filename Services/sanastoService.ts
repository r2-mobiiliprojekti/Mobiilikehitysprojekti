import { Sanasto } from "../Types/sanasto"

const DATA = require('../Data/sanasto.json') as Sanasto[]

export function getRandomWord(): Sanasto {
  return DATA[Math.floor(Math.random() * DATA.length)]
}

export function isCorrect(word: Sanasto, answer: string): boolean {
  const user = answer.trim().toLowerCase()
  return word.translations.some(
    (t) => t.trim().toLowerCase() === user
  )
}