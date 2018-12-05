import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
class FileInformationModal extends Component {
  render() {
    const {
      finishRecording,
      setModalVisible,
      filePath,
      onChange,
      modalVisible
    } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.title}>Tallenna äänite</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                placeholder={'Tallenteen nimi'}
              />
            </View>
            {!this.props.loading ? (
              <TouchableOpacity
                onPress={() => {
                  finishRecording(true, filePath);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.saveText}>Tallenna</Text>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modal: {
    height: 200,
    width: 300,
    backgroundColor: '#c4e9e5',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputContainer: {
    marginVertical: 30,
    width: 270
  },
  title: {
    fontSize: 20,
    color: 'blue',
    fontFamily: 'Circular Std'
  },
  saveText: {
    fontFamily: 'Circular Std',
    fontSize: 20,
    color: 'blue'
  },
  input: {
    fontFamily: 'Circular Std',
    backgroundColor: 'white',
    height: 40
  }
});

export default FileInformationModal;
