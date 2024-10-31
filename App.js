import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import style from './style/style';
import Home from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      sceneContainerStyle={{backgroundColor: 'transparent'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'information'
                : 'information-outline';
            } else if (route.name === 'Gameboard') {
              iconName = focused 
              ? 'dice-multiple' 
              : 'dice-multiple-outline';
            } else if (route.name === 'Scoreboard') {
              iconName = focused 
              ? 'view-list' 
              : 'view-list-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'steelblue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{tabBarStyle: {display: 'none'}}} />
        <Tab.Screen name="Gameboard" component={GameBoard} />
        <Tab.Screen name="Scoreboard" component={ScoreBoard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

 

