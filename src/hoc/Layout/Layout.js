import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import StatusBar from '../../UI/StatusBar/StatusBar';
import DrawerNavigation from '../../components/Navigation/DrawerNavigation/DrawerNavigation';

export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <DrawerNavigation />
            </Aux>
        );
    }
}