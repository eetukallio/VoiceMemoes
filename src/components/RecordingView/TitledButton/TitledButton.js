import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class TitledButton extends Component {
  render() {
    const { onPress, title } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingVertical: 10,
    fontSize: 20,
    color: 'white',
    fontFamily: 'Circular Std'
  },
  container: {
    width: 60
  }
});
