import { StyleSheet } from "react-native";
export default StyleSheet.create({
  list: {
    maxHeight: 40,
  },
  contentContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 12,
    height: 28,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
    backgroundColor: "#FFA50066",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  selected: {
    backgroundColor: "#FF8800",
    borderColor: "#FF6600",
  },
});
