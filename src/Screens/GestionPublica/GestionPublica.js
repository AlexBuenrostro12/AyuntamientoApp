import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';


const gestionPublica = (props) => (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View>
                <HeaderToolbar 
                    open={props}
                    title="Gestión publica" />
            </View>
            <StatusBar color="#ff9933" />
            <View style={styles.view}>
                <Text style={styles.text}>Gestión Pública</Text>
            </View>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        overflow: 'scroll',
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default gestionPublica;