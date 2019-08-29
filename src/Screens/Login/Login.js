import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Communications from "react-native-communications";
import StatusBar from "../../UI/StatusBar/StatusBar";
import Aux from "../../hoc/Auxiliar/Auxiliar";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import Spinner from "../../components/CustomSpinner/CustomSpinner";
import { normalize } from "../../components/AuxiliarFunctions/FontResponsive";
import KBAvoiding from "../../components/KBAvoiding/KBAvoiding";

class Login extends Component {
  state = {
    login: true,
    index: true,
    form: {
      email: {
        itemType: "FloatingLabelWhite",
        holder: "Email",
        value: ""
      },
      password: {
        itemType: "FloatingLabelWhite",
        holder: "Contraseña",
        value: "",
        password: true
      }
    },
    idToken: null,
    expiresIn: null,
    email: null,
    loading: false,
    isInputFocused: false,
  };
  
  //Cambia de formulario dependiendo click de cada boton
  changeFormHandler = (ban, identifier) => {
    switch (identifier) {
      case "index":
        this.setState({ index: ban });
        break;
      case "login":
        this.signInUser(false);
        this.state.idToken &&
          this.state.expiresIn &&
          this.setState({ login: ban });
        break;

      default:
        null;
        break;
    }
  };

  static navigationOptions = {
    header: null
  };

  //Controla el valor de los input
  inputChangeHandler = (text, identifier) => {
    const updatedForm = {
      ...this.state.form
    };
    const updatedElement = {
      ...updatedForm[identifier]
    };
    updatedElement.value = text;

    updatedForm[identifier] = updatedElement;

    this.setState({ form: updatedForm });
  };
  //Almacena el token y tiempo de expiracion del mismo en la app globalmente
  storeToken = async () => {
    try {
      await AsyncStorage.setItem("@storage_token", this.state.idToken);
      await AsyncStorage.setItem(
        "@storage_expiresIn",
        this.state.expiresIn.toString()
      );
      await AsyncStorage.setItem("@storage_email", this.state.email.toString());
      this.setState({ login: false });
      this.props.navigation.navigate(!this.state.login && "App");
    } catch (e) {
      Alert.alert("Login", "¡Error al almacenar token!", [{ text: "Ok" }], {
        cancelable: false
      });
    }
  };
  //Ingresa usuario con sus credenciales
  signInUser = isAdmin => {
    let url = null;
    const { email, password } = this.state.form;
    let body = null;
    if (isAdmin) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBix5LF2utfHvWl6VB2cjdvZKtjXdbLz98";
      body = {
        email: email.value,
        password: password.value,
        returnSecureToken: true
      };
    } else {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBix5LF2utfHvWl6VB2cjdvZKtjXdbLz98";
      body = {
        returnSecureToken: true
      };
    }
    this.setState({ loading: true });
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(parsedRes => {
        this.setState({ loading: false });
        console.log(parsedRes);
        const { idToken, error, expiresIn, email } = parsedRes;
        if (idToken) {
          const now = new Date();
          const expiryDate = now.getTime() + expiresIn * 1000;
          console.log(now, new Date(expiryDate));
          this.setState({
            idToken: idToken,
            expiresIn: expiryDate,
            email: email ? "true" : "false"
          });
          this.storeToken();
        }
        if (error) {
          this.setState({ loading: false });
          Alert.alert(
            "Login",
            "¡Error: " + error.code + ", " + error.message,
            [{ text: "Ok" }],
            { cancelable: false }
          );
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        alert("Authentication failed, please try again, catch");
      });
  };

  
  focusedInput = () => this.setState({ isInputFocused: true });
  onEndEditing = () => this.setState({ isInputFocused: false });

