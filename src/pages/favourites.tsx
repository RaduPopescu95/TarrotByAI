import React, {Fragment, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {NavBarPatient} from '../common/commonComponents';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/AntDesign';
import {
  CardSurface,
  CommonLineDotted,
  MainContainer,
  RowView,
  SubContainer,
} from '../components/commonViews';
import {
  H9fontMediumBlack,
  H8fontRegularWhite,
  H15fontMediumBlack,
  H14fontRegularBlackk,
  H14fontRegularBlack,
  H14fontRegularBlue,
} from '../components/commonText';
import {screenName} from '../utils/screenName';
import {_testDoctorDetails} from '../utils/mockDetails';
import DoctorDetailsCard from '../components/doctorComponents';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const FavouritesScreen: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [doctorDetails, setDoctorDetails] = useState(_testDoctorDetails);

  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient title={'Favourites'} />
        <ScrollView style={{paddingLeft: 10, marginVertical: 10}}>
          {doctorDetails.length > 0
            ? doctorDetails.map((item, index) => {
                return (
                  <DoctorDetailsCard
                    details={item}
                    bookAnAppointment={() => {
                      navigation.navigate(screenName.BookAppointment);
                    }}
                    drProfileNavigation={() => {
                      navigation.navigate(screenName.DoctorProfile);
                    }}
                  />
                );
              })
            : null}
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};
export default FavouritesScreen;
