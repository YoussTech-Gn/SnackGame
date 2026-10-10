# Snake Game - Legacy Implementation (React Native)

A classic Snake game built using **React Native** and **Expo**, utilizing `react-native-gesture-handler` for swipe-based directional controls.

## Overview

This repository branch (`naseef`) houses the initial, traditional implementation of the game. It relies on standard React hooks (`useState`, `useEffect`) and a time-based interval (`setInterval`) to manage game states, snake movement, score tracking, and collision detection. This serves as our foundational baseline before refactoring into a modern, high-performance architecture.

## Architecture & State Management

The game centralizes all mutable parameters into a single unified `Settings` interface to prevent state fragmentation:

- **`direction`**: The active movement direction of the snake (using `Directions` enum).
- **`snack`**: An array of coordinate objects (`Coordinate[]`) representing the snake body segments.
- **`food`**: The current coordinate position of the food item on the grid.
- **`isGameOver`**: A boolean flag indicating whether a boundary or collision has triggered game over.
- **`IsPaused`**: A flag to pause or resume the game loop.
- **`score`**: The player's current score tracker.

## Grid Mathematics

Visual positioning of the snake segments on the screen is mapped using a grid scale factor:

$$
\text{Pixel Position} = \text{Coordinate} \times 10
$$

This converts logical grid coordinates into precise pixel units on the user interface.

## Core Features & Logic

1. **Gesture Controls (`Gesture.Pan`):** Captures continuous drag gestures on the screen and compares absolute horizontal (`translationX`) and vertical (`translationY`) vectors to determine the primary directional vector (UP, DOWN, LEFT, RIGHT).
2. **Movement Engine (`moveSnake`):**
   - Validates boundary collisions via `checkGameOver`.
   - Computes new head coordinates based on the active direction.
   - Checks food intersection via `checkEatsFood`, incrementing the score and growing the snake dynamically, or performing standard tail-slicing.
3. **Game Loop (`useEffect` + `setInterval`):** Triggers regular tick executions of the movement engine governed by `MOVE_INTERVAL`.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm start
   ```
