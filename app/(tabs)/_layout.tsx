import { Tabs} from 'expo-router';
import { Text, TouchableOpacity, Image } from 'react-native';

import { styles } from "../../components/input/Button/index";

export default function Layout() {
  return (
   <Tabs>
    <Tabs.Screen name="HomePage/index" options={{ 
        title: 'Extrato', 
        headerShown:false,
        tabBarIcon: ({focused, color, size}) => (
          <Image 
            source={require('../../assets/extrato.png')} 
            style={{width: 24, height: 24, tintColor: focused ? '#FFC100' : '#999999'}}
          />
        ),
        
        }} />
    <Tabs.Screen name="DashbordPage/index" options={{ title: 'Dashboard',
        headerShown:false,
        tabBarIcon: ({focused, color, size}) => (
          <Image 
            source={require('../../assets/gráfico.png')} 
            style={{width: 24, height: 24, tintColor: focused ? '#FFC100' : '#999999'}}
          />
        ),
     }} />



   </Tabs>
)}