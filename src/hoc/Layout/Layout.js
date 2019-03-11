import React, { Component } from 'react';
import Aux from '../Auxiliar/Aux';
import DrawerNavigation from '../../components/Navigation/DrawerNavigation/DrawerNavigation';
import FAB from '../../UI/FAB/FAB';

export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <DrawerNavigation />
            </Aux>
        );
    }
}
