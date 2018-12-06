import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { parseDate, parseDuration } from '../../../../util/util';

export default class RecordingsListItem extends Component {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <Text> {item.name} </Text>
        <Text> {parseDuration(item.duration)} </Text>
        <Text> {parseDate(item.date)} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    marginVertical: 5
  }
});
