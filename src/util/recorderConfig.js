import { AudioRecorder } from 'react-native-audio';

export const prepareRecordingPath = audioPath => {
  AudioRecorder.prepareRecordingAtPath(audioPath, {
    SampleRate: 8000,
    Channels: 1,
    AudioQuality: 'High',
    AudioEncoding: 'amr_nb',
    AudioEncodingBitRate: 128000
  });
};
