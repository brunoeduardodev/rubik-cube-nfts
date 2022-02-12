import {
  getColorsFromCombination,
  getEmojisFromCombination,
  randomCombination,
} from "../utils/randomCombination";
import { createCanvas, registerFont } from "canvas";
import { emoji as emojiList } from "node-emoji";
import fs from "fs";
import path from "path";

type EmojiList = typeof emojiList;
type EmojiOptions = keyof EmojiList;
const emojiKeysList = Object.keys(emojiList);

const CUBE_CONSTRAINTS = {
  imageSize: 900,
  borderSize: 16,
};

export default class GenerateRandomService {
  static async execute(combination: string) {
    if (!combination) {
      combination = randomCombination();
    }

    return new Promise<string>((resolve) => {
      const { borderSize, imageSize } = CUBE_CONSTRAINTS;

      const colors = getColorsFromCombination(combination);
      const emojis = getEmojisFromCombination(combination);

      console.log("COLORS: ", colors);

      const colorsHexArray = [
        "#FFFFFF",
        "#0000FF",
        "#FF7500",
        "#00FF00",
        "#FF0000",
        "#FFFF00",
      ];

      const canvas = createCanvas(imageSize, imageSize);
      registerFont(path.join(__dirname, "fonts", "NotoColorEmoji.ttf"), {
        family: "NotoColorEmoji",
      });
      const ctx = canvas.getContext("2d");
      ctx.quality = "best";
      ctx.textDrawingMode = "glyph";
      // ctx.font = '60px "NotoColorEmoji"';

      // Draw Outer Lines

      // TOP LINE
      ctx.fillRect(0, 0, borderSize, borderSize);
      // LEFT LINE
      ctx.fillRect(0, 0, borderSize, imageSize);
      // BOTTOM LINE
      ctx.fillRect(0, imageSize - borderSize, imageSize, borderSize);
      // RIGHT LINE
      ctx.fillRect(imageSize - borderSize, 0, borderSize, imageSize);

      /**
       * The cube will have 300 of height, removing the outer borders we still have
       * 294 remaining, time to draw the 2 inner borders, if each border will use
       * 2 pixels of height, we'll have 288 avaible for colors so we'll have
       * (288) / 3 = 96 pixels to each color, so we'll need to skip 96 pixels
       */

      const colorSize = (imageSize - borderSize * 4) / 3;

      // FIRST INNER PARALLEL LINE
      ctx.fillRect(0, colorSize + borderSize, imageSize, borderSize);

      // SECOND INNER PARALLEL LINE
      ctx.fillRect(0, colorSize * 2 + borderSize * 2, imageSize, borderSize);

      // Lets do the same thing with the vertical lines.

      // FIRST INNER PERPENDICULAR LINE
      ctx.fillRect(colorSize + borderSize, 0, borderSize, imageSize);

      // FIRST INNER PERPENDICULAR LINE
      ctx.fillRect(colorSize * 2 + borderSize * 2, 0, borderSize, imageSize);

      const coords = (offsetX: number, offsetY: number) => {
        return {
          x: borderSize * (offsetX + 1) + colorSize * offsetX,
          y: borderSize * (offsetY + 1) + colorSize * offsetY,
        };
      };

      const colorsCoordinates = [
        coords(0, 0),
        coords(0, 1),
        coords(0, 2),
        coords(1, 0),
        coords(1, 1),
        coords(1, 2),
        coords(2, 0),
        coords(2, 1),
        coords(2, 2),
      ];

      console.log("coordinates: ", colorsCoordinates);

      colors.forEach((color, index) => {
        const { x, y } = colorsCoordinates[index];
        console.log("new color: ", colorsHexArray[color]);
        ctx.fillStyle = colorsHexArray[color];
        ctx.fillRect(x, y, colorSize, colorSize);
      });

      ctx.fillStyle = "black";
      ctx.font = '60px "NotoColorEmoji"';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // After adding the Colors, its time to add the emojis

      emojis.forEach((emoji, index) => {
        const { x, y } = colorsCoordinates[index];
        // With the color square coordinate, we can calculate the text position
        const xText = x + colorSize / 2;
        const yText = y + colorSize / 2;
        const emojiKey = emojiKeysList[emoji] as EmojiOptions;
        const emojiText = emojiList[emojiKey];
        ctx.fillText(emojiText, xText, yText);
      });

      const outDir = path.resolve(
        __dirname,
        "..",
        "..",
        "generated",
        `${combination}.jpg`
      );
      const canvasStream = canvas.createJPEGStream();
      const fileStream = fs.createWriteStream(outDir);
      canvasStream.pipe(fileStream);

      console.log("create write stream");
      fileStream.on("error", (error) => {
        console.log("error!");
        console.error(error);
      });
      fileStream.on("finish", () => {
        console.log("PNG FILE CREATED");
        resolve(outDir);
      });
    });
  }
}
