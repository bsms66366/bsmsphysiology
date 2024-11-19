import { StyleSheet, Text, TouchableOpacity, View } from "react-native";



const Results = ({score, restart}:{score:number, restart:()=>void}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={{fontWeight:"600", fontSize: 16, color: "#FAF5ED"}} >Quiz Complete</Text>

        <Text style={{marginVertical: 20, fontWeight: "500"}} >You scored:</Text>

        <Text style={{fontWeight: "700", fontSize: 16, color: "#FAF5ED"}} >{score}/10</Text>

        <TouchableOpacity onPress={restart} activeOpacity={.8} style={styles.btn} >
        <Text style={{fontWeight:"600", fontSize: 16, color: "#FAF5ED"}} >Restart</Text>

            {/* <Text>restart</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7F1C3E",
    padding: 20,
  },
  wrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "#00679A",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  btn: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7F1C3E",
    marginTop: 20,
    font: "#FAF5ED",
  }
});
