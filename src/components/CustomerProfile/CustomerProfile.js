import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View }
  from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Accordion from 'react-native-collapsible/Accordion';

import * as urls from '../../constants/api';


const styles = require('./CustomerProfileStyles');

const SECTIONS = [
  {
    title: 'Mi información',
    content: 'MI INFORMACION'
  },
  {
    title: 'Mi cuenta',
    content: 'MI CUENTA'
  },
  {
    title: 'Mis lugares',
    content: 'MIS LUGARES'
  },
  {
    title: 'Pagos',
    content: 'PAGOS'
  }
];

export default class CustomerProfile extends Component {
  constructor(props) {
    super(props);
  //   this.state = {
  //     servicesTypes: [],
  //     nextJobs: [],
  //     pastJobs: []
  //   };
  //   this.getServicesTypes = this.getServicesTypes.bind(this);
  //   this.getNextJobs = this.getNextJobs.bind(this);
  //   this.getPastJobs = this.getPastJobs.bind(this);
    this.signOutCustomer = this.signOutCustomer.bind(this);
  }

  signOutCustomer = (authToken) => {
    signoutURL = urls.BASE_URL + urls.CUSTOMER_SIGNOUT;
    fetch(signoutURL, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
    }).then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('CustomerLogin');
        }
      }).catch((error) => this.setState({errorMessage: error.message}));
  };

  _renderHeader(section) {
    return (
        <View style={styles.accordion_header}>
          <Text style={styles.accordion_header_title}>{section.title}</Text>
          <FontAwesome
              name="chevron-right"
              size={24}
              color='#2478AE'
          />
        </View>
    );
  }

  _renderContent(section) {
    return (
        <View style={styles.accordion_content}>
          <Text>{section.content}</Text>
        </View>
    );
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.header_title}>Perfil</Text>
          </View>
          <ScrollView contentContainerStyle={styles.main_content}>
            <View style={styles.profile_picture_name_container}>
              <Image source={require('../../../assets/img/customer_profile.png')}  style={styles.profile_image}/>
              <Text style={styles.profile_name}>
                {this.props.navigation.getParam('data').customer.data.attributes.first_name} {this.props.navigation.getParam('data').customer.data.attributes.last_name}
              </Text>
            </View>
            <Accordion
                sections={SECTIONS}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
            />
            <View style={styles.logout_container}>
              <TouchableOpacity style={styles.logout_button} onPress={()=>this.signOutCustomer(this.props.navigation.getParam('data').customer.data.attributes.access_token)}>
                <Text style={styles.logout_button_text}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footer_item} onPress={()=>this.props.navigation.navigate('CustomerDashboard', { data: this.props.navigation.getParam('data')})}>
              <FontAwesome
                  name="home"
                  size={24}
                  color='gray'
              />
              <Text style={styles.footer_item_text}>
                Home
              </Text>
            </TouchableOpacity>
            <View style={styles.footer_item}>
              <FontAwesome
                  name="briefcase"
                  size={24}
                  color='gray'
              />
              <Text style={styles.footer_item_text}>Trabajos</Text>
            </View>
            <View style={styles.footer_item}>
              <FontAwesome
                  name="user"
                  size={24}
                  color='gray'
              />
              <Text style={styles.footer_item_text}>Profile</Text>
            </View>
          </View>
        </View>
    );
  }
}
