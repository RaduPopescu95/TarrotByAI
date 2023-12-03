import { DOCTOR_APPROVED_APPOINTMENTS_FAIL, DOCTOR_APPROVED_APPOINTMENTS_REQUEST, DOCTOR_APPROVED_APP_SUCCESS } from "../constants/doctorConstants";
import { retrieveApprovedDoctorAppointments } from "../utils/getFirebaseData";

export const getDoctorApprovedAppointments = (doctorId, doctorTimes, allDays) => async dispatch => {

    try {
      dispatch({type: DOCTOR_APPROVED_APPOINTMENTS_REQUEST});
  
      const doctorApprovedAppointments =
        await retrieveApprovedDoctorAppointments(doctorId, doctorTimes, allDays);
   
      dispatch({
        type: DOCTOR_APPROVED_APP_SUCCESS,
        payload: doctorApprovedAppointments,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_APPROVED_APPOINTMENTS_FAIL,
        payload: error,
      });
    }
  };