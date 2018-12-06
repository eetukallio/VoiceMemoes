import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import RecordingsListItem from './RecordingsListItem/RecordingsListItem';

export default class RecordingsList extends Component {
  state = {
    data: []
  };

  render() {
    const { data } = this.props;

    return (
      <View>
        <FlatList
          data={data}
          extraData={this.props}
          keyExtractor={({ index }) => index + ''}
          renderItem={({ item }) => <RecordingsListItem item={item} />}
        />
      </View>
    );
  }
}
