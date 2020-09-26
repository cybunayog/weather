// Libraries
import React from 'react';
import { TouchableOpacity, Image, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Files
import Details from 'weather/App/screens/Details';
import Search from 'weather/App/screens/Search';

const HeaderRightButton = ({ onPress, style, icon }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={icon}
      resizeMode="contain"
      style={[
        {
          marginRight: 10,
          width: 20,
          height: 20,
          tintColor: '#fff',
        },
        style,
      ]}
    />
  </TouchableOpacity>
);

const AppStack = createStackNavigator(
  {
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Details',
        headerRight: () => (
          <React.Fragment>
            <StatusBar barStyle="light-content" />
            <HeaderRightButton
              icon={require('weather/App/assets/search.png')}
              onPress={() => navigation.navigate('Search')}
            />
          </React.Fragment>
        ),
        headerStyle: {
          backgroundColor: '#3145b7',
          borderBottomColor: '#3145b7',
        },
        headerTintColor: '#fff',
      }),
    },
    Search: {
      screen: Search,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Search',
        headerRight: () => (
          <React.Fragment>
            <StatusBar barStyle="dark-content" />
            <HeaderRightButton
              icon={require('weather/App/assets/close.png')}
              onPress={() => navigation.pop()}
              style={{ tintColor: '#000' }}
            />
          </React.Fragment>
        ),
        headerLeft: null,
      }),
    },
  },
  {
    mode: 'modal',
  }
);

export default createAppContainer(AppStack);