import { Bounds, Coordinate } from "@/types/types";

const randomFoodWorklet = (bounds: Bounds, snake: Coordinate[]): Coordinate => {
  "worklet";
  const cols = bounds.xMax - bounds.xMin + 1; // +1 because bounds are inclusive
  const rows = bounds.yMax - bounds.yMin + 1;

  // Collect every free cell, then pick one. This always terminates
  // (a retry loop could spin forever if the board is nearly full).
  const free: Coordinate[] = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const cell = { x: bounds.xMin + x, y: bounds.yMin + y };
      if (!snake.some((s) => s.x === cell.x && s.y === cell.y)) free.push(cell);
    }
  }
  // Board full = the player won. Park the food on the head; the caller can detect a win.
  if (free.length === 0) return snake[0];
  return free[Math.floor(Math.random() * free.length)];
};

export { randomFoodWorklet };
