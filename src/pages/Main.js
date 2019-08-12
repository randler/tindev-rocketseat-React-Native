import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import logo from '../assets/logo.png';
import logout from '../assets/logout.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import api from '../services/api';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');

  const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });
            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    async function handleLike() {
      const [user, ...rest] = users;

      await api.post(`/devs/${user._id}/like`, null, {
          headers: {
              user: id
          }
      });

      setUsers(rest);
    }
    async function handleDislike() {
      const [user, ...rest] = users;
      await api.post(`/devs/${user._id}/dislike`, null, {
          headers: {
              user: id
          }
      });

      setUsers(rest);
    }

    async function handleLogout() {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHead}>
        <Image style={styles.logo} source={logo} />
        <TouchableOpacity 
          style={styles.containerLogout}
          onPress={handleLogout}>
          <Image resizeMode='center' style={styles.logout} source={logout} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        
        {users.length === 0 ?  
          <Text style={styles.empty}> Acabou os Devs :(</Text> : 
          users.map( (user, index) => (
            <View key={user._id} style={[styles.card, {zIndex: users.length - index} ]}>
              <Image style={styles.avatar} source={{uri: user.avatar}} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
              </View>
            </View>
            )
          ) 
       
        }

      </View>
      {users.length > 0 ? (
        <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleDislike} style={styles.button} >
          <Image source={dislike} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike} style={styles.button} >
          <Image source={like} />
        </TouchableOpacity>
      </View>
      ) : <View /> }
    </SafeAreaView>
  );
}
 

const styles = StyleSheet.create({
  containerHead: {
    flexDirection: 'row',
  },
  containerLogout: {
    position: 'absolute',
    top: 30,
    left: Dimensions.get('window').width /2 - 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 118,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  logout: {
    height: 25,
    width: 22,
    aspectRatio: 1
  },
  logo: {
    marginTop: 30
  },
  container: {
    flex:1, 
    backgroundColor:'#F5F5F5',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },
  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333'
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 9,
    lineHeight: 18
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold'
  }
});