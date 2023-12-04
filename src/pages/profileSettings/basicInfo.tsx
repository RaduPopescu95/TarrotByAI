import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {CardSurface, CommonInput, RowView} from '../../components/commonViews';
import {labels} from '../../utils/labels';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  H30fontRegularLightBlack2,
  H14fontRegularWhite,
  H30fontRegularLightRed,
  H8fontMediumLightBlack,
} from '../../components/commonText';
import * as ImagePicker from 'expo-image-picker';
import {Dropdown} from 'react-native-element-dropdown';


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


import {Button, Text} from 'react-native-paper';
import i18n from '../../../i18n';
import { colors } from '../../utils/colors';
import { FlatList } from 'react-native';
import ServiceList from '../../components/ServicesList';

interface Props {
  dataInfo?: any;
  handleAddSubmit?: any;
  setDoctorImage?:any
  doctorImage?:any
}

interface MyFormValues {
  // email: string;
  firstname: string;
  lastname: string;
  services: string;
  specializations: string;
  servicesList: any,
  setServicesList: any
  // phonenumber: string;
  // gender: string;
}

const BasicInfo: React.FC<Props> = ({
  dataInfo,
  handleAddSubmit,
  setDoctorImage,
  doctorImage,
  servicesList,
  setServicesList
}): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('Male');
  const [selectedImage, setSelectedImage] = useState<any>(doctorImage ? doctorImage : "");
  const [dataInfoBasic, setDataInfoBasic] = useState(dataInfo);
  const [inputText, setInputText] = useState('');


  const NUM_COLUMNS = 3; // You can change the number of columns as desired
  const windowWidth = Dimensions.get('window').width;
  const itemWidth = windowWidth / NUM_COLUMNS;

  const handleAddService = () => {
    if (inputText.trim() !== '') {
      setServicesList([...servicesList, inputText]);
      setInputText('');
    }
  };

  const handleServiceRemoval = (service) => {
    const updatedList = servicesList.filter((item) => item !== service);
    setServicesList(updatedList);
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('First name is a required field')
      .min(1)
      .max(10000)
      .label('firstname'),
    lastname: Yup.string()
      .required('Last name is a required field')
      .min(1)
      .max(10000)
      .label('firstname'),
    // services: Yup.string()
    //   .required('Services is a required field')
    //   .min(1)
    //   .max(10000)
    //   .label('services'),
    specializations: Yup.string()
      .required('specializations is a required field')
      .min(1)
      .max(10000)
      .label('specializations'),
    // phonenumber: Yup.string()
    //   .required('Phone number is a required field')
    //   .matches(phoneRegExp, 'Phone number is not valid'),
  });

  const initialValues: MyFormValues = {
    firstname: dataInfoBasic.firstname ? dataInfoBasic.firstname : '',
    lastname: dataInfoBasic.lastname ? dataInfoBasic.lastname : '',
    // services: dataInfoBasic.services ? dataInfoBasic.services : '',
    specializations: dataInfoBasic.specializations
      ? dataInfoBasic.specializations
      : '',
    // phonenumber: '',
    // gender: '',
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
    setDoctorImage(image)
      // setClinicImages(images);
    
  };

  useEffect(() => {
    console.log(dataInfoBasic)
  },[])

  const textBoxStyle = (
    label: string,
    labelName: any,
    valueData: any,
    handleChangeFormik: any,
    handleBlurFormik: any,
    error:any,
    isList?:any
  ) => {
    return (
      <View style={pb10}>
        <View style={[flexRow]}>
          <H30fontRegularLightBlack2>{label} </H30fontRegularLightBlack2>
          <H30fontRegularLightRed>{'*'}</H30fontRegularLightRed>
        </View>

        <CommonInput style={{marginTop: 0, height: 35}}>
        {
        isList 
        
        ?
        <>
        <TextInput
        style={pl10}
        name={labelName}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />
      {inputText.trim() !== '' && (
        <TouchableOpacity style={{position:"absolute", right:10}} onPress={handleAddService}>
          <Ionicons name="add-circle" size={32} color={colors.primary2} />
        </TouchableOpacity>
      )}

          {servicesList.length === 0 && (
            <Text style={{fontSize: 13, color: 'red', marginTop: 5}}>
              {i18n.translate("atleastOneService")}
            </Text>
          )}
     
      </>
      :
      <TextInput
      style={pl10}
      name={labelName}
      value={valueData}
      onChangeText={handleChangeFormik}
      onBlur={handleBlurFormik}
    />
    

      }
        
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
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={values => handleAddSubmit(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <>
            <View style={styles.bodyStyle}>
              <H8fontMediumLightBlack>
                {i18n.translate("basicInformation")}
              </H8fontMediumLightBlack>
              <View style={styles.bodyContainerStyle}>
                <View style={styles.profileImageStyle}>
                  {selectedImage ?
                  <Image style={{height:"100%", width:"100%"}}  source={{uri: selectedImage}}/>
                  :
                  
               
            
                  <Image
                  style={{height:100, width:100}}
                  source={require('../../images/professionals.png')}
                />
                  }
                </View>
                <TouchableOpacity
                  onPress={() => {
                    cameraOpt();
                  }}
                  style={{ width: 30, height: 30,      backgroundColor: 'white',
                    position: 'absolute',
                    right: -10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 20, }}
                 
                  >
              
                
                      <Ionicons name="add-circle" size={29} color={colors.primary2} />
                </TouchableOpacity>
              </View>
          

              {textBoxStyle(
                i18n.translate("firstName"),
                'firstname',
                values.firstname,
                handleChange('firstname'),
                handleBlur('firstname'),
                errors.firstname,
              )}

              {textBoxStyle(
                i18n.translate("lastName"),
                'lastname',
                values.lastname,
                handleChange('lastname'),
                handleBlur('lastname'),
                errors.lastname,
              )}
              {textBoxStyle(
                i18n.translate("specializations"),
                'specializations',
                values.specializations,
                handleChange('specializations'),
                handleBlur('specializations'),
                errors.specializations,
              )}
              {textBoxStyle(
                i18n.translate("services"),
                'services',
                values.services,
                handleChange('services'),
                handleBlur('services'),
                errors.services,
                true //is a list
              )}
                   {/* <FlatList
                    data={servicesList}
                    renderItem={({item}) => <RenderServiceItem handleServiceRemoval={handleServiceRemoval} item={item}/>}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}

                  /> */}
                  <ServiceList servicesList={servicesList} handleServiceRemoval={handleServiceRemoval}/>
            </View>
            <TouchableOpacity
              style={styles.nextButtonStyle}
              onPress={handleSubmit}
              title="Submit">
              <H14fontRegularWhite>{i18n.translate("next")}</H14fontRegularWhite>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </CardSurface>
  );
};
export default BasicInfo;
const styles = StyleSheet.create({
  dropdown: {
    // height: 38,
    // paddingTop: 20,
    paddingLeft: 10,
    // paddingRight: 5,
    backgroundColor: '#FFF',
  },
  listContainer: {
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Wrap items to the next line
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
    justifyContent:"center",
    alignItems:"center"
  },
  dropDownStyle: {
    // height: 40,
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
    marginVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
