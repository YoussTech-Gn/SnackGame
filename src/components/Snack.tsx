import { Colors } from "@/constants/colors";
import { Coordinate } from "@/types/types";
import { StyleSheet, View } from "react-native";

interface SnackProps {
  snack: Coordinate[];
}
const Snack = ({ snack }: SnackProps) => {
  return (
    <>
      {snack.map((segment, index) => {
        const segmentStyle = {
          left: segment.x * 10,
          top: segment.y * 10,
        };
        return (
          <View
            key={index}
            // className="w-4 h-4 rounded-lg"
            style={[setStyle.snack, segmentStyle]}
          />
        );
      })}
    </>
  );
};

const setStyle = StyleSheet.create({
  snack: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    position: "absolute",
    borderRadius: 8,
  },
});

export default Snack;
