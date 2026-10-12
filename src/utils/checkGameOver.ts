import { Bounds, Coordinate } from "@/types/types";

const checkGameOverWorklet = (head: Coordinate, bounds: Bounds) => {
  "worklet";
  return (
    head.x < bounds.xMin ||
    head.x > bounds.xMax ||
    head.y < bounds.yMin ||
    head.y > bounds.yMax
  );
};

export { checkGameOverWorklet };
