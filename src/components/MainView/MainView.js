import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import VMActionButton from '../generic/VMActionButton';
import RecordingsList from './RecordingsList/RecordingsList';

export default class MainView extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <RecordingsList />
        </View>
        <VMActionButton
          buttonColor={'rgba(231,76,60,1)'}
          onPress={() => navigation.navigate('Recording')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
