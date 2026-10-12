import { useMemo } from "react";
import { Directions, Gesture } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";

const MIN_SWIPE = 20; // minimum distance (px) for a movement to count as a real swipe
const MAX_QUEUE = 2; // never store more than two pending swipes

const isOpposite = (a: Directions, b: Directions) => {
  "worklet"; // must be a worklet because the gesture runs on the UI thread
  return (
    (a === Directions.LEFT && b === Directions.RIGHT) ||
    (a === Directions.RIGHT && b === Directions.LEFT) ||
    (a === Directions.UP && b === Directions.DOWN) ||
    (a === Directions.DOWN && b === Directions.UP)
  );
};

type Params = {
  direction: SharedValue<Directions>; // last direction actually applied (owned by the screen)
  directionQueue: SharedValue<Directions[]>; // queue of pending wishes (owned by the screen)
};

export const useSnakeGesture = ({ direction, directionQueue }: Params) => {
  // Internal state that only the gesture needs, so it lives here
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);

  // useMemo: avoid creating a brand-new Gesture.Pan() on every render
  return useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          originX.value = 0;
          originY.value = 0;
        })
        .onUpdate((e) => {
          // Movement since the last "reset point", not since the first touch
          const dx = e.translationX - originX.value;
          const dy = e.translationY - originY.value;

          // 1) Minimum-distance filter: prevents flickering near the diagonals
          if (Math.max(Math.abs(dx), Math.abs(dy)) < MIN_SWIPE) return;

          // 2) Pick the dominant axis
          let next: Directions;
          if (Math.abs(dx) > Math.abs(dy)) {
            next = dx > 0 ? Directions.RIGHT : Directions.LEFT;
          } else {
            next = dy > 0 ? Directions.DOWN : Directions.UP;
          }

          // 3) Reset the origin so the next turn is measured as a fresh swipe
          originX.value = e.translationX;
          originY.value = e.translationY;

          // 4) Compare with the last queued direction (or the current one if the queue is empty)
          const queue = directionQueue.value;
          const reference =
            queue.length > 0 ? queue[queue.length - 1] : direction.value;
          if (next === reference || isOpposite(next, reference)) return;
          if (queue.length >= MAX_QUEUE) return;

          directionQueue.value = [...queue, next];
        }),
    [direction, directionQueue, originX, originY],
  );
};
