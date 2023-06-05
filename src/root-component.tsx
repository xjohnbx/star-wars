/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import {Header, ListItem} from '@rneui/themed';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useQuery, gql} from '@apollo/client';

import {AllPeopleQueryResult} from './__generated__/graphql';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {data, loading}: AllPeopleQueryResult = useQuery(gql`
    {
      allPeople {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header
        backgroundImageStyle={{}}
        barStyle="default"
        centerComponent={{
          text: 'IH Challenge',
          style: {color: '#fff'},
        }}
        centerContainerStyle={{}}
        leftComponent={{icon: 'menu', color: '#fff'}}
        leftContainerStyle={{}}
        linearGradientProps={{}}
        placement="center"
        rightComponent={{icon: 'home', color: '#fff'}}
        rightContainerStyle={{}}
        statusBarProps={{}}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <FlatList
          data={data?.allPeople?.edges}
          renderItem={({item: edge}) => (
            <ListItem Component={TouchableHighlight} key={edge?.node?.id}>
              <ListItem.Content>
                <ListItem.Title>{edge?.node?.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}></FlatList>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
