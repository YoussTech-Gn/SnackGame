import { Colors } from "@/constants/colors";
import { View } from "react-native";
import {
    Directions,
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";

import {
    FOOD_INITIAL_POSITION,
    GAME_BOUNDS,
    MOVE_INTERVAL,
    SCORE_INCREMENT,
    SNACK_INITIAL_POSITION,
} from "@/constants/Variables";
import { Coordinate } from "@/types/types";
import { checkEatsFood } from "@/utils/checkEatsFood";
import { checkGameOver } from "@/utils/checkGameOver";
import { randomFood } from "@/utils/randomFood";
import { useEffect, useState } from "react";
import Snack from "./Snack";

// Interface representing the entire game state structure
interface Settings {
  direction: Directions; // Current movement direction of the snake
  snack: Coordinate[];   // Array of coordinates representing snake body segments
  food: Coordinate;      // Current coordinate of the food item on the grid
  isGameOver: Boolean;   // Flag indicating if the game has ended
  IsPaused: Boolean;     // Flag indicating if the game is paused
  score: number;         // Current player score
}

// Initial default values to setup the game state on mount or reset
const initialSettign: Settings = {
  direction: Directions.RIGHT,
  IsPaused: false,
  food: FOOD_INITIAL_POSITION,
  isGameOver: false,
  snack: SNACK_INITIAL_POSITION,
  score: 0,
};

const SnackGame = () => {
  // Single source of truth state containing all game variables
  const [setting, setSetting] = useState<Settings>(initialSettign);

  // Pan gesture handler to translate screen swipes into snake directions
  const gesture = Gesture.Pan().onUpdate((e) => {
    const { translationX, translationY } = e;
    // Compare horizontal and vertical translation to determine primary swipe axis
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setSetting((prev) => ({ ...prev, direction: Directions.RIGHT }));
      } else {
        setSetting((prev) => ({ ...prev, direction: Directions.LEFT }));
      }
    } else {
      if (translationY > 0) {
        setSetting((prev) => ({ ...prev, direction: Directions.DOWN }));
      } else {
        setSetting((prev) => ({ ...prev, direction: Directions.UP }));
      }
    }
  });

  // Core movement engine handling snake coordinates update and collision rules
  const moveSnake = () => {
    const snakeHead = setting.snack[0];
    const newHead = { ...snakeHead }; // Create a shallow copy for the new head position

    // Check if the current head position violates game boundaries
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setSetting((prev) => ({ ...prev, isGameOver: !prev.isGameOver }));
      return;
    }

    // Update head coordinates based on the active movement direction
    switch (setting.direction) {
      case Directions.UP:
        newHead.y += 1;
        break;
      case Directions.DOWN:
        newHead.x -= 1;
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

    // Check if the new head coordinate intersects with the food position
    if (checkEatsFood({ head: newHead, area: 2, food: setting.food })) {
      setSetting((prev) => ({
        ...prev,
        snack: [newHead, ...prev.snack], // Grow snake by keeping the tail
      }));
      setSetting((prev) => ({
        ...prev,
        food: randomFood(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax), // Spawn new random food
      }));
      setSetting((prev) => ({
        ...prev,
        score: prev.score + SCORE_INCREMENT, // Increment player score
      }));
    } else {
      setSetting((prev) => ({
        ...prev,
        snack: [newHead, ...prev.snack.slice(0, -1)], // Standard movement: add head and remove last tail segment
      }));
    }
  };

  // Main game loop using setInterval to trigger snake movement at regular time intervals
  useEffect(() => {
    if (!setting.isGameOver) {
      const intervalId = setInterval(() => {
        !setting.IsPaused && moveSnake();
      }, MOVE_INTERVAL);

      return () => {
        clearInterval(intervalId); // Cleanup timer interval on unmount or state update
      };
    }
  }, [setting.isGameOver, setting.IsPaused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.primary,
      }}
    >
      {/* Gesture detector wrapper covering the play area */}
      <GestureDetector gesture={gesture}>
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
          {/* Component rendering individual snake segments based on coordinates array */}
          <Snack snack={setting.snack} />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default SnackGame;