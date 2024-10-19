import { chars_range } from "./variables";

export function generateSharedKey(length: number = 10) {
  const characters = chars_range || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomKey = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomKey += characters[randomIndex];
  }

  return randomKey;
}
