import { Sanasto } from "../Types/sanasto"

const DATA = require('../Data/sanasto.json') as Sanasto[]

export function getRandomSwedishWord(): Sanasto {
  return DATA[Math.floor(Math.random() * DATA.length)]
}

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

export function isCorrectFinnish(word: Sanasto, answer: string): boolean {
  const user = normalize(answer)
  return word.translations.some((t) => normalize(t) === user)
}

export function isCorrectSwedish(word: Sanasto, answer: string): boolean {
  return normalize(word.swedish) === normalize(answer)
}

export function getRandomFinnishTranslation(word: Sanasto): string {
  return word.translations[Math.floor(Math.random() * word.translations.length)]
}
