import React, { Fragment, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { GeneralProps } from "../interfaces/generalProps";
import { Route, useRoute } from "@react-navigation/native";
import { labels } from "../utils/labels";
import { screenName } from "../utils/screenName";
import { FontAwesome } from "@expo/vector-icons";
import {
  H23fontRegularGray,
  H16fontRegularGray,
  H16fontRegularYellow,
  H14fontRegularWhite,
  H14fontRegularBlack,
} from "../components/commonText";
import { colors } from "../utils/colors";
import { flexRow, justyfyCenter, p15 } from "../common/commonStyles";
import CheckIcon from "../../assets/images/check-circle-big.svg";
import LeftArrowIcon from "../../assets/images/left-arrow-big.svg";
import { getPatientAppointments } from "../actions/patientActions";
import { useDispatch } from "react-redux";
import { Text } from "react-native-paper";
import i18n from "../../i18n";
import {
  createEndTimeFormat,
  createStartTimeFormat,
  createTimeFormat,
} from "../utils/convertTime24Hours";
import { useHourClockContext } from "../context/HourClockContext";

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const BookingSuccess: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const hourClock = useHourClockContext();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(route.params);
  }, []);
  return (
    <Fragment>
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={p15}>
          <LeftArrowIcon height={24} width={24} />
        </TouchableOpacity> */}
        <View style={styles.successImageContainer}>
          <FontAwesome name="calendar-check-o" size={94} color="white" />
        </View>
        <View style={styles.bodyContainer}>
          <View style={[styles.borderStyle, { width: "100%" }]}>
            <H23fontRegularGray>{i18n.translate("booked")}</H23fontRegularGray>
            <H23fontRegularGray>{i18n.translate("success")}</H23fontRegularGray>
            <H16fontRegularGray>
              {i18n.translate("bookedWith")}
            </H16fontRegularGray>
            <View style={[flexRow, { width: "95%" }]}>
              <View
                style={{
                  width: "100%",

                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <H16fontRegularYellow>
                  {"dr. "}
                  {route.params.basicInfo.firstname}{" "}
                  {route.params.basicInfo.lastname}
                </H16fontRegularYellow>
                <H16fontRegularGray>{" on "}</H16fontRegularGray>
                <H16fontRegularYellow>
                  {route.params.daySelected}
                </H16fontRegularYellow>
              </View>
            </View>
            <H16fontRegularYellow style={{}}>
              {`${createTimeFormat(
                route.params.timeScheduled.starttime,
                hourClock
              )} to ${createTimeFormat(
                route.params.timeScheduled.endtime,
                hourClock
              )}`}
            </H16fontRegularYellow>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            // dispatch(getPatientAppointments()).then(() =>{

            // })
            navigation.navigate(screenName.myProfilePatient);
          }}
          style={styles.buttonStyle}
        >
          <Text style={{ color: "white" }}>
            {i18n.translate("checkAppointments")}
          </Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
};
export default BookingSuccess;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    flex: 1,
  },
  backImageStyle: {
    height: 25,
    width: 25,
  },
  successImageContainer: {
    alignSelf: "center",
    paddingTop: 80,
  },
  imageStyle: {
    height: 150,
    width: 150,
  },
  bodyContainer: {
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  borderStyle: {
    height: 220,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "dashed",
    borderColor: "white",
    padding: 10,
    justifyContent: "space-evenly",
  },
  buttonStyle: {
    height: 45,
    backgroundColor: "#28282B",
    marginTop: 40,
    marginHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: colors.white,
  },
});
