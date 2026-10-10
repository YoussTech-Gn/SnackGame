import { Coordinate } from "@/types/types";
import { StyleSheet, Text } from "react-native";

const GetRandomFruit = () => {
  const fruit: string[] = [];
  const randomIndex = Math.floor(Math.random() * fruit.length);
  return fruit[randomIndex];
};

const Food = ({ x, y }: Coordinate) => {
  return (
    <Text style={[{ top: y * 10, left: x * 10 }, setStyle.food]}>
      {GetRandomFruit()}
    </Text>
  );
};

const setStyle = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 8,
    position: "absolute",
  },
});
