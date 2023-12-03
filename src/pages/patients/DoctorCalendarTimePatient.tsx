import React, { Fragment, useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { GeneralProps } from "../../interfaces/generalProps";
import { Route } from "@react-navigation/native";
import { NavBar, NavBarPatient } from "../../common/commonComponents";
import { MainContainer, SubContainer } from "../../components/commonViews";
import {
  H14fontRegularWhite,
  H8fontMediumBlack,
} from "../../components/commonText";
import TimeAndDate from "./../timeAndDate";
import Checkout from "./../checkout";
import Payment from "./../payment";
import { screenName } from "../../utils/screenName";
import { tab } from "../../utils/constant";
import { p0, ph1, ph10, pt0, pt10 } from "../../common/commonStyles";
import { colors } from "../../utils/colors";
import TimeAndDateClinic from "./../timeAndDateClinic";
import TimeAndDatePatient from "./../timeAndDatePatient";
import { handleCreateCalendarForPatient } from "../../utils/createDatesClinic";
import { useSelector } from "react-redux";
import { Text } from "react-native-paper";
import i18n from "../../../i18n";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const DoctorCalendarTimePatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const patientInfoDB = useSelector((state) => state.patientInfoData);
  const { patientInformation } = patientInfoDB;

  const [selectedtab, setSelectedTab] = useState("Time and Date");
  const [datesForPatient, setDatesForPatient] = useState([]);
  const DoctorBookableInfo = route.params;
  let dates;

  useEffect(() => {
    // console.log('DoctorBookableInfo.item.allDays...', DoctorBookableInfo.item.allDays);
    console.log(
      "DoctorBookableInfo.item.clinicInfo.owner_uid...",
      DoctorBookableInfo
    );
    if (DoctorBookableInfo.item.clinicAppointments === undefined) {
      DoctorBookableInfo.item.clinicAppointments = [];
    }

    dates = handleCreateCalendarForPatient(
      DoctorBookableInfo.item.allDays,
      DoctorBookableInfo.item.clinicAppointments,
      DoctorBookableInfo.item.clinicAppointmentsUnregistered
    );

    console.log("dates...");
    console.log(dates);
    setDatesForPatient(dates);
  }, []);

  return (
    <Fragment>
      <MainContainer>
        <ScrollView>
          <NavBarPatient
            title={i18n.translate("appointmentCalendar")}
            isPatient={patientInformation.isPatient}
            isTermsAccepted={true}
          />
          <SubContainer
            style={[p0, ph1, { backgroundColor: colors.background }]}
          >
            <TimeAndDatePatient
              clinicInfoChecked={datesForPatient}
              allDaysForPatiet={DoctorBookableInfo.item.allDays}
              AllDoctorInfo={DoctorBookableInfo}
              clinicApprovedAppointments={
                DoctorBookableInfo.item.clinicAppointments
              }
              clinicApprovedAppointmentsUnregistered={
                DoctorBookableInfo.item.clinicAppointmentsUnregistered
              }
            />
          </SubContainer>
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};

export default DoctorCalendarTimePatient;

const styles = StyleSheet.create({
  tabButtonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,

    borderRadius: 20,
    marginRight: 10,
  },
  footerButtonStyle: {
    marginTop: 15,
    bottom: 10,
    height: 45,
    backgroundColor: "#1B5A90",
    marginHorizontal: 12,
    borderRadius: 30,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
