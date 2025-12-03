import { registerRootComponent } from 'expo';

import Login from './src/page/Login/Login';
import HomePage from './src/page/HomePage/HomePage';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Login);
