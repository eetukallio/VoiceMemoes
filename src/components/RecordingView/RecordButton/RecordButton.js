import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class RecordButton extends Component {
  render() {
    const { active, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <LinearGradient
          start={{ x: 0.25, y: 0.0 }}
          end={{ x: 0.5, y: 0.5 }}
          colors={['#00a9ff', '#015a87']}
          style={styles.recordContainer}
        >
          {!active ? (
            <View style={styles.record} />
          ) : (
            <Icon name={'pause'} style={styles.pause} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    marginBottom: 0,
  },

  record: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 60,
    height: 60,
  },
  recordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 50,
    padding: 10,
  },
  pause: {
    fontSize: 60,
    color: 'white',
  },
  buttonContainer: {
    height: 60,
    width: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
