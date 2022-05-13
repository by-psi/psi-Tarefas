import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView  } from 'react-native';
import firebase from '../services/Firebase';

export default function Login({changeUser, changeName}) {
  
  const [type, setType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  function Login() {
    if(type === 'login') {
      // login de acesso 
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
      .then((value) => {      
        firebase.database().ref('usuarios/'+ value.user.uid).on('value', (snapshot) => {
          // console.log(snapshot.val().username)
          changeName(snapshot.val().username)
        })
        changeUser(value.user.uid);
      })
      .catch((error) => {
        // console.log(error);
        alert('Erro: ' + error);
        return;
      })
    } else {
      // cadastrp de usuario
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((value) => {
        changeUser(value.user.uid);
        changeName(username);
        firebase.database().ref('usuarios').child(value.user.uid).set({
          username: username,
          phone: phone
        })        
        alert('Usuário cadastrado com sucesso');
        setEmail('');
        setPassword('');
        setUsername('');
        setPhone('');
      })
      .catch((error) => {
        console.log(error);
        alert('Não foi possível cadastrar usuário: ' + error);
        return;
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../../assets/logo.jpg')} 
        style={styles.image}
      />

      { type !== 'login' ?
        (
          <View style={styles.btnArea}>
            <TextInput
              style={styles.input}
              underlineColorAndroid='transparent'
              placeholder={'Nome'}
              value={username}
              onChangeText={(input)=>setUsername(input)}
              keyboardType={'email-address'}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid='transparent'
              placeholder={'Telefone'}
              value={phone}
              onChangeText={(input)=>setPhone(input)}
              keyboardType={'phone-pad'}
            />
          </View>
        ) :
        (
          <Text style={styles.subtitulo}>
            Login de Acesso:
          </Text>
        )
      }

      <TextInput
        style={styles.input}
        underlineColorAndroid='transparent'
        placeholder='Email'
        value={email}
        onChangeText={ (input) => setEmail(input) }
        keyboardType={'email-address'}
        />
      <TextInput
        style={styles.input}
        underlineColorAndroid='transparent'
        placeholder='Senha'
        value={password}
        onChangeText={ (input) => setPassword(input) }
        keyboardType={'numeric'}
      />

      <TouchableOpacity 
        style={[styles.button, {backgroundColor: type === 'login' ? '#3CB371' : '#3EA6F2'}]}
        onPress={Login}
      >
        <Text style={styles.btnText}>
          { type === 'login' ? 'Acessar minha Conta' : 'Cadastrar minha Conta' }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={ () => setType(type => type === 'login' ? 'cadastrar' : 'login')}
      >
        <Text style={{fontSize: 17, color: '#000', marginTop: 10}}>
          { type === 'login' ? 'Criar uma Conta' : 'Já possuo uma Conta' }
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitulo: {
    marginTop: 20, 
    marginBottom: 20, 
    fontSize: 18, 
    textAlign: 'center'
  },
  image: { 
    width: 150, 
    height: 150,
    marginBottom: 20,
  },
  input:{
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C0C0C0',
    height: 45,
    fontSize: 17
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
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 5,
  },
  btnText:{
    fontSize: 20,
    color: '#FFF'
  },  

});