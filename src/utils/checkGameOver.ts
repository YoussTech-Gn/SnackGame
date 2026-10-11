import { Bounds, Coordinate } from "@/types/types";

const checkGameOverWorklet = (head: Coordinate, bounds: Bounds) => {
  "worklet";
  return (
    head.x < bounds.xMIn ||
    head.x > bounds.xMax ||
    head.y < bounds.yMin ||
    head.y > bounds.yMax
  );
};

export { checkGameOverWorklet };
