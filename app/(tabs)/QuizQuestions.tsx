import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Option from "@/components/Option";
import Results from "@/components/Results";
import axios from "axios";

type Question = {
  question: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: string;
  explanation: string;
  total: number;
  category: string; // New category field
};

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);

  useEffect(() => {
    axios
      .get<Question[]>("https://placements.bsms.ac.uk/api/physquiz")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Reset explanation and selected option when the question changes
    setSelectedOption(null);
    setExplanation("");
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Update progress percentage
    const percentage = Math.round((currentQuestionIndex / questions.length) * 100);
    setPercentageComplete(percentage);
  }, [currentQuestionIndex, questions.length]);

  const handleNext = () => {
    // Check if the selected option is correct
    if (selectedOption === currentQuestion?.answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setExplanation(currentQuestion?.explanation || ""); // Display explanation for selected option
  };

  const restart = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
  };

  if (showResult) {
    return <Results score={score} restart={restart} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.countWrapper}>
          <Text>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <View style={styles.progressWrapper}>
          <View
            style={[styles.progressBar, { height: `${percentageComplete}%` }]}
          />
          <View style={styles.progressCount}>
            <Text style={styles.percentage}>{Math.round(percentageComplete)}%</Text>
          </View>
        </View>

        <View style={styles.questionWrapper}>
        <Text style={styles.category}>
        {currentQuestion?.category || "Unknown Category"}</Text>
          <Text>{currentQuestion?.question || "Loading..."}</Text>
        </View>

        <View style={styles.optionsWrapper}>
          {[
            currentQuestion?.option_1,
            currentQuestion?.option_2,
            currentQuestion?.option_3,
            currentQuestion?.option_4,
          ].map((option, index) => (
            <Option
              key={index}
              option={option}
              selectedOption={selectedOption}
              setSelectedOption={handleSelect}
            />
          ))}
        </View>

        {selectedOption && explanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={{ color: "#fff" }}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Same styles as provided earlier
  container: {
    flex: 1,
    backgroundColor: "#7F1C3E",
    padding: 20,
  },
  category: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  countWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  questionWrapper: {
    marginTop: 60,
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: "#FAF5ED",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    alignItems: "center",
  },
  progressWrapper: {
    width: 70,
    height: 70,
    backgroundColor: "#4C85BA",
    borderRadius: 50,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
    marginTop: -50,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00679A",
    position: "absolute",
    bottom: 0,
  },
  progressCount: {
    height: 58,
    width: 58,
    borderRadius: 50,
    backgroundColor: "#FAF5ED",
    zIndex: 10,
    position: "absolute",
    top: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
  },
  optionsWrapper: {
    marginTop: 40,
    width: "100%",
  },
  explanationContainer: {
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  explanationText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    lineHeight: 24,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#00679A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
