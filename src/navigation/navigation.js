import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainView from '../components/MainView/MainView';
import RecordingView from '../components/RecordingView/RecordingView';
import RecordingDetailsView from '../components/RecordingDetailsView/RecordingDetailsView';

export const Navigator = createStackNavigator({
  Main: {
    screen: MainView
  },
  Recording: {
    screen: RecordingView
  },
  RecordingDetails: {
    screen: RecordingDetailsView
  }
});

export default createAppContainer(Navigator);
