import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  Notifications,
} from 'exponent';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

class TabBadge extends React.Component {
  render() {
    if (this.props.count > 0) {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>{this.props.count}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
}


export default class RootNavigation extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TabNavigation
          tabBarHeight={56}
          initialTab="home">
          <TabNavigationItem
            id="home"
            renderIcon={isSelected => this._renderIcon('home', isSelected)}>
            <StackNavigation initialRoute="home" />
          </TabNavigationItem>

          <TabNavigationItem
            id="links"
            renderIcon={isSelected => this._renderIcon('book', isSelected)}>
            <StackNavigation initialRoute="links" />
          </TabNavigationItem>

          <TabNavigationItem
            id="settings"
            renderIcon={isSelected => this._renderIcon('cog', isSelected)}>
            <StackNavigation initialRoute="settings" />
          </TabNavigationItem>
        </TabNavigation>
        <TabBadge count={7} />
      </View>
    );
  }

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={32}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    this.props.navigator.showLocalAlert(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
      Alerts.notice
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
  badge: {
    position: 'absolute',
    bottom: 34,
    left: 70,
    backgroundColor: '#f44336',
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
