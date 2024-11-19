import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import HeaderImageComponent from '@/components/HeaderImageComponent';


export default function HomePage() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>BSMS Physiology</Text>
      </View>
 <View style={styles.splashContainer}>
      <Image
          source={require('@/assets/images/PinkLogo.png')}
          style={styles.bsmsLogoBW}
        />
    </View>
     </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    height: 80,
    width: '100%',
    backgroundColor: '#7F1C3E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  headerText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  splashContainer: {
    height: 550,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD200',
  },
/*   headerImage: {
    height: 0,
    width: '10%',
    resizeMode: 'contain',
  },
  splashImage: {
    //width: '10%',
    //resizeMode: 'contain',
  }, */
  bsmsLogoBW: {
    height: 366,
   // width: 350,
  width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingTop: 30,
    //bottom: 0,
    //left: 0,
    //position: 'absolute',
  },
  /*  mainImage: {
    width: '100%',
    height: 125, // Adjust this based on the HEADER_HEIGHT
    //resizeMode: 'cover', // 'contain' or 'center' based on desired fit
  }, */
});
