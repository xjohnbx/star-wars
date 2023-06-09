/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,

} from 'react-native';
import { Button, Header } from '@rneui/themed';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { gql, useQuery } from '@apollo/client';

import Quiz from './components/Quiz';
import { Person, Planet } from './__generated__/graphql';
import { Text } from '@rneui/base';

const PEOPLE_QUERY = gql`
{
  allPeople {
    people {
      name
      id
      homeworld {
        name
        id
      }
    }
  }
}
`

const PLANET_QUERY = gql` 
{
    allPlanets {
            planets {
              id
              name
            }
          }
        }
`

const App = () => {
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const { data: peopleData, loading: peopleQueryLoading} = useQuery(PEOPLE_QUERY);
  const { data: planetsData, loading: planetsQueryLoading} = useQuery(PLANET_QUERY);

  const peopleArray: Person[] = peopleData?.allPeople?.people;
  const planetsArray: Planet[] = planetsData?.allPlanets?.planets;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const renderQuiz = () => {
    return (
        <View>
          {quizStarted ? <Quiz peopleArray={peopleArray} planetsArray={planetsArray} /> : null}
        </View>
    )
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: 'Star Wars Quiz',
          style: {color: '#fff', fontSize: 25},
        }}
      />
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.innerContainer, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>

            {/* Show Start button if quiz is not started */}
            {!quizStarted 
              ? <Button onPress={() => setQuizStarted(!quizStarted)} title={'Start Quiz'} /> 
              : null}

            {/* If quiz is started, but queries haven't finished yet, show Loading... */}
            {(peopleQueryLoading || planetsQueryLoading) && quizStarted 
              ? <Text>Loading...</Text> 
              : renderQuiz()}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
