import React, { Component } from 'react';
import Aux from '../Auxiliar/Auxiliar';
import Login from '../../Screens/Login/Login';

export default class Layout extends Component {
    render () {
        return (
            <Aux>
                <Login />                
            </Aux>
        );
    }
}
