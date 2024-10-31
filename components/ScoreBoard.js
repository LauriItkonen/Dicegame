import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCOREBOARD_KEY } from '../constants/Game';
import { Header } from './Header';
import { Footer } from './Footer';

export const ScoreBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const savedScores = JSON.parse(await AsyncStorage.getItem(SCOREBOARD_KEY)) || [];
        setScores(savedScores);
      } catch (error) {
        console.log("Error loading scores:", error);
      }
    };

    loadScores();
  }, []);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Scoreboard</Text>
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <Text key={index} style={styles.score}>
              {score.name}: {score.score} points
            </Text>
          ))
        ) : (
          <Text style={styles.message}>No scores available yet.</Text>
        )}
      </View>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 16,
    marginVertical: 5,
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
});
