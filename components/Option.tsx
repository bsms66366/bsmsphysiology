import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    option: string
    selectedOption: string | null;
    setSelectedOption: (option: string) => void;
    onSelect: (option: string) => void
   
}
//const Option = ({option,selectedOption, setSelectedOption,onSelect}:Props) => {
const Option = ({option,selectedOption, setSelectedOption, onSelect}:Props & {onSelect: (option: string) => void}) => {
    const handleSelect = () => {
        setSelectedOption(option)
        //checkIfSelected()
    }

  return (
    <TouchableOpacity onPress={handleSelect} activeOpacity={0.8} style={[styles.option, {  backgroundColor: option === selectedOption ? "#A9CDD4" : "#FAF5ED" }]}>
      <Text style={{ fontWeight: "500" }} >{option}</Text>
    </TouchableOpacity>
  );
};

export default Option;

const styles = StyleSheet.create({
  option: {
    width: "100%",
    height: 45,
    borderRadius: 16,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#FAF5ED"
  },
});
