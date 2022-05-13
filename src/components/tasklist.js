import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icons from 'react-native-vector-icons/Fontisto';

export default function TaskList({data, deleteItem, editItem}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={{marginRight: 10}}
        onPress={ () => deleteItem(data.key) }
      >
        <Icons name='trash' color='#FFF' size={20} />
      </TouchableOpacity>
      <View style={{paddingRight: 10}}>
        <TouchableWithoutFeedback
          onPress={ () => editItem(data) }
        >
          <Text style={{color: '#FFF', paddingRight: 10}}>
            {data.task}
          </Text>
        </TouchableWithoutFeedback>
      </View>    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
  },
  taskTxt:{
    fontSize: 22,
    color: '#FFF'
  },
});