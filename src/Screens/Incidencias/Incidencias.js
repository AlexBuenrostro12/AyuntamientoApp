import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import Localizacion from '../../components/Incidencias/Localizacion';


const incidencias = (props) => {

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View>
                    <HeaderToolbar open={props} />
                </View>
                <StatusBar color="#ff9933" />
                <ScrollView>
                    <Localizacion />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default incidencias;