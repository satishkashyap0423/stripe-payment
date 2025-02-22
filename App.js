import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import ProfileScreen from './src/ProfileScreen';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <StripeProvider
      publishableKey={"pk_test_51QvClgBQbbrVo9zcL1Fb6A16UKxoTEYq0Gm5GHQP4s9prKl79neeKwv53DsFerfvwxxjCc5dIfqOTrXhTN2Kv40100wypMULep"}
      urlScheme="AwesomeProject" // required for 3D Secure and bank redirects
    >
    <NavigationContainer>
      {/* Rest of your app code */}
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </StripeProvider>
  );
};

export default App;