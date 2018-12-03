import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../util/colors';

export default class RecordingView extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: colors.headerBg,
    },
    headerTintColor: colors.headerTint,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render() {
    return (
      <View>
        <Text> Rcording View </Text>
      </View>
    );
  }
}
