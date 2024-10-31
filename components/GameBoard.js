import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from "./Header";
import { Footer } from "./Footer";
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS,
  SCOREBOARD_KEY,
} from "../constants/Game";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import style from "../style/style";
import { Container, Row, Col } from "react-native-flex-grid";

let board = [];

export const GameBoard = ({ navigation, route }) => {
  const [nbrOfThrowsLeft, setNumberOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState("Throw dices");
  const [throwsCount, setThrowsCount] = useState(0);

  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (playerName === "" && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [playerName, route.params]);

  const row = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    row.push(
      <Col key={"row" + dice}>
        <Pressable key={"row" + dice} onPress={() => selectDice(dice)}>
          <MaterialCommunityIcons
            name={board[dice]}
            key={"row" + dice}
            size={50}
            color={getDiceColor(dice)}
          />
        </Pressable>
      </Col>
    );
  }

  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
      </Col>
    );
  }

  const pointsToSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={"buttonsRow" + diceButton}>
        <Pressable key={"buttonsRow" + diceButton} onPress={() => selectDicePoints(diceButton)}>
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            size={35}
            color={getDicePointColor(diceButton)}
          />
        </Pressable>
      </Col>
    );
  }

  const selectDice = (i) => {
    let dices = [...selectedDices];
    dices[i] = !selectedDices[i];
    setSelectedDices(dices);
  };

  function getDiceColor(i) {
    return selectedDices[i] ? "black" : "steelblue";
  }

  function getDicePointColor(i) {
    return selectedDicePoints[i] ? "black" : "steelblue";
  }

  const selectDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];

      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce(
          (total, x) => (x === i + 1 ? total + 1 : total),
          0
        );
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
        setNumberOfThrowsLeft(NBR_OF_THROWS);

        if (selectedPoints.every(point => point)) {
          const totalScore = calculateTotalPoints();
          saveScore(totalScore);  // Save total score to scoreboard
        }
      } else {
        setStatus("You already selected points for " + (i + 1));
        return;
      }
    } else {
      setStatus("Throw " + NBR_OF_THROWS + " times before setting points");
    }
  };

  const throwDices = () => {
    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * MAX_SPOT + 1);
        spots[i] = randomNumber;
        board[i] = "dice-" + randomNumber;
      }
    }
    setDiceSpots(spots);
    setNumberOfThrowsLeft(nbrOfThrowsLeft - 1);
    setThrowsCount(throwsCount + 1);
  };

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  const calculateTotalPoints = () => {
    const totalPoints = dicePointsTotal.reduce(
      (total, points) => total + points,
      0
    );
    const totalWithBonus =
      totalPoints >= BONUS_POINTS_LIMIT
        ? totalPoints + BONUS_POINTS
        : totalPoints;
    return totalWithBonus;
  };

  const saveScore = async (totalScore) => {
    try {
      const currentScores = JSON.parse(await AsyncStorage.getItem(SCOREBOARD_KEY)) || [];
      const newScore = { name: playerName, score: totalScore };
      currentScores.push(newScore);
      await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(currentScores));
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const resetGame = () => {
    setThrowsCount(0);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
  };

  const allPointsSelected = selectedDicePoints.every((point) => point);

  return (
    <>
      <Header />
      <View style={style.gameboard}>
        <Container style={{ marginTop: 10 }}>
          <Row>{row}</Row>
        </Container>
        <Text style={{ marginBottom: 20 }}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text>{status}</Text>
        <Button
          title="Throw Dices"
          onPress={throwDices}
          color="steelblue"
          disabled={nbrOfThrowsLeft === 0}
        />
        <Container style={{ marginTop: 20 }}>
          <Row>{pointsRow}</Row>
        </Container>
        <Container>
          <Row>{pointsToSelectRow}</Row>
        </Container>
        <Text style={{ marginTop: 20 }}>Player Name: {playerName}</Text>
        <Text style={{ marginTop: 10 }}>
          Points left for bonus: {Math.max(0, 63 - calculateTotalPoints())}
        </Text>
        <Text style={{ marginTop: 20 }}>Total points: {calculateTotalPoints()} </Text>
        {allPointsSelected && (
          <Button title="Reset Game" onPress={resetGame} style={{ marginTop: 20 }} />
        )}
      </View>
      <Footer />
    </>
  );
};
