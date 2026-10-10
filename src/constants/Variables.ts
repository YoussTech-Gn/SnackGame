import { Bounds, Coordinate } from "@/types/types";

const SNACK_INITIAL_POSITION: Coordinate[] = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION: Coordinate = { x: 5, y: 25 };
const GAME_BOUNDS: Bounds = { xMIn: 0, xMax: 35, yMax: 63, yMin: 0 };
const MOVE_INTERVAL: number = 50;
const SCORE_INCREMENT: number = 10;

export {
  FOOD_INITIAL_POSITION,
  GAME_BOUNDS,
  MOVE_INTERVAL,
  SCORE_INCREMENT,
  SNACK_INITIAL_POSITION,
};

export const FRUITS = [""];
