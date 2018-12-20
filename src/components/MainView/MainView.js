import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import VMActionButton from '../generic/VMActionButton';
import RecordingsList from './RecordingsList/RecordingsList';
import LinearGradient from 'react-native-linear-gradient';

export default class MainView extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: { backgroundColor: '#00a9ff' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  };

  state = { data: [] };

  getRecordings = async () => {
    const recordings = await AsyncStorage.getItem('recordings');
    const recordingsJson = JSON.parse(recordings);
    this.setState({ data: recordingsJson });
  };

  componentDidMount = () => {
    this.getRecordings();
  };

  render() {
    const { navigation } = this.props;
    const { data } = this.state;

    return (
      <LinearGradient colors={['#00a9ff', '#015a87']} style={styles.container}>
        <View style={styles.contentContainer}>
          <RecordingsList
            data={data}
            navigation={navigation}
            updateList={this.getRecordings}
          />
        </View>
        <VMActionButton
          buttonColor={'rgba(231,76,60,1)'}
          onPress={() =>
            navigation.navigate('Recording', { updateList: this.getRecordings })
          }
        />
      </LinearGradient>
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
