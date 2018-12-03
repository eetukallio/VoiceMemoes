import React, { Component } from 'react';
import ActionButton from 'react-native-action-button';

export default class VMActionButton extends Component {
  render() {
    const { onPress, buttonColor } = this.props;

    return <ActionButton buttonColor={buttonColor} onPress={onPress} />;
  }
}
