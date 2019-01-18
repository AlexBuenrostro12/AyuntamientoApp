import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import DrawerNavigation from '../../components/Navigation/DrawerNavigation/DrawerNavigation';
import FAB from '../../UI/FAB/FAB';

export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <DrawerNavigation />
                {/* <FAB /> */}
            </Aux>
        );
    }
}
