import {
  PATIENT_INFO_REQUEST,
  PATIENT_INFO_SUCCESS,
  PATIENT_INFO_FAIL,
  PATIENT_TIMESLOTS_REQUEST,
  PATIENT_TIMESLOTS_SUCCESS,
  PATIENT_TIMESLOTS_FAIL,
  PATIENT_CALENDAR_REQUEST,
  PATIENT_CALENDAR_SUCCESS,
  PATIENT_CALENDAR_FAIL,
  PATIENT_APPOINTMENTS_REQUEST,
  PATIENT_APPOINTMENTS_SUCCESS,
  PATIENT_APPOINTMENTS_FAIL,
  PATIENT_DOCTORS_CLINICS_AROUND_REQUEST,
  PATIENT_DOCTORS_CLINICS_AROUND_SUCCESS,
  PATIENT_DOCTORS_CLINICS_AROUND_FAIL,
  PATIENT_CLINICS_REQUEST,
  PATIENT_CLINICS_SUCCESS,
  PATIENT_CLINICS_FAIL,
  PATIENTS_FOR_REVIEWS_REQUEST,
  PATIENTS_FOR_REVIEWS_SUCCESS,
  PATIENTS_FOR_REVIEWS_FAIL,
  PATIENT_REQUEST_CLINICS,
  PATIENT_SUCCESS_CLINICS,
  PATIENT_FAIL_CLINICS,
} from "../constants/patientConstants";
import { handleGetPatientLocation } from "../utils/calculateDistance";

import {
  retrieveClinicsForPatientDashboard,
  retrieveClinicsOfPatient,
  retrievePatientAppointments,
  retrievePatientData,
  retrievePatientForReviews,
} from "../utils/getFirebaseData";

export const getPatientClinicHistory = () => async (dispatch) => {
  try {
    dispatch({ type: "PATIENT_CLINIC_HISTORY_REQUEST" });

    const patientInfo = await retrievePatientData(guestDetails);

    dispatch({
      type: "PATIENT_CLINIC_HISTORY_SUCCESS",
      payload: patientInfo,
    });
  } catch (error) {
    dispatch({
      type: "PATIENT_CLINIC_HISTORY_FAIL",
      payload: error,
    });
  }
};

export const getPatientInfo = (guestDetails) => async (dispatch) => {
  try {
    dispatch({ type: PATIENT_INFO_REQUEST });

    const patientInfo = await retrievePatientData(guestDetails);

    dispatch({
      type: PATIENT_INFO_SUCCESS,
      payload: patientInfo,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_INFO_FAIL,
      payload: error,
    });
  }
};

export const getPatientClinicsDoctorsAround =
  (sliderValue: any) => async (dispatch: any) => {
    try {
      dispatch({ type: PATIENT_DOCTORS_CLINICS_AROUND_REQUEST });

      let start = Date.now() / 1000;
      const aroundPatient = await handleGetPatientLocation(sliderValue);
      console.log("END... handleGetPatientLocation", Date.now() / 1000 - start);

      dispatch({
        type: PATIENT_DOCTORS_CLINICS_AROUND_SUCCESS,
        payload: aroundPatient,
      });
    } catch (error) {
      dispatch({
        type: PATIENT_DOCTORS_CLINICS_AROUND_FAIL,
        payload: error,
      });
    }
  };

export const getPatientAppointments =
  (showAllUpcomming, showAllPast) => async (dispatch) => {
    try {
      dispatch({ type: PATIENT_APPOINTMENTS_REQUEST });

      const patientAppointments = await retrievePatientAppointments(
        showAllUpcomming,
        showAllPast
      );

      dispatch({
        type: PATIENT_APPOINTMENTS_SUCCESS,
        payload: patientAppointments,
      });
    } catch (error) {
      dispatch({
        type: PATIENT_APPOINTMENTS_FAIL,
        payload: error,
      });
    }
  };

export const getClinicsOfPatient = () => async (dispatch) => {
  try {
    dispatch({ type: PATIENT_CLINICS_REQUEST });

    const clinicsOfPatient = await retrieveClinicsOfPatient();

    dispatch({
      type: PATIENT_CLINICS_SUCCESS,
      payload: clinicsOfPatient,
    });
  } catch (error) {
    dispatch({
      type: PATIENT_CLINICS_FAIL,
      payload: error,
    });
  }
};

export const setTemporaryPatientReview = (patientReview) => (dispatch) => {
  try {
    dispatch({ type: "TEMPORARY_REVIEW_REQUEST" });

    dispatch({
      type: "TEMPORARY_REVIEW_SUCCESS",
      payload: patientReview,
    });
  } catch (error) {
    dispatch({
      type: "TEMPORARY_REVIEW_FAIL",
      payload: error,
    });
  }
};

export const setTemporaryPatientClinicReview =
  (patientClinicReview) => (dispatch) => {
    try {
      dispatch({ type: "TEMPORARY_CLINICREVIEW_REQUEST" });

      dispatch({
        type: "TEMPORARY_CLINICREVIEW_SUCCESS",
        payload: patientClinicReview,
      });
    } catch (error) {
      dispatch({
        type: "TEMPORARY_CLINICREVIEW_FAIL",
        payload: error,
      });
    }
  };

export const getPatientsForReviews =
  (otherReviews, isClinicReviews) => async (dispatch) => {
    try {
      dispatch({ type: PATIENTS_FOR_REVIEWS_REQUEST });

      const patientsForReviews = await retrievePatientForReviews(
        otherReviews,
        isClinicReviews
      );

      dispatch({
        type: PATIENTS_FOR_REVIEWS_SUCCESS,
        payload: patientsForReviews,
      });
    } catch (error) {
      dispatch({
        type: PATIENTS_FOR_REVIEWS_FAIL,
        payload: error,
      });
    }
  };

export const getGuestLoginDetails = () => async (dispatch) => {
  try {
    dispatch({ type: "GUEST_DETAILS_REQUEST" });

    const guestDetails = "";

    dispatch({
      type: "GUEST_DETAILS_SUCCESS",
      payload: guestDetails,
    });
  } catch (error) {
    dispatch({
      type: "GUEST_DETAILS_FAIL",
      payload: error,
    });
  }
};

// export const getCalendarTimes = () => async dispatch => {
//   try {
//     dispatch({type: CLINIC_CALENDAR_REQUEST});

//     const clinicCalendarTimes = await retrieveClinicCalendarTimes();
//     console.log('Dispatching success');
//     dispatch({
//       type: CLINIC_CALENDAR_SUCCESS,
//       payload: clinicCalendarTimes,
//     });
//   } catch (error) {
//     dispatch({
//       type: CLINIC_CALENDAR_FAIL,
//       payload: error,
//     });
//   }
// };
