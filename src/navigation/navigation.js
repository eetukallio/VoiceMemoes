import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainView from '../components/MainView/MainView';

export const Navigator = createStackNavigator({
  Main: {
    screen: MainView,
  },
});

export default createAppContainer(Navigator);
