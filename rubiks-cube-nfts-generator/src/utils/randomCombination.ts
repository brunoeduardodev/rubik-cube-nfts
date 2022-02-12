import { random, emoji } from "node-emoji";

const emojiList = Object.keys(emoji);

// enum Colors {
//   white =  0,
//   blue = 1,
//   orange = 2,
//   green = 3,
//   red = 4,
//   yellow = 5
// }

const generateRandomColor = () => {
  const number = Math.floor(Math.random() * 6);
  return String(number);
};

const generateRandomColorCombination = () => {
  const emptyList = Array.from(Array(9));
  const list = emptyList.map(generateRandomColor).join("");

  return list;
};

const generateRandomEmoji = () => {
  const randomPosition = Math.floor(Math.random() * 1878);
  return String(randomPosition).padStart(4, "0");
};

const generateRandomEmojiCombination = () => {
  const emptyList = Array.from(Array(9));
  const list = emptyList.map(generateRandomEmoji).join("");
  return list;
};

export const randomCombination = () => {
  // Combination Schema
  // First 9 numbers are (from 0 to 5) the colors of the rubik following the order:

  /**
   * [0][1][2]
   * [3][4][5]
   * [6][7][8]
   */

  // The following combinations are (from 0 to 1877) the emoji of each color following the last order

  const colors = generateRandomColorCombination();
  const emojis = generateRandomEmojiCombination();

  return `${colors}${emojis}`;
};

export const getColorsFromCombination = (combination: string) => {
  const colorsCombinations = combination.slice(0, 9);
  const colorsArray = colorsCombinations.split("");
  return colorsArray.map(Number);
};

export const getEmojisFromCombination = (combination: string) => {
  const chunks: string[] = [];
  const emojisCombinations = combination.slice(9);
  const emojisArray = emojisCombinations.split("");

  for (let i = 0; i < 9; i++) {
    const emoji = emojisArray.slice(i * 4, (i + 1) * 4).join("");
    chunks.push(emoji);
  }

  return chunks.map(Number);
};
