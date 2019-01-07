import React, { Component } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import RecordingsListItem from './RecordingsListItem/RecordingsListItem';

export default class RecordingsList extends Component {
  state = {
    data: [],
  };

  render() {
    const { data, navigation, updateList } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={data}
          extraData={this.props}
          keyExtractor={({ index }) => index + ''}
          renderItem={({ item }) => (
            <RecordingsListItem
              item={item}
              navigation={navigation}
              updateList={updateList}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '97%',
  },
  list: {
    flex: 1,
  },
});
