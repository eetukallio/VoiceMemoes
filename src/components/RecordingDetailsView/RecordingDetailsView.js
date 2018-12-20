import React, { Component } from 'react';
import {
  Text,
  View,
  LayoutAnimation,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Slider
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ENV from '../../../env.json';

export default class RecordingDetailsView extends Component {
  static navigationOptions = {
    title: 'Memo',
    headerStyle: { backgroundColor: '#00a9ff' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' }
  };

  sound = null;
  interval = null;

  state = {
    file: {},
    playing: false,
    startedPlayback: false,
    currentTime: 0.0,
    loading: false,
    text: '',
    name: ''
  };

  componentDidMount = () => {
    const item = this.props.navigation.getParam('item', {
      name: 'No file',
      date: new Date(),
      text: 'Loading...',
      type: null,
      duration: 0.0
    });

    this.sound = new Sound(item.filePath, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
      }
    });

    this.setState({
      file: item,
      text: item.text,
      name: item.name
    });

    if (item.type === 'audio' && !item.text) {
      console.log('Fetching text...');
      this.sendAudio(item);
    } else {
      console.log('Already got text, or no file');
    }
  };

  sendAudio = async item => {
    try {
      let updatedItem = item;
      const base64Audio = await RNFS.readFile(item.filePath, 'base64');

      this.setState({
        loading: true
      });

      const url = ENV.API_ENDPOINT;

      const config = {
        method: 'post',
        url,
        data: {
          audio: {
            content: base64Audio
          },
          config: {
            enableWordTimeOffsets: true,
            encoding: 'amr',
            languageCode: 'fi-FI',
            sampleRateHertz: 8000
          }
        }
      };

      axios(config)
        .then(response => {
          let text = '';
          let confidence;
          response.data.results
            ? response.data.results.forEach((result, i) => {
                text = text + result.alternatives[0].transcript;
                confidence =
                  (confidence +
                    response.data.results[0].alternatives[0].confidence) /
                  (i + 1);
              })
            : (text = '-');
          console.log(response);

          updatedItem = { ...this.state.file, text, confidence };
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          this.setState({
            loading: false,
            file: updatedItem,
            text
          });

          this.updateItems(updatedItem, text);
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  updateItems = async (item, text) => {
    console.log(text);
    try {
      const retrievedFiles = await AsyncStorage.getItem('recordings');

      let files = retrievedFiles ? JSON.parse(retrievedFiles) : [];

      files.forEach((file, index) => {
        if (file.filePath === item.filePath) {
          item.text = text;
          files[index] = item;
        }
      });

      await AsyncStorage.setItem('recordings', JSON.stringify(files));
    } catch (err) {
      console.log(err);
    }
  };

  startInterval = () => {
    this.interval = setInterval(() => {
      this.onEverySecond();
    }, 100);
  };

  stopInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  onEverySecond = () => {
    this.sound.getCurrentTime(seconds => {
      if (this.interval) {
        this.setState({
          currentTime: seconds
        });
      }
    });
  };

  startPlaying = () => {
    this.sound.play(success => {
      if (success) {
        this.setState({
          playing: false,
          currentTime: 0
        });
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.stopInterval();
    });
    this.startInterval();
  };

  play = async () => {
    if (!this.state.playing) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        playing: true,
        startedPlayback: true
      });
      this.startPlaying();
    } else {
      this.sound.pause();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        playing: false
      });
      this.stopInterval();
    }
  };

  componentWillUnmount = () => {
    if (this.sound) {
      this.sound.stop();
      this.sound = null;
    }
    if (this.interval) {
      this.stopInterval();
    }
    this.props.navigation.getParam('updateList')();
  };

  renderTextArea() {
    return (
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          height: '100%',
          alignItems: 'center'
        }}
        style={[styles.textArea]}
      >
        {this.state.loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50
            }}
          >
            <ActivityIndicator size="large" color={'blue'} />
            <Text style={styles.transcript}>Ladataan tekstiä...</Text>
          </View>
        ) : (
          <Text style={styles.transcript}>{this.state.text}</Text>
        )}
      </ScrollView>
    );
  }

  renderNoText = () => (
    <View style={styles.noTextContainer}>
      <Text style={styles.info}>Unable to transcribe. Talk better.</Text>
    </View>
  );

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    console.log(item);

    return (
      <LinearGradient colors={['#00a9ff', '#015a87']} style={styles.container}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={this.play}>
            <LinearGradient
              colors={['#00efd1', '#489ddd']}
              style={styles.playButton}
            >
              {!this.state.playing ? (
                <Icon name="play-arrow" style={styles.playIcon} />
              ) : (
                <Icon name="pause" style={styles.playIcon} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {this.sound && (
            <View style={styles.sliderRow}>
              {this.state.file.duration.toFixed(0).length < 2 ? (
                <Text style={styles.dataText}>
                  0:0{this.state.currentTime.toFixed(0)}
                </Text>
              ) : (
                <Text style={styles.dataText}>
                  0:{this.state.currentTime.toFixed(0)}
                </Text>
              )}
              <Slider
                maximumValue={this.state.file.duration}
                onSlidingComplete={value => {
                  this.sound.setCurrentTime(value);
                  if (this.state.playing) {
                    this.startPlaying();
                  }
                }}
                onValueChange={() => {
                  this.sound.pause();
                }}
                value={this.state.currentTime}
                style={styles.slider}
                thumbTintColor={'white'}
                minimumTrackTintColor={'lightgreen'}
                maximumTrackTintColor={'black'}
              />
              {this.state.file.duration.toFixed(0).length < 2 ? (
                <Text style={styles.dataText}>
                  0:0{this.state.file.duration.toFixed(0)}
                </Text>
              ) : (
                <Text style={styles.dataText}>
                  0:{this.state.file.duration.toFixed(0)}
                </Text>
              )}
            </View>
          )}
        </View>

        <Text style={styles.nameLabel}>{this.state.file.name}</Text>

        {this.state.text !== '-'
          ? !this.state.editMode
            ? this.renderTextArea()
            : this.renderTextInput()
          : this.renderNoText()}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  playIcon: {
    fontSize: 70,
    color: 'white'
  },
  slider: {
    width: '75%'
  },
  titleLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
  controls: {
    alignItems: 'center'
  },
  textArea: {
    backgroundColor: '#c4e9e5',
    maxHeight: 250,
    width: '90%',
    padding: 10,
    marginTop: 30,
    borderRadius: 2,
    marginBottom: 10,
    elevation: 0
  },
  transcript: {
    fontFamily: 'Circular Std',
    color: 'blue',
    fontSize: 16,
    padding: 0,
    height: '100%',
    width: '100%'
  },
  nameLabel: {
    fontFamily: 'Circular Std',
    color: 'blue',
    fontSize: 20,
    padding: 0
  },
  nameLabelEdit: {
    fontFamily: 'Circular Std',
    color: 'blue',
    fontSize: 20,
    padding: 5,
    backgroundColor: '#c4e9e5',
    borderRadius: 3,
    width: '90%'
  },
  icon: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center',
    textShadowColor: 'rgba(0,0,0,.2)',
    shadowRadius: 3,
    textShadowOffset: { width: 2, height: 1 }
  },
  sliderRow: {
    flexDirection: 'row',
    marginVertical: 30,
    width: '100%'
  },
  dataText: {
    fontSize: 14,
    color: 'white'
  },
  info: {
    marginHorizontal: 30,
    fontSize: 20,
    color: 'blue'
  },
  noTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addWordInput: {
    backgroundColor: '#c4e9e5',
    width: '80%',
    borderRadius: 2,
    alignSelf: 'flex-end',
    elevation: 0,
    paddingHorizontal: 10
  },
  iconContainer: {
    alignSelf: 'flex-end'
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: 30
  }
});
