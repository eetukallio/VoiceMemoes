import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
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
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{parseDuration(item.duration)}</Text>
          <Text style={styles.dataText}>{parseDate(item.date)}</Text>
        </View>
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
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 12,
  },
  title: {
    fontSize: 23,
    color: '#00a9ff',
  },
  dataText: {
    color: '#3f3f3f',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0,
  },
});
