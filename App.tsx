import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './Screens/HomeScreen'
import FinSwe from './Screens/FinSwe'
import SweFin from './Screens/SweFin'
import ConnectWords from './Screens/ConnectWords'
import PickWord from './Screens/PickWord'
import { RootStackParamList } from './types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FinSwe" component={FinSwe} />
        <Stack.Screen name="SweFin" component={SweFin} />
        <Stack.Screen name="ConnectWords" component={ConnectWords} />
        <Stack.Screen name="PickWord" component={PickWord} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
  