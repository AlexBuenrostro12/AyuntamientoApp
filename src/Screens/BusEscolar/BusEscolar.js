import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderToolbar from '../../components/HeaderToolbar/HeaderToolbar';
import { Card } from 'native-base';
import StatusBar from '../../UI/StatusBar/StatusBar';
import CustomCardItemTitle from '../../components/CustomCardItemTitle/CustomCardItemTitle';

const busEscolar = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <HeaderToolbar 
                    open={props}
                    title="Bus escolar" />
            </View>
            <StatusBar color="#ff9933" />
            <ScrollView style={styles.container}>
                <View style={{ flex: 1, margin: 5 }}>
                    <Card>
                        <CustomCardItemTitle
                            title="Bus escolar"
                            description="Consulta los horarios y destinos de tus camiones."
                            image={require('../../assets/images/Ubicacion/search.png')} />
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default busEscolar;