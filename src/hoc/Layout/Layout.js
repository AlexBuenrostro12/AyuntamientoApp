import React, { Component } from 'react';
import Aux from '../Auxiliar/Auxiliar';
import AppContainer from '../../components/Navigation/DrawerNavigation/AppContainer';
import { MenuProvider } from 'react-native-popup-menu';


export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <MenuProvider>
                    <AppContainer />
                </MenuProvider>
            </Aux>
        );
    }
}
