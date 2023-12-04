import React from 'react';
import {TextInput, View, TouchableOpacity, StyleSheet} from 'react-native';

import * as Yup from 'yup';
import {Formik, useFormikContext} from 'formik';

import {CardSurface, CommonInput} from '../../components/commonViews';
import {labels} from '../../utils/labels';
import {
  H14fontRegularWhite,
  H30fontRegularLightBlack2,
  H8fontMediumBlack,
} from '../../components/commonText';
import {mt15, mt20, pl10} from '../../common/commonStyles';
import i18n from '../../../i18n';
import { colors } from '../../utils/colors';

interface Props {
  dataInfoContactDetails?: any;
  handleAddSubmit?: any;
}

interface MyFormValues {
  addressone: string;
  addresstwo: string;
  city: string;
  stateprovince: string;
  country: string;
  postalcode: string;
}

const ContactDetails: React.FC<Props> = ({
  handleAddSubmit,
  dataInfoContactDetails,
}): JSX.Element => {
  // const validationSchema = Yup.object().shape({
  //   biography: Yup.string()
  //     .min(10, 'Biography has to have at least 10 characters')
  //     .max(500, 'Biography has to have a maximum of 700 characters')
  //     .label('biography'),
  // });

  const initialValues: MyFormValues = {
    addressone: dataInfoContactDetails.addressone
      ? dataInfoContactDetails.addressone
      : '',
    addresstwo: dataInfoContactDetails.addresstwo
      ? dataInfoContactDetails.addresstwo
      : '',
    city: dataInfoContactDetails.city ? dataInfoContactDetails.city : '',
    stateprovince: dataInfoContactDetails.stateprovince
      ? dataInfoContactDetails.stateprovince
      : '',
    country: dataInfoContactDetails.country
      ? dataInfoContactDetails.country
      : '',
    postalcode: dataInfoContactDetails.postalcode
      ? dataInfoContactDetails.postalcode
      : '',
  };

  const textBoxView = (
    label: string,
    labelName: any,
    valueData: any,
    handleChangeFormik: any,
    handleBlurFormik: any,
  ) => {
    return (
      <>
        <H30fontRegularLightBlack2 style={mt15}>
          {label}
        </H30fontRegularLightBlack2>
        <CommonInput style={{height: 35}}>
          <TextInput
            style={pl10}
            name={labelName}
            value={valueData}
            onChangeText={handleChangeFormik}
            onBlur={handleBlurFormik}
          />
        </CommonInput>
      </>
    );
  };

  return (
    <CardSurface style={styles.container}>
      <Formik
        // validationSchema={validationSchema}
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
              <H8fontMediumBlack>{i18n.translate("contactDetails")}</H8fontMediumBlack>
              {textBoxView(
                i18n.translate("addressLine1"),
                'addressone',
                values.addressone,
                handleChange('addressone'),
                handleBlur('addressone'),
                // errors.addressone,
              )}
              {textBoxView(
                i18n.translate("addressLine2"),
                'addresstwo',
                values.addresstwo,
                handleChange('addresstwo'),
                handleBlur('addresstwo'),
              )}
              {textBoxView(
                i18n.translate("city"),
                'city',
                values.city,
                handleChange('city'),
                handleBlur('city'),
              )}
              {textBoxView(
                i18n.translate("state"),
                'stateprovince',
                values.stateprovince,
                handleChange('stateprovince'),
                handleBlur('stateprovince'),
              )}
              {textBoxView(
                i18n.translate("country"),
                'country',
                values.country,
                handleChange('country'),
                handleBlur('country'),
              )}
              {textBoxView(
                i18n.translate("postalCode"),
                'postalcode',
                values.postalcode,
                handleChange('postalcode'),
                handleBlur('postalcode'),
              )}
            </View>
            <TouchableOpacity
              style={styles.nextButtonStyle}
              onPress={handleSubmit}
              title="Submit">
              <H14fontRegularWhite>{i18n.translate("finishProfile")}</H14fontRegularWhite>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </CardSurface>
  );
};
export default ContactDetails;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 15, marginHorizontal: 10},
  bodyStyle: {paddingHorizontal: 5, paddingTop: 10},
  nextButtonStyle: {
    height: 45,
    backgroundColor: colors.primary2,
    marginVertical: 10,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 25,
  },
});
