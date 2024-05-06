import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { shuffle } from 'lodash';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [gameMessage, setGameMessage] = useState('');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await require('./questions.json');
        setQuestions(response);
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (!gameOver && questions.length > 0) {
      const shuffledQuestions = shuffle(questions).slice(0, 15);
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
    }
  }, [gameOver]);

  const handleStartGame = () => {
    setGameOver(false);
    setGameMessage('');
    setCorrectAnswersCount(0); // Сброс счётчика правильных ответов при начале игры
  };

  const handleAnswer = (selectedOptionIndex) => {
    if (selectedOptionIndex === questions[currentQuestionIndex].correctAnswer) {
      if (currentQuestionIndex === questions.length - 1) {
        setGameMessage('Поздравляем! Вы ответили на все вопросы правильно!');
        setGameOver(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCorrectAnswersCount(correctAnswersCount + 1);
      }
    } else {
      setGameMessage('Вы допустили ошибку. Попробуйте еще раз.');
      setGameOver(true);
    }
  };

  const renderQuestion = () => {
    const { question, options } = questions[currentQuestionIndex];
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        {options.map((option, index) => (
          <TouchableOpacity key={index} onPress={() => handleAnswer(index)} style={styles.optionButton}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMainMenu = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.mainMenuText}>Main Menu</Text>
        <TouchableOpacity onPress={handleStartGame} style={styles.mainMenuButton}>
          <Text style={styles.mainMenuButtonText}>Start</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  };

  return (
    <View style={styles.background}>
      {gameOver ? renderMainMenu() : questions.length > 0 && renderQuestion()}
      {gameMessage !== '' && (
        <View style={styles.messageContainer}>
          <Text style={styles.gameMessageText}>{gameMessage}</Text>
          <Text style={styles.mainMenuText}>Правильных ответов: {correctAnswersCount}</Text>
          <TouchableOpacity onPress={handleStartGame} style={styles.mainMenuButton}>
            <Text style={styles.mainMenuButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1f4068',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  questionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#ffffff',
  },
  optionButton: {
    width:300,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#27004B',
    borderRadius: 20,    
  },
  optionText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign : "center",
  },
  mainMenuText: {
    fontSize: 28,
    marginBottom: 30,
    color: '#ffffff',

  },
  mainMenuButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#27004B',
    borderRadius: 8,
  },
  mainMenuButtonText: {
    fontSize: 28,
    color: '#ffffff',
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "black",
    textAlign : "center",

  
  },
  gameMessageText: {
    fontSize: 28,
    textAlign : "center",
    marginBottom : 20


  }
});
