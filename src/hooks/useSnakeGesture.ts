import {
  FOOD_INITIAL_POSITION,
  SNACK_INITIAL_POSITION,
} from "@/constants/Variables";
import { Coordinate } from "@/types/types";
import { Directions, Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

const useSnakeGesture = () => {
  const isPressed = useSharedValue<Boolean>(false);
  const offset = useSharedValue<Coordinate>({ x: 0, y: 0 });
  const direction = useSharedValue<Directions>(Directions.RIGHT);
  const snack = useSharedValue<Coordinate[]>(SNACK_INITIAL_POSITION);
  const food = useSharedValue<Coordinate>(FOOD_INITIAL_POSITION);
  const isPaused = useSharedValue<boolean>(false);
  const score = useSharedValue<number>(0);
  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((e) => {
      const { translationX, translationY } = e;
      // // Compare horizontal and vertical translation to determine primary swipe axis
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0) {
          // setSetting((prev) => ({ ...prev, direction: Directions.RIGHT }));
          direction.value = Directions.RIGHT;
        } else {
          // setSetting((prev) => ({ ...prev, direction: Directions.LEFT }));
          direction.value = Directions.LEFT;
        }
      } else {
        if (translationY > 0) {
          // setSetting((prev) => ({ ...prev, direction: Directions.DOWN }));
          direction.value = Directions.DOWN;
        } else {
          // setSetting((prev) => ({ ...prev, direction: Directions.UP }));
          direction.value = Directions.UP;
        }
      }

      offset.value = {
        x: offset.value.x + translationX,
        y: offset.value.y + translationY,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return gesture;
};

export { useSnakeGesture };
