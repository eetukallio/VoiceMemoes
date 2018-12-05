import React, { Component } from 'react';
import { FlatList, View, AsyncStorage } from 'react-native';
import RecordingsListItem from './RecordingsListItem/RecordingsListItem';

export default class RecordingsList extends Component {
  state = {
    data: []
  };

  getRecordings = async () => {
    const recordings = await AsyncStorage.getItem('recordings');
    const recordingsJson = JSON.parse(recordings);
    this.setState({ data: recordingsJson });
  };

  render() {
    const { data } = this.state;

    return (
      <View>
        <FlatList
          data={data}
          extraData={this.state}
          keyExtractor={({ index }) => index + ''}
          renderItem={({ item }) => <RecordingsListItem item={item} />}
        />
      </View>
    );
  }
}
