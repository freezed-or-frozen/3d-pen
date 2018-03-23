/*
 * Application React Native qui lit les valeurs issues des accéléromètres
 * et les transmet via une webscoket à un serveur en réseau
 *
 * LANCEMENT APPLCIATION MOBILE
 *   exp start
 *
 * LANCEMENT SERVEUR WEBSOCKETS
 *   VERSION PROCESSING, voir=test_websocket_server
 *   VERSION CONSOLE, avec
 *     sudo npm install -g wsnc
 *     wsnc -l 1664
 *
 * WEBOGRAPHIE
 *   https://docs.expo.io/versions/latest/sdk/accelerometer.html
 */


// Librairies utilisées
import React from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Accelerometer } from 'expo';


// Classe de l'application
export default class AccelerometerSensor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            accelerometerData: {},
            ipAddress: '192.168.0.11',
            connected: false,
            sendingData: false,
            function1: 0,
            function2: 0,
            function3: 0,
            function4: 0
        }

        this.webSocket = null;
    }

    componentDidMount() {
        console.log("=== componentDidMount ===");
        this._subscribe();
        Accelerometer.setUpdateInterval(200);  // 16 avant
    }

    componentWillUnmount() {
        console.log("=== componentDidMount ===");
        this._unsubscribe();
    }

    _subscribe = () => {
        this._subscription = Accelerometer.addListener(accelerometerData => {
            this.setState({ accelerometerData });
            if (this.state.connected == true) {
                this._sendAccelerometerData();
            }
        });
    }

    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    _onStartSendingData = () => {
        //Alert.alert('Envoi => ' + this.state.ipAddress);
        this.webSocket = new WebSocket('ws://' + this.state.ipAddress + ':1664/3dpen');
        this.webSocket.onopen = () => {
            //this.webSocket.send("CONNECTED\n");
            console.log('=== Connected:true ===\n');
            this.setState({connected: true});
        };

        this.webSocket.onclose = (e) => {
            // connection closed
            this.setState({connected: false});
            console.log('=== Connected:false ===\n');
            console.log(e.code, e.reason);
        };

        this.setState({sendingData: true});
        console.log('=== START sending accelerometers data ===\n');
    }


    _onStopSendingData = () => {
        //Accelerometer.setUpdateInterval(200);  // 16 avant
        //Alert.alert('Arrêt => ' + this.state.ipAddress);
        this.setState({connected: false});
        //console.log('=== STOP sending accelerometers data ===\n');
    }


    _sendAccelerometerData = () => {
        let { x, y, z } = this.state.accelerometerData;
        var milliseconds = (new Date).getTime();
        if ((this.webSocket != null) && (this.state.connected == true)) {
            this.webSocket.send(x + ';' + y + ";" + z + ";" + this.state.function1 + ";" + this.state.function2 + ";" + this.state.function3 + ";" + this.state.function4 + ";" + milliseconds + "\n");
            //console.log(x + ';' + y + ";" + z + ";" + milliseconds + "\n");
        }
    }

    _onChangeInterval200 = () => {
        Accelerometer.setUpdateInterval(200);  // 16 avant
        console.log('=== CHANGE interval to 200 ms ===\n');
    }

    _onChangeInterval100 = () => {
        Accelerometer.setUpdateInterval(100);  // 16 avant
        console.log('=== CHANGE interval to 100 ms ===\n');
    }

    _onChangeInterval50 = () => {
        Accelerometer.setUpdateInterval(50);  // 16 avant
        console.log('=== CHANGE interval to 50 ms ===\n');
    }

    _onFct1 = () => {
        if (this.state.function1 == 0) {
            this.setState({function1: 1});
        } else {
            this.setState({function1: 0});
        }
    }

    _onFct2 = () => {
        if (this.state.function2 == 0) {
            this.setState({function2: 1});
        } else {
            this.setState({function2: 0});
        }
    }

    _onFct3 = () => {
        if (this.state.function3 == 0) {
            this.setState({function3: 1});
        } else {
            this.setState({function3: 0});
        }
    }

    _onFct4 = () => {
        if (this.state.function4 == 0) {
            this.setState({function4: 1});
        } else {
            this.setState({function4: 0});
        }
    }


    render() {
        let { x, y, z } = this.state.accelerometerData;

        return (
            <View style={styles.container}>

                <View style={styles.logoContainer}>
                    <Image source={require("./assets/logo_lycee.png")} />
                </View>

                <View style={styles.sensorContainer}>
                    <Text>Accéléromètre :</Text>
                    <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>
                </View>

                <View style={styles.textviewContainer}>
                    <Text>Adresse IP du serveur :</Text>
                    <TextInput
                        style={{height: 40}}
                        placeholder="Adresse IP du serveur"
                        onChangeText={(ipAddress) => this.setState({ipAddress})}
                        value={this.state.ipAddress}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this._onStartSendingData}
                        title="Démarrer"
                    />
                    <Button
                        onPress={this._onStopSendingData}
                        title="Arrêter"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this._onChangeInterval200}
                        title="200ms"
                    />
                    <Button
                        onPress={this._onChangeInterval100}
                        title="100ms"
                    />
                    <Button
                        onPress={this._onChangeInterval50}
                        title="50ms"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={this._onFct1}
                        title="FCT1"
                    />
                    <Button
                        onPress={this._onFct2}
                        title="FCT2"
                    />
                    <Button
                        onPress={this._onFct3}
                        title="FCT3"
                    />
                    <Button
                        onPress={this._onFct4}
                        title="FCT4"
                    />
                </View>
            </View>
        );
    }
}

function round(n) {
    if (!n) {
        return 0;
    }

    return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textviewContainer: {
        padding: 10,
        marginTop: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 15,
        padding: 10,
    },
    button: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
    },
    sensorContainer: {
        marginTop: 15,
        paddingHorizontal: 10,
    },

});
