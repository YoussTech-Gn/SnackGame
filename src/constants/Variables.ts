import { Bounds, Coordinate } from "@/types/types";

// Game rules: identical on every device
const COLS = 20;
const ROWS = 36;

// Bounds are INCLUSIVE: valid cells are 0..COLS-1 and 0..ROWS-1
const GAME_BOUNDS: Bounds = {
  xMin: 0,
  xMax: COLS - 1,
  yMin: 0,
  yMax: ROWS - 1,
};

const SNACK_INITIAL_POSITION: Coordinate[] = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION: Coordinate = { x: 5, y: 15 };
const MOVE_INTERVAL = 120; // ms per step; tune between 100 and 200
const SCORE_INCREMENT = 10;

export {
  COLS,
  FOOD_INITIAL_POSITION,
  GAME_BOUNDS,
  MOVE_INTERVAL,
  ROWS,
  SCORE_INCREMENT,
  SNACK_INITIAL_POSITION,
};
// FRUITS removed: it was unused dead code
