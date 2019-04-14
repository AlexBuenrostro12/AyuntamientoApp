import React, { Component } from 'react';
import Aux from '../Auxiliar/Auxiliar';
import AppContainer from '../../components/Navigation/DrawerNavigation/AppContainer';

export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <AppContainer />
            </Aux>
        );
    }
}
