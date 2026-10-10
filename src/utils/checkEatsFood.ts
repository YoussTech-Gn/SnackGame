import { Coordinate } from "@/types/types";

interface CheckEatsFoodProps {
  head: Coordinate;
  food: Coordinate;
  area: number;
}

const checkEatsFood = ({ area, food, head }: CheckEatsFoodProps): boolean => {
  const distanceBtwFoodAndSnackX: number = Math.abs(head.x - food.x);
  const distanceBtwFoodAndSnackY: number = Math.abs(head.y - food.y);
  return distanceBtwFoodAndSnackX < area && distanceBtwFoodAndSnackY < area;
};

export { checkEatsFood };
