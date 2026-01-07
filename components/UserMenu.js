import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function UserMenu({ visible, onClose, onLogoff }) {
  const translateX = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateX }] }] }>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={{ fontSize: 22, color: 'white' }}>✕</Text>
        </TouchableOpacity>
        <View style={styles.userIconBox}>
          <Image source={require('../assets/user.png')} style={{ width: 60, height: 60 }} />
        </View>
        <TouchableOpacity style={styles.logoffBtn} onPress={onLogoff}>
          <Text style={styles.logoffText}>Fazer logoff</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#FFF',
    elevation: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menu: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userIconBox: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logoffBtn: {
    backgroundColor: '#FFC100',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 40,
  },
  logoffText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
