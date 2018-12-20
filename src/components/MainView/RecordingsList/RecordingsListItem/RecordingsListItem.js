import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { parseDate, parseDuration } from '../../../../util/util';

export default class RecordingsListItem extends Component {
  render() {
    const { item, navigation, updateList } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate('RecordingDetails', { item, updateList })
        }
      >
        <Text> {item.name} </Text>
        <Text> {parseDuration(item.duration)} </Text>
        <Text> {parseDate(item.date)} </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    marginVertical: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});
