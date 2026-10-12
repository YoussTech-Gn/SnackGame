import { PanGestureHandlerEventPayload } from "react-native-gesture-handler";

// export interface Coordinate {
//   x: number;
//   y: number;
// }

// enum EnumDirection {}

export type GestureEventType = Pick<
  PanGestureHandlerEventPayload,
  "translationX" | "translationY"
>;

// export enum Directions

// export interface Bounds {
//   xMIn: number;
//   xMax: number;
//   yMin: number;
//   yMax: number;
// }

export type Coordinate = { x: number; y: number };
// Fixed typo: xMIn -> xMin
export type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };
