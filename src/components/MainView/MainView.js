import React, { Component } from 'react';
import { Text, View } from 'react-native';

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
      <View>
        <Text> Main View </Text>
      </View>
    );
  }
}
