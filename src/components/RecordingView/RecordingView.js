import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  AsyncStorage,
  LayoutAnimation
} from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import { prepareRecordingPath } from '../../util/recorderConfig.js';
import FileInformationModal from './FileInformationModal/FileInformationModal';
import RecordButton from './RecordButton/RecordButton.js';
import TitledButton from './TitledButton/TitledButton.js';
const matchNonDigits = /\D/g;
const MAX_DURATION = 30;

export default class AudioRecorderScreen extends Component {
  static navigationOptions = {
    title: 'New recording',
    headerStyle: { backgroundColor: '#00a9ff' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  };

  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    startedRecording: false,
    stoppedRecording: false,
    finished: false,
    audioPath:
      AudioUtils.DocumentDirectoryPath +
      '/' +
      new Date().toISOString().replace(matchNonDigits, '') +
      '.amr',
    hasPermission: undefined,
    fileData: {
      name: new Date(),
      date: new Date(),
      text: null,
      type: 'audio',
      duration: 0.0,
      confidence: 0.0
    },
    modalVisible: false,
    loading: false,
    durationLeft: MAX_DURATION,
    color: 'white'
  };

  componentDidMount() {
    this.checkPermission().then(hasPermission => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        let color;

        if (this.state.durationLeft < 15) {
          color = 'white';
        } else if (this.state.durationLeft < 30) {
          color = 'white';
        } else {
          color = 'white';
        }

        this.setState({
          currentTime: Math.floor(data.currentTime),
          fileData: { ...this.state.fileData, duration: data.currentTime },
          durationLeft: (MAX_DURATION - data.currentTime).toFixed(0),
          color
        });
        if (MAX_DURATION - data.currentTime < 1) {
          this.pause();
          this.stop(true);
        }
      };

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === 'OK', data.audioFileURL);
        }
      };
    });
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  onNameChange = value => {
    this.setState({
      fileData: {
        ...this.state.fileData,
        name: value
      }
    });
  };

  checkPermission = () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      title: 'Microphone Permission',
      message:
        'Voice Memoes needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale
    ).then(result => {
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    });
  };

  pause = async () => {
    if (this.state.recording && Platform.Version < 24) {
      this.setState({
        paused: false,
        recording: false,
        startedRecording: true,
        finished: true
      });
      await AudioRecorder.stopRecording();
      return;
    }

    try {
      await AudioRecorder.pauseRecording();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ paused: true, recording: false });
    } catch (error) {
      console.error(error);
    }
  };

  resume = async () => {
    if (!this.state.paused) {
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({ paused: false });
    } catch (error) {
      console.error(error);
    }
  };

  stop = async forced => {
    if (!forced && this.state.recording) {
      return;
    }

    this.setModalVisible(true);

    this.setState({ recording: false, paused: false });

    try {
      Platform.Version > 23 && (await AudioRecorder.stopRecording());
      const filePath = this.state.audioPath;

      this.setState({
        fileData: { ...this.state.fileData, filePath }
      });

      this.setModalVisible(true);

      return filePath;
    } catch (error) {
      console.error(error);
    }
  };

  record = async () => {
    if (!this.state.hasPermission) {
      console.log('No permission');
      return;
    }

    if (!this.state.recording) {
      if (!this.state.startedRecording) {
        try {
          prepareRecordingPath(this.state.audioPath);
          await AudioRecorder.startRecording();
          this.setState({
            startedRecording: true
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await AudioRecorder.resumeRecording();
        } catch (err) {
          console.log(err);
        }
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ recording: true, paused: false });
    } else {
      this.pause();
    }
  };

  finishRecording = async (didSucceed, filePath) => {
    this.setState({
      finished: true
    });

    try {
      const retrievedFiles = await AsyncStorage.getItem('recordings');

      const files = retrievedFiles ? JSON.parse(retrievedFiles) : [];

      await AsyncStorage.setItem(
        'recordings',
        JSON.stringify([...files, this.state.fileData])
      );
    } catch (error) {
      console.log(error);
    }

    this.setState({ finished: didSucceed });
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath}`
    );
    this.props.navigation.getParam('updateList')();
    this.props.navigation.goBack();
  };

  componentWillUnmount = () => {
    if (this.state.startedRecording && !this.state.finished) {
      try {
        AudioRecorder.stopRecording();
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    return (
      <LinearGradient colors={['#00a9ff', '#015a87']} style={styles.container}>
        <View style={styles.controls}>
          <View />
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={230}
              width={15}
              fill={
                ((MAX_DURATION - this.state.currentTime) / MAX_DURATION) * 100
              }
              tintColor={this.state.color}
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor={'transparent'}
              rotation={0}
            >
              {() => (
                <Text
                  style={[styles.progressText, { color: this.state.color }]}
                >
                  {this.state.durationLeft}
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>

          <View style={styles.bottomRow}>
            <View style={{ width: 60 }} />
            {!this.state.finished && (
              <RecordButton
                onPress={() => this.record()}
                active={this.state.recording}
              />
            )}
            {this.state.startedRecording && !this.state.recording ? (
              <TitledButton onPress={this.stop} title="Done" />
            ) : (
              <View style={{ width: 60 }} />
            )}
          </View>
        </View>

        <FileInformationModal
          finishRecording={this.finishRecording}
          setModalVisible={this.setModalVisible}
          filePath={this.state.fileData.filePath}
          onChange={this.onNameChange}
          modalVisible={this.state.modalVisible}
          loading={this.state.loading}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressText: {
    fontSize: 130,
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center'
  },
  button: {
    padding: 20,
    marginBottom: 0
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00'
  },
  recordIcon: {
    fontSize: 40,
    color: '#fff'
  },
  recordIconActive: {
    fontSize: 40,
    color: '#B81F00'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    height: 500,
    width: 300,
    backgroundColor: 'white'
  },
  durationContainer: {
    height: 260,
    width: 260,
    borderRadius: 150,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    marginBottom: 100
  },
  progressTextRed: {
    fontSize: 130,
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center'
  },
  progressTextOrange: {
    fontSize: 130,
    color: 'orange',
    alignSelf: 'center',
    textAlign: 'center'
  },
  record: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 60,
    height: 60
  },
  progressContainer: {
    marginTop: 0
  },
  cameraIcon: {
    fontSize: 30,
    color: 'white'
  },
  cameraIconContainer: {
    marginRight: 20
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: 130
  }
});
