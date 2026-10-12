import { Colors } from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import { Directions, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  FOOD_INITIAL_POSITION,
  GAME_BOUNDS,
  MOVE_INTERVAL,
  SCORE_INCREMENT,
  SNACK_INITIAL_POSITION,
} from "@/constants/Variables";
import { useSnakeGesture } from "@/hooks/useSnakeGesture";
import { Coordinate } from "@/types/types";
import { checkEatsFoodWorklet } from "@/utils/checkEatsFood";
import { checkGameOverWorklet } from "@/utils/checkGameOver";
import { randomFoodWorklet } from "@/utils/randomFood";

const CELL = 16; // cell size in px (game coordinates are in cell units)
const MAX_SEGMENTS = 100; // maximum snake length
const SEGMENT_INDEXES = Array.from({ length: MAX_SEGMENTS }, (_, i) => i);

// One pre-built view per possible segment. It reads its own position
// from the snake array and hides itself if that segment doesn't exist.
const Segment = ({
  index,
  snack,
}: {
  index: number;
  snack: SharedValue<Coordinate[]>;
}) => {
  const style = useAnimatedStyle(() => {
    const part = snack.value[index];
    if (!part) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [{ translateX: part.x * CELL }, { translateY: part.y * CELL }],
    };
  });
  return <Animated.View style={[styles.cell, style]} />;
};

const SnackGame = () => {
  const direction = useSharedValue<Directions>(Directions.RIGHT);
  const directionQueue = useSharedValue<Directions[]>([]);
  const snack = useSharedValue<Coordinate[]>(SNACK_INITIAL_POSITION);
  const food = useSharedValue<Coordinate>(FOOD_INITIAL_POSITION);
  const isPaused = useSharedValue<boolean>(false);
  const isGameOver = useSharedValue<boolean>(false);
  const score = useSharedValue<number>(0);
  const accumulator = useSharedValue<number>(0);

  // The screen owns the state and passes it down to the hook (single source of truth)
  const gesture = useSnakeGesture({ direction, directionQueue });

  useFrameCallback((frameInfo) => {
    "worklet";
    // The only things that control "is the game running" are isPaused and isGameOver
    if (isGameOver.value || isPaused.value) return;

    // Safety valve: cap dt so returning from the background doesn't cause a time jump
    const dt = Math.min(frameInfo.timeSincePreviousFrame ?? 0, 100);
    accumulator.value += dt;
    if (accumulator.value < MOVE_INTERVAL) return;

    // Subtract the interval instead of zeroing, so leftover time is not lost
    accumulator.value -= MOVE_INTERVAL;

    // Take only ONE queued direction per step
    if (directionQueue.value.length > 0) {
      const [next, ...rest] = directionQueue.value;
      direction.value = next;
      directionQueue.value = rest;
    }

    // Compute the new head position
    const newHead = { ...snack.value[0] };
    switch (direction.value) {
      case Directions.UP:
        newHead.y -= 1;
        break;
      case Directions.DOWN:
        newHead.y += 1;
        break;
      case Directions.LEFT:
        newHead.x -= 1;
        break;
      case Directions.RIGHT:
        newHead.x += 1;
        break;
    }

    // Check the NEW head (not the old one), including collision with the body
    const ate = checkEatsFoodWorklet(newHead, food.value);
    // If the snake doesn't eat, its tail moves away, so exclude it from the check
    const body = ate ? snack.value : snack.value.slice(0, -1);
    const hitSelf = body.some((s) => s.x === newHead.x && s.y === newHead.y);

    if (checkGameOverWorklet(newHead, GAME_BOUNDS) || hitSelf) {
      isGameOver.value = true;
      return;
    }

    if (ate) {
      // Grow: keep the tail, add the new head
      snack.value = [newHead, ...snack.value];
      food.value = randomFoodWorklet(GAME_BOUNDS, snack.value);
      score.value += SCORE_INCREMENT;
    } else {
      // Move: add the new head, drop the tail
      snack.value = [newHead, ...snack.value.slice(0, -1)];
    }
  });

  const foodStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: food.value.x * CELL },
      { translateY: food.value.y * CELL },
    ],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.board}>
          {SEGMENT_INDEXES.map((i) => (
            <Segment key={i} index={i} snack={snack} />
          ))}
          <Animated.View style={[styles.cell, styles.food, foodStyle]} />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default SnackGame;

const styles = StyleSheet.create({
  board: {
    backgroundColor: Colors.background,
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderRadius: 5,
  },
  cell: {
    width: CELL,
    height: CELL,
    backgroundColor: Colors.primary,
    position: "absolute",
    borderRadius: CELL / 2,
  },
  food: { backgroundColor: "red" },
});
