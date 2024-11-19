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
};

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [checkIfSelected, setCheckIfSelected] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });
  const [optionSelected, setOptionSelected] = useState(false);
  const [explanation, setExplanation] = useState('');
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
    const percentage = Math.round((currentQuestionIndex / (questions.length - 1)) * 100);
    setPercentageComplete(percentage);
  }, [currentQuestionIndex, questions.length]);

  const handleNext = () => {
    const correctAnswer = currentQuestion?.answer;

    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }

    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    });
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (selectedOption) {
      const currentQuestion = questions[currentQuestionIndex];
      const explanationText = currentQuestion?.explanation;
      setExplanation(explanationText);
    }
  }, [selectedOption]);

  const restart = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (showResult) {
    return <Results score={score} restart={restart} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.countWrapper}>
          <Text>{currentQuestionIndex + 1}/{questions.length}</Text>
        </View>

        <View style={styles.progressWrapper}>
          <View style={[styles.progressBar, { height: `${percentageComplete}%` }]} />
          <View style={styles.progressCount}>
            <Text style={styles.percentage}>{Math.round(percentageComplete)}%</Text>
          </View>
        </View>

        <View style={styles.questionWrapper}>
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
              setSelectedOption={setSelectedOption}
              onSelect={() => {
                setOptionSelected(true);
                handleSelect(option);
              }}
              
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
  container: {
    flex: 1,
    backgroundColor: "#e4e4e4",
    padding: 20,
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
    backgroundColor: "#fff",
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
    backgroundColor: "#ABD1C6",
    borderRadius: 50,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
    marginTop: -50,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#004643",
    position: "absolute",
    bottom: 0,
  },
  progressCount: {
    height: 58,
    width: 58,
    borderRadius: 50,
    backgroundColor: "#fff",
    zIndex: 10,
    position: "absolute",
    top: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 16,
    color: "#004643",
  },
  optionsWrapper: {
    marginTop: 40,
    width: "100%",
  },
  explanationContainer: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  explanationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    lineHeight: 24,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#004643",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});