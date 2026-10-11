import { Colors } from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import { Directions, GestureDetector } from "react-native-gesture-handler";
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
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

const SnackGame = () => {
  const isPressed = useSharedValue<boolean>(false);
  const offset = useSharedValue<Coordinate>({ x: 0, y: 0 });
  const direction = useSharedValue<Directions>(Directions.RIGHT);
  const snack = useSharedValue<Coordinate[]>(SNACK_INITIAL_POSITION);
  const food = useSharedValue<Coordinate>(FOOD_INITIAL_POSITION);
  const isPaused = useSharedValue<boolean>(false);
  const isGameOver = useSharedValue<boolean>(false);
  const score = useSharedValue<number>(0);
  const accumulator = useSharedValue<number>(0);

  const gestureDetector = useSnakeGesture();

  // دوال مساعدة مع توجيه 'worklet' للعمل بأمان تام على الـ UI Thread

  // حلقة الإطارات الذكية المزودة بمركم الوقت (Time Accumulator) وحماية الخلفية
  useFrameCallback((frameInfo) => {
    "worklet";
    if (isGameOver.value || isPaused.value) return;

    const dt = frameInfo.timeSincePreviousFrame ?? 0;

    // 🛡️ صمام أمان الخلفية: منع تراكم الوقت لو خرج المستخدم من التطبيق وعاد
    const safeDt = Math.min(dt, 100);

    accumulator.value += safeDt;

    // تنفيذ خطوة الثعبان فقط عند بلوغ الفاصل الزمني المطلوب (مثلاً كل 150ms)
    if (accumulator.value >= MOVE_INTERVAL) {
      accumulator.value = 0;

      const snakeHead = snack.value[0];
      const newHead = { ...snakeHead };

      // 1. فحص الحدود
      if (checkGameOverWorklet(snakeHead, GAME_BOUNDS)) {
        isGameOver.value = true;
        return;
      }

      // 2. تحديث الاتجاه للرأس الجديد
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
        default:
          break;
      }

      // 3. فحص أكل الطعام والنمو
      if (checkEatsFoodWorklet(newHead, food.value)) {
        snack.value = [newHead, ...snack.value];
        food.value = randomFoodWorklet(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax);
        score.value += SCORE_INCREMENT;
      } else {
        snack.value = [newHead, ...snack.value.slice(0, -1)];
      }
    }
  });

  const animated = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      ],
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <GestureDetector gesture={gestureDetector}>
        <View
          style={{
            backgroundColor: Colors.background,
            flex: 1,
            borderColor: Colors.primary,
            borderWidth: 12,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            borderRadius: 5,
          }}
        >
          <Animated.View style={[setStyle.snack, animated]} />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default SnackGame;

const setStyle = StyleSheet.create({
  snack: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    position: "absolute",
    borderRadius: 8,
  },
});
