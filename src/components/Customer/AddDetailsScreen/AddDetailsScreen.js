import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Picker,
  ScrollView,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './AddDetailsScreenStyle';
import { API } from '../../../util/api';
import * as globals from '../../../util/globals';
const { width } = Dimensions.get('window')
const IMAGES = {
    TOP_BACKGROUND: require("../../../../assets/img/topbg.png")
}

var is_form_validated = false;

export default class AddCardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      socialReason: '',
      identification: '',
      email: '',
      address: '',
      telephone: '',
      identificationTypeSelecct: '',
      identificationType : [
        {attributes : {name : "Consumidor final"}},
        {attributes : {name : "Cédula"}},
        {attributes : {name : "RUC"}},
      ],
      firstName : globals.first_name,
      lastName : globals.last_name,
      avatar : globals.avatar,
      email : globals.email,
      phone : globals.cell_phone,
      detailsData : null,
    }
  }

  addCardDataResponseData = {
    success: (response) => {
      try {
        Alert.alert("NOC NOC",response.message)
        console.log("Response data-->" + JSON.stringify(response))
      } catch (error) {
        console.log('getJobResponseData catch error ' + JSON.stringify(error));
      }
    },
    error: (err) => {
      console.log('getJobResponseData error ' + JSON.stringify(err));
    }
  }

  validation() {
    if (this.state.identificationTypeSelecct == ""){
      Alert.alert(
        'Error, en el tipo identificación ',
        'Debe seleccionar un tipo de identificación',
        [
          { text: 'OK', onPress: () => console.log('Debe seleccionar un tipo de identificación') }
        ]
      );
      is_form_validated = false;
    }
    else if (this.state.identification === "") {
      Alert.alert(
        'Error, numero de deidentificación',
        'Debe colocar su numero de identificación',
        [
          { text: 'OK', onPress: () => console.log('Debe colocar su numero de identificación') }
        ]
      );
      is_form_validated = false;
    }
    else if (this.state.address === "") {
      Alert.alert(
        'Error, de derección',
        'Debe colocar la derección para su facturación',
        [
          { text: 'OK', onPress: () => console.log('Debe colocar la derección para su facturación') }
        ]
      );
      is_form_validated = false;
    }
    else if (this.state.telephone === "") {
      Alert.alert(
        'Error, de Teléfono',
        'Debe colocar número de teléfono',
        [
          { text: 'OK', onPress: () => console.log('Debe colocar numero de telefono') }
        ]
      );
      is_form_validated = false;
    }
    else {
      is_form_validated = true;
    }
    this.onPressHandle()
  }

  onPressHandle = () =>{
    var it = 0
    if(this.state.identificationTypeSelecct == "Consumidor final"){
      it = 0
    }else if(this.state.identificationTypeSelecct == "Cédula"){
      it = 1
    }else if(this.state.identificationTypeSelecct == "RUC"){
      it = 2
    }
    let data = {
      "invoice_detail": {
        "email": this.state.email,
        "identification": this.state.identification,
        "identification_type": it,
        "social_reason": this.state.socialReason,
        "address": this.state.address,
        "telephone": this.state.telephone
      }
    }
    if(!this.state.isUpdate && is_form_validated){
      API.setAddInvoiceDetail(this.addInvoiceDetailDataResponseData, data, true);
      this.props.navigation.navigate("DetailsListScreen",{setDetails : this.setDetails})
    }else{
      console.log("Estoy aca ------------>")
    }
    
  }

  updateSelect = (select) => {
    this.setState({ identificationTypeSelecct: select })
  }

  setDetails = (detailsData) => {
    this.setState({
      detailsData: detailsData
    })
  }

  render() {
    let { data, checked } = this.state;
    var initials = this.state.firstName + " "
        initials += this.state.lastName
    if(this.state.socialReason == ""){
      this.setState({socialReason: initials})
    }
    return (
      <View style={styles.container}>
        <View>
          <View style={{ position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50, width: width }}>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'helvetica' }}>{"Agregar detalles de facturación"}</Text>
          </View>
        </View>
        <View>
          <Ionicons name={"ios-arrow-back"} size={40} style={styles.backButtonImage} onPress={() => this.props.navigation.goBack()} />
          <Image source={IMAGES.TOP_BACKGROUND} style={styles.topImage} resizeMode={"cover"} resizeMethod={"auto"}/>
          <View style={styles.topTitleView}>
            <Text>{"Agregar detalles de facturación"}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"Razon Social:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                <TextInput
                  ref={input => {
                    this.textInput = input
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Razon Social'
                  value={initials}
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({socialReason : text})} />
              </View>
            </View>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"Identificación:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                {(this.state.identificationType && this.state.identificationType.length > 0) ?
                  <Picker
                    selectedValue={this.state.identificationType}
                    style={{ height: 50, width: width - 20 }}
                    onValueChange={this.updateSelect}
                  >
                    <Picker.Item label={this.state.identificationTypeSelecct || "Seleccione opción"} value={this.state.identificationTypeSelecct} key={-1} />
                    { this.state.identificationType.map((item, key)=>{
                      return (<Picker.Item label={item.attributes.name} value={item.attributes.name} key={key} />)
                    })}
                  </Picker> : <Text style={{color:'lightgray',paddingLeft:10}}>{console.log(this.state.identificationTypeSelecct)}</Text>
                }
              </View>
            </View>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"N° de identificación:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                <TextInput
                  ref={input => {
                    this.textInput = input
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='N° de identificación'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({identification : text})} />
              </View>
            </View>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"Correo electrónico:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                <TextInput
                  ref={input => {
                    this.textInput = input
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Correo electrónico'
                  value={this.state.email}
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({email : text})} />
              </View>
            </View>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"Dircción:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                <TextInput
                  ref={input => {
                    this.textInput = input
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Dircción'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({address : text})} />
                </View>
            </View>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <View style={styles.textStyle}>
                <Text>{"Teléfono:"}</Text>
              </View>
              <View style={styles.textInputStyleContainer}>
                <TextInput
                  ref={input => {
                    this.textInput = input
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Teléfono'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({telephone : text})} />
              </View>
            </View>

          </View>
        </ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
          <TouchableOpacity onPress={() => this.validation()}>
            <Text style={{ color: '#1F68A9', fontFamily: 'helvetica', fontSize: 20, fontWeight: 'bold' }}>{"Agregar detalle de facturación"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}