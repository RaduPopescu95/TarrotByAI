import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {CardSurface, CommonInput, RowView} from '../../components/commonViews';
import {labels} from '../../utils/labels';
import {
  H30fontRegularLightBlack2,
  H14fontRegularWhite,
  H30fontRegularLightRed,
  H8fontMediumLightBlack,
} from '../../components/commonText';
import {Dropdown} from 'react-native-element-dropdown';

import * as ImagePicker from 'expo-image-picker';
// import {DevWidth} from '../../utils/device';
import {Dimensions} from 'react-native';

import * as Yup from 'yup';
import {Formik, useFormikContext} from 'formik';

import {data} from '../../utils/constant';
import {
  flexRow,
  p10,
  p5,
  pb10,
  pl10,
  pl20,
  pl5,
} from '../../common/commonStyles';
import Doctor2 from '../../../assets/images/blank-profile.svg';
import PlaceholderIcon from '../../../assets/images/placeholder-small.svg';
import CalendarIcon from '../../../assets/images/icon-metro-calendar-big.svg';
import {Button, Text} from 'react-native-paper';
import i18n from '../../../i18n';
import { ICountry, PhoneInput, getCountryByCca2 } from 'react-native-international-phone-number';
import ServiceList from '../../components/ServicesList';
import { colors } from '../../utils/colors';

interface Props {
  dataInfo?: any;
  handleAddSubmit?: any;
  setPatientImage?:any
  patientImage?:any;
  isAddAppointment?:any
  guestDetails?:any
  isGuest:boolean;
  servicesList?:any
}

interface MyFormValues {
  // email: string;
  firstName: string;
  lastName: string;
  country: string;
  town: string;
  state: string;
  phoneNumber: string;
  gender: string;
  age: number;
  selectedCountryPhoneNumber?:any;
  servicesList

}

