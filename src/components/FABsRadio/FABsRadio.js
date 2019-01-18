import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Fab } from 'native-base';
import radio from '../../assets/images/Radio/radio.png';
import play from '../../assets/images/Play/play.png';
import pause from '../../assets/images/Pause/pause.png';
import mute from '../../assets/images/Mute/mute.png';

export default class FABsRadio extends Component {

    state = {
        called: false,
        number: '3411381787',
        active: false
    }

    render() {
        return(
            <Fab 
                active={this.state.active}
                style={styles.fab}
                position="bottomRight"
                direction="left">
                <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => this.setState({ active: !this.state.active })}>
                    <Image 
                        style={{width: 25, height: 25}}
                        source={radio}/>
                </TouchableOpacity>
                <Fab 
                    active={this.state.active}
                    style={{backgroundColor: "green"}}>
                    <TouchableOpacity hitSlop={styles.hitSlop}>
                        <Image
                            style={{width:20, height: 20}}
                            source={play} />
                    </TouchableOpacity>
                </Fab>
                <Fab 
                    active={this.state.active}
                    style={{backgroundColor: "red"}}>
                    <TouchableOpacity hitSlop={styles.hitSlop}>
                        <Image
                            style={{width:20, height: 20}}
                            source={pause} />
                    </TouchableOpacity>
                </Fab>
                <Fab 
                    active={this.state.active}
                    style={{backgroundColor: "red"}}>
                    <TouchableOpacity hitSlop={styles.hitSlop}>
                        <Image
                            style={{width:20, height: 20}}
                            source={mute} />
                    </TouchableOpacity>
                </Fab>
            </Fab>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    fab: {
        backgroundColor: 'blue'
    },
    hitSlop: {
        top: 30, 
        bottom: 30, 
        left: 50, 
        right: 50,
    }
});