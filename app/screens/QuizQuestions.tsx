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
import { useLocalSearchParams } from 'expo-router';

type Question = {
  question: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: string;
  explanation: string;
  total: number;
  category: string;
};

export default function App() {
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string, categoryName: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);

  useEffect(() => {
    // Fetch questions for the specific category
    axios
      .get<Question[]>(`https://placements.bsms.ac.uk/api/physquiz?category=${categoryId}`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, [categoryId]);

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

  const currentQuestion = questions[currentQuestionIndex];

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
    setExplanation(currentQuestion?.explanation || "");
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
        <View style={styles.headerContainer}>
          <Text style={styles.categoryTitle}>{categoryName || 'Quiz'}</Text>
        </View>
        <View style={styles.countWrapper}>
          <Text style={styles.countText}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <View style={styles.progressWrapper}>
          <View
            style={[styles.progressBar, { width: `${percentageComplete}%` }]}
          >
            <Text style={styles.percentage}>{Math.round(percentageComplete)}%</Text>
          </View>
        </View>

        <View style={styles.questionWrapper}>
          <Text style={styles.questionText}>{currentQuestion?.question || "Loading..."}</Text>
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
              text={option || ""}
              onSelect={() => handleSelect(option || "")}
              isSelected={selectedOption === option}
            />
          ))}
        </View>

        {selectedOption && (
          <View style={styles.explanationWrapper}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        )}

        {selectedOption && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7F1C3E",
    padding: 20,
  },
  headerContainer: {
    backgroundColor: "#00679A",
    padding: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  countWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  countText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressWrapper: {
    width: "100%",
    height: 20,
    backgroundColor: "#4C85BA",
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00679A",
    position: "absolute",
    left: 0,
  },
  percentage: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
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
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  optionsWrapper: {
    marginTop: 40,
    width: "100%",
  },
  explanationWrapper: {
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
  nextButton: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#00679A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
