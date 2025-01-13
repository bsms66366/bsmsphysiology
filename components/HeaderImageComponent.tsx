//HeaderImageComponent.tsx

import React from 'react';
import { Image, StyleSheet,Text } from 'react-native';

export default function HeaderImageComponent() {
  return (
    
    // <Image source={require('@/assets/images/BSMSLogobw.png')} style={styles.image} />
    <Text style={styles.headerText}>BSMS Physiology</Text>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    width: '100%',
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  headerText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  image: {
    width: '75%',
    height: '30%',
    resizeMode: 'cover',
    backgroundColor: '#404040',
  },
});
