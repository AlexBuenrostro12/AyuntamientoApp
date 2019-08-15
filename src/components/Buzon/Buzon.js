import React, { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import axios from "../../../axios-ayuntamiento";
import ListData from "../ListData/ListData";

export default class Buzon extends Component {
  _isMounted = false;

  state = {
    actividad: null,
    asunto: null,
    comentario: null,
    email: null,
    fecha: null,
    nombre: null,
    itemKey: null,
    approved: null,
    showItemCard: false,
    data: []
  };

  clickedListHandler = (identifier, key) => {
    console.log("Actividad.js:clickList: ", identifier, key);
    for (let dataName in this.props.data) {
      const fecha = this.props.data["fecha"].split("T", 1);
      if (this.props.data[dataName] === identifier) {
        this.setState({ asunto: this.props.data[dataName] });
        this.setState({ comentario: this.props.data["comentario"] });
        this.setState({ email: this.props.data["email"] });
        this.setState({ fecha: fecha });
        this.setState({ nombre: this.props.data["nombre"] });
        this.setState({ itemKey: key });
      }
    }
    for (let key in this.props.approvedData) {
      console.log("apr: ", this.props.approvedData[key]);
      this.setState({ approved: this.props.approvedData[key] });
    }
    this.setState({ showItemCard: true }, () => this.goToDescribeData());
  };

  goToDescribeData = () => {
    if (this.state.showItemCard) {
      const obj = {
        approved: this.state.approved,
        asunto: this.state.asunto,
        comentario: this.state.comentario,
        email: this.state.email,
        fecha: this.state.fecha,
        nombre: this.state.nombre,
        isAdmin: this.props.isAdmin,
        approvedItem: this.approveItemListHandler,
        deleteItem: this.alertCheckDeleteItem,
        type: "Buzón Ciudadano",
        barProps: { title: "Sugerencias", status: "#f39028", bar: "#f8ae40" }
      };
      const { navigate } = this.props.describe.navigation;
      navigate("Describe", { data: obj });
    }
  };

  approveItemListHandler = approved => {
    console.log(
      "approveItemListHandler:res: ",
      this.props.token,
      this.state.itemKey
    );
    const { navigate } = this.props.describe.navigation;
    console.log("navigate: ", navigate, "approved: ", approved);
    let body = "";
    if (approved) body = "¡Sugerencia aprobada con éxito!";
    else body = "¡Sugerencia desaprobada con éxito!";
    const obj = {
      approvedData: {
        approved: approved
      }
    };
    axios
      .patch(
        "/suggestions" +
          "/" +
          this.state.itemKey +
          ".json?auth=" +
          this.props.token,
        obj
      )
      .then(response => {
        console.log("approveItemListHandler:res: ", response);
        Alert.alert(
          "¡Buzón ciudadano!",
          body,
          [{ text: "Ok", onPress: () => this.refreshItemsHandler() }],
          {
            cancelable: false
          }
        );
      })
      .catch(error => {
        console.log("approveItemListHandler:res: ", error);
        Alert.alert(
          "¡Buzón ciudadano!",
          "¡Sugerencia fallida al aprobar!",
          [{ text: "Ok" }],
          {
            cancelable: false
          }
        );
      });
  };

  alertCheckDeleteItem = () => {
    Alert.alert(
      "Buzón ciudadano",
      "¿Desea eliminar esta sugerencia?",
      [
        { text: "Si", onPress: () => this.deleteItemListHandler() },
        { text: "No" }
      ],
      {
        cancelable: false
      }
    );
  };

  deleteItemListHandler = () => {
    console.log(
      "deleteItemListHandler:res: ",
      this.props.token,
      this.state.itemKey
    );
    const { navigate } = this.props.describe.navigation;
    axios
      .delete(
        "/suggestions" +
          "/" +
          this.state.itemKey +
          ".json?auth=" +
          this.props.token
      )
      .then(response => {
        console.log("deleteItemListHandler:res: ", response);
        Alert.alert(
          "Buzón ciudadano",
          "Sugerencia eliminada con exito!",
          [
            {
              text: "Ok",
              onPress: () => {
                navigate("Buzón Ciudadano");
                this.refreshItemsHandler();
              }
            }
          ],
          {
            cancelable: false
          }
        );
      })
      .catch(error => {
        console.log("deleteItemListHandler:res: ", error);
        Alert.alert(
          "Buzón ciudadano",
          "Sugerencia fallida al eliminar!",
          [{ text: "Ok" }],
          {
            cancelable: false
          }
        );
      });
  };

  refreshItemsHandler = () => {
    this.setState({ showItemCard: false });
    this.props.refresh();
  };

  componentDidMount() {
    const data = [];
    const obj = {};
    for (let dataName in this.props.data) {
      if (dataName === "asunto") {
        obj.title = this.props.data[dataName];
      }
      if (dataName === "fecha") {
        const fecha = this.props.data[dataName].split("T", 1);
        obj.fecha = fecha;
      }
    }
    const oddORnot = this.props.index % 2;
    let odd = null;
    if (oddORnot === 1) odd = false;
    else odd = true;
    obj.odd = odd;
    data.push(obj);
    this.setState({ data: data });
  }

  render() {
    const listData = (
      <ListData
        data={this.state.data}
        id={this.props.id}
        clicked={this.clickedListHandler}
        showLikeIcons={this.props.showLikeIcons}
      />
    );

    return <View>{listData}</View>;
  }
}

const styles = StyleSheet.create({
  listSuggestions: {
    marginLeft: 2,
    marginRight: 2,
    marginTop: 5,
    marginBottom: 5
  },
  button: {
    flex: 1,
    flexGrow: 1,
    marginTop: 5,
    marginBottom: 5
  },
  btnsAdm: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  btnsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  btnsAdmImg: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    marginLeft: 2
  },
  image: {
    resizeMode: "contain",
    height: 160,
    width: 200,
    alignSelf: "center"
  }
});
