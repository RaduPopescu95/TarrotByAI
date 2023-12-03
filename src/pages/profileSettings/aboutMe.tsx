import React, {useEffect, useState} from 'react';
import {TextInput, View, TouchableOpacity, StyleSheet} from 'react-native';

import * as Yup from 'yup';
import {Formik, useFormikContext} from 'formik';

import {CardSurface} from '../../components/commonViews';
import {labels} from '../../utils/labels';
import {
  H30fontRegularLightBlack2,
  H14fontRegularWhite,
  H8fontMediumBlack,
  H8fontMediumLightBlack,
} from '../../components/commonText';
import {colors} from '../../utils/colors';
import {pl10, pl15} from '../../common/commonStyles';
import {Text} from 'react-native-paper';
import i18n from '../../../i18n';

interface Props {
  dataInfoAboutMe?: any;
  handleAddSubmit?: any;
  title?: any;
}

interface MyFormValues {
  biography: string;
}

const AboutMe: React.FC<Props> = ({
  handleAddSubmit,
  dataInfoAboutMe,
  title,
}): JSX.Element => {
  const [dataInfoAbout, setDataInfoAbout] = useState(dataInfoAboutMe);

  const validationSchema = Yup.object().shape({
    biography: Yup.string()
      .min(10, i18n.translate("bioMinim"))
      .max(500, i18n.translate("bioMaxim"))
      .label('biography'),
  });

  const initialValues: MyFormValues = {
    biography: dataInfoAbout.aboutClinicData ? dataInfoAbout.aboutClinicData.biography : '',
  };

  useEffect(() => {
    console.log('dataInfoAbout..............', dataInfoAbout.aboutClinicData.biography);
  }, []);

  return (
    <CardSurface style={styles.container}>
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
              <H8fontMediumBlack>{title}</H8fontMediumBlack>
              <H30fontRegularLightBlack2 style={styles.msgStyle}>
                {i18n.translate("biography")}
              </H30fontRegularLightBlack2>
              {errors.biography && (
                <Text style={{fontSize: 13, color: 'red', marginTop: 5}}>
                  {errors.biography}
                </Text>
              )}
              <View style={styles.textBoxContainerStyle}>
                <TextInput
                  // placeholder={i18n.translate("withing700C")}
                  style={[pl15, {fontSize: 11, paddingTop: 5}]}
                  onChangeText={handleChange('biography')}
                  onBlur={handleBlur('biography')}
                  multiline={true}
                  value={values.biography}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.nextButtonStyle}
              onPress={handleSubmit}>
              <H14fontRegularWhite>{i18n.translate("next")}</H14fontRegularWhite>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </CardSurface>
  );
};
export default AboutMe;
const styles = StyleSheet.create({
  nextButtonStyle: {
    height: 45,
    backgroundColor: colors.primary2,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textBoxContainerStyle: {
    height: 350,
    borderColor: colors.borderTextColor,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  msgStyle: {
    marginTop: 30,
  },
  bodyStyle: {paddingHorizontal: 10, paddingTop: 10},
  container: {marginHorizontal: 10},
});