const BasicInfoPatient: React.FC<Props> = ({
  dataInfo,
  handleAddSubmit,
  setPatientImage,
  patientImage,
  isAddAppointment,
  isGuest,
  servicesList

}): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>();
  const [dataInfoBasic, setDataInfoBasic] = useState(dataInfo);
  const [selectedCountryPhoneNumber, setSelectedCountryPhoneNumber] = useState<
  undefined | ICountry
  >( getCountryByCca2('RO'));
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedServicesError, setSelectedServicesError] = useState(false);

  const handleSelectedServices = (service) => {
    console.log("service-----");
    console.log(service);
    console.log(selectedServices);
  
    setSelectedServices((prevServices) => {
      if (prevServices.includes(service)) {
        console.log("remove...");
        return prevServices.filter((element) => element !== service);
      } else {
        console.log("add...");
        console.log(prevServices);
        return [...prevServices, service];
      }
    });
  };

  const handleCheckSubmit = (values) => {
    if(selectedServices.length === 0){
      setSelectedServicesError(true)
      Alert.alert(i18n.translate("selectAtLeastOneService"), '', [
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel',
        // },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }else {
      setSelectedServicesError(false)
      handleAddSubmit(values, selectedServices)
    }
  }
  


function handleSelectedCountry(country: ICountry) {
  setSelectedCountryPhoneNumber(country);
}

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(i18n.translate("firstNameIsRequired"))
      .min(1)
      .max(10000)
      .label('firstName'),
    lastName: Yup.string()
      .required(i18n.translate("lastNameIsRequired"))
      .min(1)
      .max(10000)
      .label('firstName'),
    gender: Yup.string().required(i18n.translate("genderIsRequired")).label('gender'),
 
    //   .required('Phone number is a required field')
    //   .matches(phoneRegExp, 'Phone number is not valid'),
  });

  const validationSchemaCreateAppointment = Yup.object().shape({
    firstName: Yup.string()
      .required(i18n.translate("firstNameIsRequired"))
      .min(1)
      .max(10000)
      .label('firstName'),
    lastName: Yup.string()
      .required(i18n.translate("lastNameIsRequired"))
      .min(1)
      .max(10000)
      .label('firstName'),
    gender: Yup.string().required(i18n.translate("genderIsRequired")).label('gender'),
    // phoneNumber: Yup.string().required("Phone number is required").matches(phoneRegExp, 'Phone number is not valid')
    phoneNumber: Yup.string().required(i18n.translate("phoneNumberIsRequired")).label('phoneNumber'),
    //   .required('Phone number is a required field')
    //   .matches(phoneRegExp, 'Phone number is not valid'),
  });

  useEffect(() => {
    console.log("test selected")
    console.log(selectedServices)
    // console.log(selectedCountryPhoneNumber)
  })

  const initialValues: MyFormValues = {
    selectedCountryPhoneNumber:selectedCountryPhoneNumber,
    phoneNumber: dataInfoBasic
    ? dataInfoBasic.phoneNumber
      ? dataInfoBasic.phoneNumber
      : ''
    : '',
    firstName: dataInfoBasic
      ? dataInfoBasic.firstName
        ? dataInfoBasic.firstName
        : ''
      : '',
    lastName: dataInfoBasic
      ? dataInfoBasic.lastName
        ? dataInfoBasic.lastName
        : ''
      : '',
    country: dataInfoBasic
      ? dataInfoBasic.country
        ? dataInfoBasic.country
        : ''
      : '',
    town: dataInfoBasic ? (dataInfoBasic.town ? dataInfoBasic.town : '') : '',
    state: dataInfoBasic
      ? dataInfoBasic.state
        ? dataInfoBasic.state
        : ''
      : '',
    gender: dataInfoBasic
      ? dataInfoBasic.gender
        ? dataInfoBasic.gender
        : ''
      : '',
    age: dataInfoBasic ? (dataInfoBasic.age ? dataInfoBasic.age : '') : '',
    
  };

  const cameraOpt = () => {
    launchCamera();
  };
  const launchCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
    });

    console.log(result);
    let image = {}
 
    image =  result.uri
    console.log(image)
    setSelectedImage(image);
    setPatientImage(image)
      // setClinicImages(images);
    
  };

  const textBoxStyle = (
    label: string,
    labelName: any,
    valueData: any,
    handleChangeFormik: any,
    handleBlurFormik: any,
    error?: any,
    isNeeded?: boolean,
    isAge?: boolean,
    isPhoneNumber?:boolean,

  ) => {
    return (
      <View style={pb10}>
        <View style={[flexRow]}>
          <H30fontRegularLightBlack2>{label} </H30fontRegularLightBlack2>
          {isNeeded && <H30fontRegularLightRed>{'*'}</H30fontRegularLightRed>}
        </View>

        <CommonInput style={{marginTop: 0, height: 35}}>
          {isAge ? (
            <TextInput
              style={pl10}
              name={labelName}
              value={valueData}
              onChangeText={handleChangeFormik}
              onBlur={handleBlurFormik}
              keyboardType="numeric"
            />
          ) 
       
          :
          (
            <TextInput
              style={pl10}
              name={labelName}
              value={valueData}
              onChangeText={handleChangeFormik}
              onBlur={handleBlurFormik}
            />
          )}
          {error && (
            <Text style={{fontSize: 13, color: 'red', marginTop: 5}}>
              {error}
            </Text>
          )}
        </CommonInput>
      </View>
    );
  };

  return (
    <CardSurface style={styles.containerStyle}>
      
      <Formik
        validationSchema={isAddAppointment ? validationSchemaCreateAppointment : validationSchema}
        initialValues={initialValues}
        onSubmit={values => handleCheckSubmit(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          isSubmitting,
          isValid,
          touched,
        }) => 
        
     {   

      return(
          <>
            <View style={styles.bodyStyle}>
              <H8fontMediumLightBlack>
                {i18n.translate("basicInformation")}
              </H8fontMediumLightBlack>
              { !isAddAppointment && 

                <View style={styles.bodyContainerStyle}>
                <View style={styles.profileImageStyle}>
                {patientImage && !selectedImage ?
                
                <Image style={{height: '100%', width: '100%'}}  source={{uri: patientImage}}/>
                :
                selectedImage ?
                  <Image style={{height: '100%', width: '100%'}}  source={{uri: selectedImage}}/>
                  :
                  <Doctor2 height={'100%'} width={'100%'} />
                  }
                </View>
                <TouchableOpacity
                  onPress={() => {
                    cameraOpt();
                  }}
                  style={styles.profileImage}>
                  <PlaceholderIcon height={13} width={13} />
                </TouchableOpacity>
              </View>
                  }
              {/* {textBoxStyle(labels.username, 'username', value={values.user})} */}
              {/* {textBoxStyle(
                labels.email,
                'email',
                values.email,
                handleChange('email'),
                handleBlur('email'),
                errors.email,
              )} */}

              {textBoxStyle(
                i18n.translate("firstName"),
                'firstName',
                values.firstName,
                handleChange('firstName'),
                handleBlur('firstName'),
                errors.firstName,
                true,
              )}

          
              {textBoxStyle(
                i18n.translate("lastName"),
                'lastName',
                values.lastName,
                handleChange('lastName'),
                handleBlur('lastName'),
                errors.lastName,
                true,
              )}

              { isAddAppointment
                  &&
     
                <>

                    <View style={[flexRow]}>
                      <H30fontRegularLightBlack2>{i18n.translate("phoneNumber")}</H30fontRegularLightBlack2>
                      {true && <H30fontRegularLightRed style={{marginLeft:3}}>{'*'}</H30fontRegularLightRed>}
                    </View>
                  <PhoneInput

                  value={values.phoneNumber}
                  onChangePhoneNumber={handleChange}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  selectedCountry={selectedCountryPhoneNumber}
                  onChangeSelectedCountry={handleSelectedCountry}
                  placeholder={''}
                  placeholderTextColor='white'
                  containerStyle={{
                    height: 40,
                    borderColor: '#CFCFCF',
                    borderRadius: 5,
                    borderWidth: 1,
                    // marginTop: 5,
                    marginBottom: errors.phoneNumber ? 0 : 10,
                  }}
                  />
      
                  {errors.phoneNumber && (
                    <Text style={{fontSize: 13, color: 'red'}}>
                      {errors.phoneNumber}
                    </Text>
                  )}

                </>
  
                }
              {textBoxStyle(
                i18n.translate("country"),
                'country',
                values.country,
                handleChange('country'),
                handleBlur('country'),
              )}

              {textBoxStyle(
                i18n.translate("town"),
                'town',
                values.town,
                handleChange('town'),
                handleBlur('town'),
              )}

              {textBoxStyle(
                i18n.translate("state"),
                'state',
                values.state,
                handleChange('state'),
                handleBlur('state'),
              )}

              {textBoxStyle(
                i18n.translate("age"),
                'age',
                values.age,
                handleChange('age'),
                handleBlur('age'),
                false,
                false,
                true,
              )}

              {/* {textBoxStyle(
                labels.phoneNo,
                'phonenumber',
                values.phonenumber,
                handleChange('phonenumber'),
                handleBlur('phonenumber'),
                errors.phonenumber,
              )} */}

              {/* SELECT FUNCTIONS */}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <H30fontRegularLightBlack2>
                      {i18n.translate("gender")}
                    </H30fontRegularLightBlack2>
                    <H30fontRegularLightRed>{' *'}</H30fontRegularLightRed>
                  </View>
                  <View style={styles.dropDownStyle}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {backgroundColor: '#FFF'},
                      ]}
                  
                      iconStyle={styles.iconStyle}
                      data={data}
                      labelField="label"
                      placeholder={dataInfoBasic && dataInfoBasic.gender}
                      placeholderStyle={{fontSize: 13}}
                      valueField="value"
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      // name={"gender"}
                      onChange={item => {
                        console.log(item.label);
                        setValue(item.value);
                        setFieldValue('gender', item.label);
                        setIsFocus(false);
                        console.log('item label', item.label);
                        handleChange(item.label);
                      }}
                      value={value}
                    />
                    {errors.gender && (
                      <Text style={{fontSize: 13, color: 'red', marginTop: 5}}>
                        {errors.gender}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <H30fontRegularLightBlack2>
                      {i18n.translate("services")}
                    </H30fontRegularLightBlack2>
                    <H30fontRegularLightRed>{' *'}</H30fontRegularLightRed>
                  </View>
                    {selectedServices.length === 0 && (
                      <Text style={{fontSize: 13, color: selectedServicesError ? colors.red :  colors.black}}>
                        {i18n.translate("selectAtLeastOneService")}
                      </Text>
                    )}
                  <ServiceList servicesList={servicesList} isSelect={true} setSelectedServices={(service) => handleSelectedServices(service)} selectedServices={selectedServices}/>
       
                </View>

          
                {/* <View>
                  <H30fontRegularLightBlack2 style={pl20}>
                    {labels.fromBasic}
                  </H30fontRegularLightBlack2>
                  <View style={styles.fromStyle}>
                    <View style={{padding: 7, alignItems: 'flex-end'}}>
                      <CalendarIcon height={18} width={16} />
                    </View>
                  </View>
                </View> */}
              </View>
            </View>
            <TouchableOpacity
              style={styles.nextButtonStyle}
              onPress={handleSubmit}
              title="Submit">
                {
                  isGuest
                  ?
                  <H14fontRegularWhite>{i18n.translate("completeAppointment")}</H14fontRegularWhite>
                :isAddAppointment
                ?
              <H14fontRegularWhite>{i18n.translate("addAppointment")}</H14fontRegularWhite>
              :
               
              <H14fontRegularWhite>{i18n.translate("saveProfile")}</H14fontRegularWhite>
               }
            </TouchableOpacity>
          </>
        )}
        }
      </Formik>
    </CardSurface>
  );
};
export default BasicInfoPatient;
const styles = StyleSheet.create({
  dropdown: {
    paddingLeft: 10,
    backgroundColor: '#FFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {marginHorizontal: 10},
  bodyStyle: {paddingHorizontal: 10, paddingTop: 10},
  bodyContainerStyle: {
    borderRadius: 50,
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  profileImageUploadStyle: {borderRadius: 50, width: 100, height: 100},
  profileImage: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  profileImageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#f7f7f7',
    overflow: 'hidden',
  },
  dropDownStyle: {
    width: Dimensions.get('window').width / 2.7,
    borderColor: '#CFCFCF',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#CFCFCF',
  },
  fromStyle: {
    height: 35,
    width: Dimensions.get('window').width / 2.8,
    borderColor: '#CFCFCF',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 20,
  },
  calenderIconStyle: {height: 18, width: 16},
  nextButtonStyle: {
    height: 45,
    backgroundColor: colors.primary2,
    marginVertical: 5,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