  render() {
    const formElements = [];
    for (let key in this.state.form) {
      if (!this.state.index) {
        formElements.push({
          id: key,
          config: this.state.form[key]
        });
      }
    }
    const spinner = <Spinner color="blue" />;
    const principalButtons = (
      <View style={styles.imageButtonsContainer}>
        {/* Guest */}
        <TouchableOpacity
          onPress={() => this.changeFormHandler(false, "login")}
        >
          <View style={styles.itemButtonConteinerGuest}>
            <Image
              style={styles.imageButtons}
              resizeMode="contain"
              source={require("../../assets/images/Buttons/guest.png")}
            />
            <Text style={styles.itemTextButton}>Ingreso</Text>
          </View>
        </TouchableOpacity>
        {/* Admin */}
        <TouchableOpacity
          onPress={() => this.changeFormHandler(false, "index")}
        >
          <View style={styles.itemButtonConteinerAdmin}>
            <Image
              style={styles.imageButtons}
              resizeMode="contain"
              source={require("../../assets/images/Buttons/admin.png")}
            />
            <Text style={styles.itemTextButton}>Administrador</Text>
          </View>
        </TouchableOpacity>
        {/* 911 */}
        <TouchableOpacity onPress={() => Communications.phonecall("911", true)}>
          <View style={styles.itemButtonConteiner911}>
            <Image
              style={styles.imageButtons}
              resizeMode="contain"
              source={require("../../assets/images/Buttons/911.png")}
            />
            <Text style={styles.itemTextButton}>Emergencia</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
    const content = (
      <ImageBackground
        imageStyle={{ resizeMode: "stretch" }}
        source={require("../../assets/images/Ayuntamiento/fondo.jpg")}
        style={styles.container}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
            {!this.state.isInputFocused && <Image
              style={styles.image}
              source={require("../../assets/images/Ayuntamiento/logo.png")}
            />}

          {!this.state.loading ? (
            <View style={styles.form}>
              {/* Image Buttons */}
              {this.state.index && principalButtons}
              {/* New form login */}
              {!this.state.index && (
                <View style={styles.imageButtonsContainerForm}>
                  {!this.state.index && !this.state.isInputFocused && (
                    <View style={styles.loginBtns}>
                      <TouchableOpacity style={{ backgroundColor: '#878787', borderRadius: 3 }} onPress={() => this.changeFormHandler(true, "index")}>
                        <Text style={styles.itemTextFormButton}>Regresar al inicio</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {!this.state.index &&
                    formElements.map(e => (
                      <CustomInput
                        key={e.id}
                        itemType={e.config.itemType}
                        holder={e.config.holder}
                        changed={text => this.inputChangeHandler(text, e.id)}
                        password={e.config.password}
                        focused={this.focusedInput}
                        endEditing={this.onEndEditing}
                      />
                    ))}
                  {!this.state.index && (
                    <TouchableOpacity style={{ backgroundColor: '#869E25', borderRadius: 3, margin: 5 }} onPress={() => this.signInUser(true)}>
                      <Text style={styles.itemTextFormButton}>Ingresar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {/* New form login */}
            </View>
          ) : (
            <View style={{ flex: 1, alignSelf: "center" }}>{spinner}</View>
          )}
        </ScrollView>
      </ImageBackground>
    );

    const form = (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar color="#FEA621" />
        <View style={{ flex: 1 }}>{content}</View>
      </SafeAreaView>
    );

    return (
      <Aux>
        <KBAvoiding>{form}</KBAvoiding>
      </Aux>
    );
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  form: {
    flex: 1,
    // backgroundColor: 'green',
    justifyContent: "flex-end"
  },
  image: {
    resizeMode: "contain",
    height: width / 2,
    width: width / 2,
    alignSelf: "center",
    borderRadius: 0,
    marginTop: height * 0.12
  },
  imageButtons: {
    height: width * 0.12,
    width: width * 0.12,
    marginRight: 5
  },
  imageButtonsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: height * 0.12
  },
  imageButtonsContainerForm: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: width,
    marginBottom: height * 0.12
  },
  text: {
    fontFamily: "AvenirNextLTPro-Regular",
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "white",
    borderRadius: 5,
    alignSelf: "center"
  },
  bckgrnd: {
    borderRadius: 5
  },
  loginBtns: {
    alignSelf: "center",
    width: width / 2,
    borderRadius: 5
  },
  spinner: {
    flex: 1
  },
  scroll: {
    flex: 1
    // backgroundColor: 'red',
  },
  itemButtonConteinerGuest: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#7C8B90",
    width: width,
    alignItems: "center",
    marginBottom: 5
  },
  itemButtonConteinerAdmin: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#467393",
    width: width,
    alignItems: "center",
    marginBottom: 5
  },
  itemButtonConteiner911: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#DE003D",
    width: width,
    alignItems: "center",
    marginBottom: 5
  },
  itemTextButton: {
    fontFamily: "AvenirNextLTPro-Regular",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "white",
    borderRadius: 5,
    alignSelf: "center"
  },
  itemTextFormButton: {
    fontFamily: "AvenirNextLTPro-Regular",
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    padding: 5
  }
});

export default Login;
