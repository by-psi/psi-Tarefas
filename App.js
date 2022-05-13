import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, Keyboard, 
  StyleSheet, SafeAreaView  } from 'react-native';

console.disableYellowBox=true;

import Login  from './src/components/login';
import TaskList from './src/components/tasklist';
import firebase from './src/firebase/config';
import Icon from 'react-native-vector-icons/Feather';

export default function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);

  const inputRef = useRef(null);
  const [myTaskList, setMyTaskList] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {
    function getUser(){     
      if(!user){
        return;
      }
      firebase.database().ref('tarefas').child(user).once('value', (snapshot)=>{
        setMyTaskList([]);
        snapshot?.forEach((childItem)=>{
          let data = {
            key: childItem.key,
            task: childItem.val().task
          }
          setMyTaskList(oldTaks => [...oldTaks, data])
        })
      })
    }
    getUser();
  }, [user])

  function Add() {
    if (newTask === '') {
      return;
    }
    // editando uma tarefa já existente
    if(key !== '') {
      firebase.database().ref('tarefas').child(user).child(key).update({
        task: newTask
      })
      .then(()=>{
        const taskIndex = myTaskList.findIndex(item => item.key === key)
        let copyTaskList = myTaskList;
        copyTaskList[taskIndex].task = newTask
        setMyTaskList([...copyTaskList])
      })
      Keyboard.dismiss();
      setNewTask('');
      setKey('');
      return;
    }
    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;
    tarefas.child(chave).set({
      task: newTask
    })
    .then(()=>{
      const data ={
        key: chave,
        task: newTask       
      };
      setMyTaskList(oldTaks => [...oldTaks, data])
    })
    Keyboard.dismiss();
    setNewTask('');
  }

  function Edit(data) {
    setKey(data.key);
    setNewTask(data.task);
    inputRef.current.focus();    
  }

  function Delete(key) {
    firebase.database().ref('tarefas').child(user).child(key).remove()
    .then(()=>{
      const NewList = myTaskList.filter(item => item.key !== key)
      setMyTaskList(NewList)
    })
  }

  function cancelEdit() {
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  }

  if(!user) {
    return <Login 
      changeUser={(user) => setUser(user)} 
      changeName={(name) => setName(name)}
    />
  }

  async function logout(){
    await firebase.auth().signOut();
    setUser('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image 
          source={require('./src/assets/logo.jpg')} 
          style={[styles.image]}
        />
        {user.length > 0 ? 
          ( 
            <Text style={[styles.userInfo, {color: '#000'}]}>
              Olá {name}!
            </Text>  
          ) : 
          ( 
            <Text style={[styles.userInfo, {color: '#FF0000'}]}>
              Nenhum usuário logado.
            </Text>  
          ) 
        }      

      </View>

      { key.length > 0 && (
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <TouchableOpacity onPress={cancelEdit}>
            <Icon name='x-circle' size={20} color='#FF0000' />
          </TouchableOpacity>
          <Text style={{marginLeft: 5, color: '#FF0000'}}> 
            Você está editando uma tarefa...
          </Text>
        </View>
      )}

      <View style={styles.taskArea}>
        <TextInput
          style={styles.input}
          placeholder='Qual tarefa deseja adicionar?'
          value={newTask}
          onChangeText={ (input) => setNewTask(input)}
          ref={inputRef}
        />
        <TouchableOpacity 
          style={styles.btnAdd}
          onPress={Add}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={myTaskList}
        keyExtractor={ item => item.key}
        renderItem={ ({ item }) => (
          <TaskList 
            data={item}
            deleteItem={Delete}
            editItem={Edit}
          />
        )}
      />

      <View style={styles.btnArea}>
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: '#FF0000'}]}
          onPress={logout}
        >
          <Text style={styles.btnText}>Sair (Logout)</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  image: { 
    width: 150, 
    height: 150,
    marginBottom: 20,
  },
  userInfo: {
    marginTop: 20, 
    marginBottom: 20, 
    fontSize: 17, 
    textAlign: 'center'
  },
  taskArea:{
    flexDirection: 'row'
  },
  input:{
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45,
  },
  btnAdd:{
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4
  },
  btnArea:{
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },  
  button:{
    width: '100%',
    height: 50,
    margin: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 5,
  },
    btnText:{
    color: '#FFF',
    fontSize: 22,
  }
});
