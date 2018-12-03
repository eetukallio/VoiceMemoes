import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainView from '../components/MainView/MainView';
import RecordingView from '../components/RecordingView/RecordingView';

export const Navigator = createStackNavigator({
  Main: {
    screen: MainView,
  },
  Recording: {
    screen: RecordingView,
  },
});

export default createAppContainer(Navigator);
