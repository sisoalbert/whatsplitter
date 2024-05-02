import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Whatsplitter</Text>
      <Button title="Trimmer" onPress={() => navigation.navigate('Trimmer')} />
      <Button title="Editor" onPress={() => navigation.navigate('Editor')} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
