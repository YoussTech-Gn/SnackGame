import { Bounds, Coordinate } from "@/types/types";

const checkGameOver = (snackHead: Coordinate, boundaries: Bounds): Boolean => {
  return (
    snackHead.x < boundaries.xMIn ||
    snackHead.x > boundaries.xMax ||
    snackHead.y < boundaries.yMin ||
    snackHead.y > boundaries.yMax
  );
};

export { checkGameOver };
