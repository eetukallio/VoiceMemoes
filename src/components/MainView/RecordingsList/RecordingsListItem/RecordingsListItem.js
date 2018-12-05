import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class RecordingsListItem extends Component {
  render() {
    const { item } = this.props;
    return (
      <View>
        <Text> {item.name} </Text>
      </View>
    );
  }
}
