import { Coordinate } from "@/types/types";

const checkEatsFoodWorklet = (head: Coordinate, food: Coordinate) => {
  "worklet";
  return head.x === food.x && head.y === food.y;
};

export { checkEatsFoodWorklet };
