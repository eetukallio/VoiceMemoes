import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import VMActionButton from '../generic/VMActionButton';

export default class MainView extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text> Main View </Text>
        </View>
        <VMActionButton
          buttonColor={'rgba(231,76,60,1)'}
          onPress={() => console.log('hello')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
