import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
}
  from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

import * as urls from '../../../constants/api';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Moment from 'moment';
const styles = require('./CustomerDashboardStyles');
import * as globals from '../../../util/globals';

export default class CustomerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesTypes: [],
      nextJobs: [],
      pastJobs: []
    };
    this.getServicesTypes = this.getServicesTypes.bind(this);
    this.getNextJobs = this.getNextJobs.bind(this);
    this.getPastJobs = this.getPastJobs.bind(this);
    
  }

  // signOutCustomer = (authToken) => {
  //   signoutURL = urls.BASE_URL + urls.CUSTOMER_SIGNOUT;
  //   fetch(signoutURL, {
  //     method: 'DELETE',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': `Token ${authToken}`
  //     },
  //   }).then((response) => {
  //       if (response.status === 200) {
  //         this.props.navigation.navigate('CustomerLogin');
  //       }
  //     }).catch((error) => this.setState({errorMessage: error.message}));
  // };

  getServicesTypes = (authToken) => {
    servicesTypesURL = urls.BASE_URL + urls.SERVICE_TYPES;
    fetch(servicesTypesURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
    }).then((response) => response.json()).then((data) => {
      let servicesTypes = data.service_type.data;
      this.setState({servicesTypes});
    }).catch((error) => this.setState({errorMessage: error.message}));
  };

  getNextJobs = (authToken) => {
    nextJobsURL = urls.BASE_URL + urls.NEXT_JOBS;
    fetch(nextJobsURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
    }).then((response) => response.json()).then((data) => {
      let nextJobs = data.job.data;
      this.setState({nextJobs});
      console.log("NextJob-->",JSON.stringify(nextJobs))
    }).catch((error) => this.setState({errorMessage: error.message}));
  };

  getPastJobs = (authToken) => {
    pastJobsURL = urls.BASE_URL + urls.PAST_JOBS;
    fetch(pastJobsURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
    }).then((response) => response.json()).then((data) => {
      let pastJobs = data.job.data;
      this.setState({pastJobs});
    }).catch((error) => this.setState({errorMessage: error.message}));
  };

  componentDidMount() {
      AsyncStorage.getItem("customerData").then((item) =>{
        // const data = this.props.navigation.getParam('data');
        const data = JSON.parse(item)
        const authToken = data.customer.data.attributes.access_token;
        globals.access_token = authToken;
        this.getServicesTypes(authToken);
        this.getNextJobs(authToken);
        this.getPastJobs(authToken);
      })
  }

  renderPastJobs(){
    return(
      <View>
        <Text style={styles.section_title}>Próximos Trabajos</Text>
            <View style={styles.section_trabajos_container}>
              <ScrollView
                  contentContainerStyle={styles.trabajos_container}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
              >
                {
                  this.state.nextJobs.map((job) => {
                    // const date = new Date(job.attributes.started_at), locale = "es-ES",
                    //     month = date.toLocaleString(locale, {month: "long"});
                      //  var start_date = Moment.utc(new Date(job.attributes.started_at)).utcOffset(-5).format('ddd MMM, DD - hh:mm a YYYY') 
                       const date = new Date(job.attributes.started_at), locale = "es-ES",
                        month = date.toLocaleString(locale, {month: "long"});
                        var end_date = month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getDate() + " de " + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + "Hrs"
                      //  var end_date = Moment.utc(new Date(job.attributes.finished_at)).utcOffset(-5).format('DD YYYY - hh:mm') 
                        var description = ""
                        var subDescription = ""
                        job.attributes.job_details.map((val,index)=>{
                          if(val.service.type_service == "base"){
                              description += val.service.name
                          }else{
                              subDescription += val.service.name + " X " + val.value
                              subDescription += (job.attributes.job_details.length - 1 == index) ? "" : ", " 
                          }
                      })
                      // var date = Moment(data.started_at).format('MMM DD - hh:mm a')
                      var location = job.attributes.property.data.attributes.name + " "+ job.attributes.property.data.attributes.p_street + ", " + job.attributes.property.data.attributes.s_street +", "+job.attributes.property.data.attributes.city

                    return (
                        <View key={job.id} style={styles.trabajos_item}>
                        
                          <View style={styles.renderRowView}>
                            <View style={styles.listTitleView}>
                              <Text style={styles.titleText}>{job.attributes.job_details[0].service.name || ""}</Text>
                              <Text style={[styles.textFont, {fontSize:26}]}>{"$" + job.attributes.total.toFixed(2)}</Text>
                            </View>
                            {/* <View style={styles.listTitleView}>
                              <Text style={styles.titleText}>{job.attributes.job_details[0].service.name || ""}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <EvilIcons name={"location"} size={16} />
                              <Text style={[styles.textFont, { marginLeft: 5, fontSize: 12, fontWeight:'bold' }]}>{location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name={"md-time"} size={16} />
                              <Text style={{fontSize:14}} numberOfLines={1}>{end_date}</Text>
                            </View>

                            <View style={styles.subtextViewStyle}>
                            {job.attributes.job_details.map((val,index)=>{
                              return(
                                <View style={{borderWidth:1,paddingHorizontal:10,paddingVertical:10,borderWidth:1,borderColor:'lightgray',borderRadius:5,marginRight:5}}>
                                  <Text style={[styles.textFont, { fontSize: 12 }]}>{val.service.name + " X " + val.value}</Text>
                                </View>
                              )
                            })}
                            </View>
                            
                            {/* <Text style={[styles.textFont]}>{description}</Text>
                            <Text style={[styles.textFont]}>{description}</Text> */}
                            {/* <View style={styles.subtextViewStyle}>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.textFont, { fontSize: 12 }]}>{subDescription}</Text>
                              </View> */}
                              {/* <View style={{ flex: 0.2 }}>
                                <Text style={[styles.textFont, { color: 'rgb(0,121,189)', fontSize: 20 }]}>{"$" + job.attributes.total.toFixed(2)}</Text>
                              </View> */}
                            {/* </View> */}
                            
                          </View>
                          {/* <Text style={styles.trabajos_item_title}>{job.attributes.job_details[0].service.name}</Text>
                          <Text style={styles.trabajos_item_date}>
                            {month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getDate() + " de " + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + "Hrs"}
                          </Text>
                          <View style={styles.trabajos_avatars_container}>
                            <Image source={require('../../../../assets/img/profile_avatar1.png')}
                                   style={styles.trabajos_avatar_image}/>
                            <Image source={require('../../../../assets/img/profile_avatar2.png')}
                                   style={styles.trabajos_avatar_image}/>
                          </View>
                          <Text style={styles.trabajos_item_footer}>Mas agentes están en camino</Text> */}
                          <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomerJobDetailScreen",{jobData:job})} >
                            <View style={{borderWidth:1,borderColor:'lightgray',borderRadius:5,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                              <Text>{"Ver Detalles"}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                    );
                  })
                }
              </ScrollView>
            </View>
      </View>
    )
  }

  renderPreviousJobs(){
    return(
      <View>
        <Text style={styles.section_title}>Historial de Trabajos</Text>
            <View style={styles.section_trabajos_container}>
              <ScrollView
                  contentContainerStyle={styles.trabajos_container}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
              >
                {
                  this.state.pastJobs.map((job) => {
                    // const date = new Date(job.attributes.started_at), locale = "es-ES",
                    //     month = date.toLocaleString(locale, {month: "long"});
                      //  var start_date = Moment.utc(new Date(job.attributes.started_at)).utcOffset(-5).format('ddd MMM, DD - hh:mm a YYYY') 
                      const date = new Date(job.attributes.started_at), locale = "es-ES",
                      month = date.toLocaleString(locale, {month: "long"});
                      var end_date = month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getDate() + " de " + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + "Hrs"
                    //  var end_date = Moment.utc(new Date(job.attributes.finished_at)).utcOffset(-5).format('DD YYYY - hh:mm') 
                      var description = ""
                      var subDescription = ""
                      job.attributes.job_details.map((val,index)=>{
                        if(val.service.type_service == "base"){
                            description += val.service.name
                        }else{
                            subDescription += val.service.name + " X " + val.value
                            subDescription += (job.attributes.job_details.length - 1 == index) ? "" : ", " 
                        }
                    })
                    // var date = Moment(data.started_at).format('MMM DD - hh:mm a')
                    var location = job.attributes.property.data.attributes.name + " "+ job.attributes.property.data.attributes.p_street + ", " + job.attributes.property.data.attributes.s_street +", "+job.attributes.property.data.attributes.city

                  return (
                      <View key={job.id} style={styles.trabajos_item}>
                        
                        <View style={styles.renderRowView}>
                            <View style={styles.listTitleView}>
                              <Text style={styles.titleText}>{job.attributes.job_details[0].service.name || ""}</Text>
                              <Text style={[styles.textFont, {fontSize:26 }]}>{"$" + job.attributes.total.toFixed(2)}</Text>
                            </View>
                            {/* <View style={styles.listTitleView}>
                              <Text style={styles.titleText}>{job.attributes.job_details[0].service.name || ""}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <EvilIcons name={"location"} size={16} />
                              <Text style={[styles.textFont, { marginLeft: 5, fontSize: 12, fontWeight:'bold' }]}>{location}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name={"md-time"} size={16} />
                              <Text style={{fontSize:14}} numberOfLines={1}>{end_date}</Text>
                            </View>

                            <View style={styles.subtextViewStyle}>
                            {job.attributes.job_details.map((val,index)=>{
                              return(
                                <View style={{borderWidth:1,paddingHorizontal:10,paddingVertical:10,borderWidth:1,borderColor:'lightgray',borderRadius:5,marginRight:5}}>
                                  <Text style={[styles.textFont, { fontSize: 12 }]}>{val.service.name + " X " + val.value}</Text>
                                </View>
                              )
                            })}
                            </View>
                          </View>
                          {/* <Text style={styles.trabajos_item_title}>{job.attributes.job_details[0].service.name}</Text>
                          <Text style={styles.trabajos_item_date}>
                            {month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getDate() + " de " + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + "Hrs"}
                          </Text>
                          <View style={styles.trabajos_avatars_container}>
                            <Image source={require('../../../../assets/img/profile_avatar1.png')}
                                  style={styles.trabajos_avatar_image}/>
                            <Image source={require('../../../../assets/img/profile_avatar2.png')}
                                  style={styles.trabajos_avatar_image}/>
                          </View>
                          <Text style={styles.trabajos_item_footer}>Mas agentes están en camino</Text> */}
                          <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomerJobDetailScreen",{jobData:job})} >
                            <View style={{borderWidth:1,borderColor:'lightgray',borderRadius:5,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                              <Text>{"Ver Detalles"}</Text>
                            </View>
                          </TouchableOpacity>
                      </View>
                  );
                })
                  //   const date = new Date(job.attributes.started_at), locale = "es-ES",
                  //       month = date.toLocaleString(locale, {month: "long"});
                  //   return (
                  //       <View key={job.id} style={styles.trabajos_item}>
                  //         <Text style={styles.trabajos_item_title}>{job.attributes.job_details[0].service.name}</Text>
                  //         <Text style={styles.trabajos_item_date}>
                  //           {month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getDate() + " de " + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + "Hrs"}
                  //         </Text>
                  //         <View style={styles.trabajos_avatars_container}>
                  //           <Image source={require('../../../../assets/img/profile_avatar3.png')}
                  //                  style={styles.trabajos_avatar_image}/>
                  //         </View>
                  //         <Text style={styles.trabajos_item_footer}>Realizado exitosamente</Text>
                  //       </View>
                  //   );
                  // })
                }
              </ScrollView>
            </View>

      </View>
    )
  }

  noJobview(data = "") {
    return(
      <View style={{alignItems:'center',justifyContent:'center',padding:20}}>
        <Text>{"No "+ data +" Job Available"}</Text>
      </View>
    )
  }

  render() {
    return (
        <View style={styles.container}>
          <Image source={require('../../../../assets/img/dashboard-home.png')} style={styles.banner_image}/>
          <Image source={require('../../../../assets/img/logo_blanco.gif')} style={styles.logo_image}/>
          <ScrollView>
            <Text style={styles.section_title}>Servicios</Text>
            <View style={styles.section_servicios_container}>
              <ScrollView
                  contentContainerStyle={styles.servicios_container}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
              >
                {
                  this.state.servicesTypes.map((serviceType) => {
                    console.log("ServiceJob-->",JSON.stringify(serviceType))
                    return (
                        <View key={serviceType.id} style={styles.servicios_item}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("CustomerCleaning",{serviceType : serviceType})}>
                          <Image source={{uri : serviceType.attributes.image.url}}
                                style={styles.servicios_item_image}
                          />
                          <Text style={styles.servicios_item_description}>{serviceType.attributes.name}</Text>
                          </TouchableOpacity>
                        </View>
                      
                    );
                  })
                }
              </ScrollView>
            </View>

            {(this.state.nextJobs.length > 0) ?  this.renderPastJobs() : this.noJobview()}
            {(this.state.pastJobs.length > 0) ? this.renderPreviousJobs() : this.noJobview("past")}
            
          </ScrollView>
          {/* <View style={styles.footer}>
            <View style={styles.footer_item}>
              <FontAwesome
                  name="home"
                  size={24}
                  color='gray'
              />
              <Text style={styles.footer_item_text}>Home</Text>
            </View>
            <View style={styles.footer_item}>
              <TouchableOpacity
                  style={styles.footer_item}
                  onPress={() => this.props.navigation.navigate('CustomerTrabajosDashboard', {data: this.props.navigation.getParam('data')})}
              >
                <FontAwesome
                    name="briefcase"
                    size={24}
                    color='gray'
                />
                <Text style={styles.footer_item_text}>Trabajos</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.footer_item}
                onPress={() => this.props.navigation.navigate('CustomerProfile', {data: this.props.navigation.getParam('data')})}
            >
              <FontAwesome
                  name="user"
                  size={24}
                  color='gray'
              />
              <Text style={styles.footer_item_text}>Profile</Text>
            </TouchableOpacity>
          </View> */}
        </View>
    );
  }
}
