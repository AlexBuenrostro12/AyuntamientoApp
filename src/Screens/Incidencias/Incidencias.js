import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import StatusBar from '../../UI/StatusBar/StatusBar';
import Localizacion from '../../components/Incidencias/Localizacion/Localizacion';
import Multimedia from '../../components/Incidencias/Multimedia/Multimedia';
import Descripcion from '../../components/Incidencias/Descripcion/Descripcion';
import DatosPersonales from '../../components/Incidencias/DatosPersonales/DatosPersonales';

const incidencias = (props) => {

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View>
                    <HeaderToolbar 
                        open={props}
                        title="Incidencias" />
                </View>
                <StatusBar color="#ff9933" />
                <ScrollView>
                    <Localizacion />
                    <Multimedia />
                    <Descripcion />
                    <DatosPersonales />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: '11%'
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