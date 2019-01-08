import { AudioRecorder } from 'react-native-audio';
import { Platform } from 'react-native';

export const prepareRecordingPath = audioPath => {
  if (Platform.OS === 'android') {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 8000,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'amr_nb',
      AudioEncodingBitRate: 128000
    });
  } else {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'ulaw',
      AudioEncodingBitRate: 128000
    });
  }
};
