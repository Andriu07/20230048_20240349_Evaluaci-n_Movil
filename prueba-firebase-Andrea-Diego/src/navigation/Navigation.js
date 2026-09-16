import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';

import Login from '../screens/Login';
import Home from '../screens/Home';
import Add from '../screens/Add';

const Stack = createStackNavigator();

const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0284c7" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // Rutas protegidas (Solo visibles si el usuario inició sesión)
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ title: 'Productos' }} />
                        <Stack.Screen name="Add" component={Add} options={{ title: 'Agregar Producto' }} />
                    </>
                ) : (
                    // Ruta de autenticación
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;