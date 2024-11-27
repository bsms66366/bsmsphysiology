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
  category: string;
};

// Global state for selected category
let globalSelectedCategory: string | null = null;

export const setGlobalSelectedCategory = (category: string) => {
  globalSelectedCategory = category;
};

export default function QuizQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [percentageComplete, setPercentageComplete] = useState(0);

  useEffect(() => {
    // Fetch questions
    axios
      .get<Question[]>("https://placements.bsms.ac.uk/api/physquiz")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  useEffect(() => {
    if (!globalSelectedCategory) return;
    
    // Filter questions for the selected category
    const filtered = questions.filter(q => q.category === globalSelectedCategory);
    setFilteredQuestions(filtered);
    // Reset question index
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  }, [globalSelectedCategory, questions]);

  useEffect(() => {
    // Reset explanation and selected option when the question changes
    setSelectedOption(null);
    setExplanation("");
    
    // Update progress percentage
    if (filteredQuestions.length > 0) {
      const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
      setPercentageComplete(progress);
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
    
    setExplanation(currentQuestion.explanation);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!filteredQuestions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <Results
          score={score}
          totalQuestions={filteredQuestions.length}
          onRestartQuiz={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResult(false);
            setSelectedOption(null);
            setExplanation("");
          }}
        />
      </SafeAreaView>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, { fontSize: 18, fontWeight: 'bold' }]}>{globalSelectedCategory}</Text>
        </View>

        <View style={styles.countWrapper}>
          <Text>
            {currentQuestionIndex + 1}/{filteredQuestions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentageComplete}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.questionWrapper}>
          <Text style={styles.question}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsWrapper}>
          <Option
            text={currentQuestion.option_1}
            onPress={() => handleOptionSelect(currentQuestion.option_1)}
            selected={selectedOption === currentQuestion.option_1}
            correct={
              selectedOption === currentQuestion.option_1 &&
              currentQuestion.option_1 === currentQuestion.answer
            }
            wrong={
              selectedOption === currentQuestion.option_1 &&
              currentQuestion.option_1 !== currentQuestion.answer
            }
            disabled={!!selectedOption}
          />
          <Option
            text={currentQuestion.option_2}
            onPress={() => handleOptionSelect(currentQuestion.option_2)}
            selected={selectedOption === currentQuestion.option_2}
            correct={
              selectedOption === currentQuestion.option_2 &&
              currentQuestion.option_2 === currentQuestion.answer
            }
            wrong={
              selectedOption === currentQuestion.option_2 &&
              currentQuestion.option_2 !== currentQuestion.answer
            }
            disabled={!!selectedOption}
          />
          <Option
            text={currentQuestion.option_3}
            onPress={() => handleOptionSelect(currentQuestion.option_3)}
            selected={selectedOption === currentQuestion.option_3}
            correct={
              selectedOption === currentQuestion.option_3 &&
              currentQuestion.option_3 === currentQuestion.answer
            }
            wrong={
              selectedOption === currentQuestion.option_3 &&
              currentQuestion.option_3 !== currentQuestion.answer
            }
            disabled={!!selectedOption}
          />
          <Option
            text={currentQuestion.option_4}
            onPress={() => handleOptionSelect(currentQuestion.option_4)}
            selected={selectedOption === currentQuestion.option_4}
            correct={
              selectedOption === currentQuestion.option_4 &&
              currentQuestion.option_4 === currentQuestion.answer
            }
            wrong={
              selectedOption === currentQuestion.option_4 &&
              currentQuestion.option_4 !== currentQuestion.answer
            }
            disabled={!!selectedOption}
          />
        </View>

        {explanation && (
          <View style={styles.explanationWrapper}>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        )}

        {selectedOption && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === filteredQuestions.length - 1
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
    backgroundColor: "#fff",
  },
  categoryContainer: {
    padding: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  countWrapper: {
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  questionWrapper: {
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  optionsWrapper: {
    padding: 20,
  },
  explanationWrapper: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    margin: 20,
    borderRadius: 10,
  },
  explanationText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
