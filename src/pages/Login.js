import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { KeyboardAvoidingView, Platform, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import logo from '../assets/logo.png';
import api from '../services/api';

export default function pages({ navigation }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user')
            .then( user => {
                if(user) {
                    navigation.navigate('Main', { user });
                }
            });
    }, []);

    async function handleLogin() {
        const response =  await api.post('/devs', {username: user});
        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
    }
  return (
    <KeyboardAvoidingView
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        style={styles.container}>
        <Image source={logo} />
        <TextInput 
            autoCapitalize='none'
            autoCorrect={false}
            value={user}
            onChangeText={setUser}
            placeholder="Digite o seu usuário do github" 
            placeholderTextColor='#999'
            style={styles.input} />
        <TouchableOpacity 
            onPress={handleLogin}
            style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
  );ButtonButton
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: "#FFF",
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 18,
    }
})