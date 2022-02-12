import {
  getColorsFromCombination,
  getEmojisFromCombination,
} from "../utils/randomCombination";

export const validateCombination = (combination: string) => {
  if (combination.length !== 45) return "Invalid combination";

  const colors = getColorsFromCombination(combination);
  const emojis = getEmojisFromCombination(combination);

  const colorError = colors.reduce(
    (error, current) => error || current < 0 || current > 5,
    false
  );
  if (colorError) return "Invalid color";

  const emojiError = emojis.reduce(
    (error, current) => error || (current < 0 && current > 1877),
    false
  );

  if (emojiError) return "Invalid emoji";

  return false;
};
