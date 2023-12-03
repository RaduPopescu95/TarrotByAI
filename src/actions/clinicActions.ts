import {
  CLINIC_INFO_REQUEST,
  CLINIC_INFO_SUCCESS,
  CLINIC_INFO_FAIL,
  CLINIC_DOCTORS_REQUEST,
  CLINIC_DOCTORS_SUCCESS,
  CLINIC_DOCTORS_FAIL,
  CLINIC_TIMESLOTS_REQUEST,
  CLINIC_TIMESLOTS_SUCCESS,
  CLINIC_TIMESLOTS_FAIL,
  CLINIC_CALENDAR_REQUEST,
  CLINIC_CALENDAR_SUCCESS,
  CLINIC_CALENDAR_FAIL,
  DOCTOR_CALENDAR_REQUEST,
  DOCTOR_CALENDAR_SUCCESS,
  DOCTOR_CALENDAR_FAIL,

  CLINICS_PATIENTS_REQUEST,
  CLINICS_PATIENTS_SUCCESS,
  CLINICS_PATIENTS_FAIL,
  CLINICS_APPOINTMENTS_REQUEST,
  CLINICS_APPOINTMENTS_SUCCESS,
  CLINICS_APPOINTMENTS_FAIL,
  CLINICS_APPROVED_APPOINTMENTS_SUCCESS,
  CLINICS_APPROVED_APPOINTMENTS_FAIL,
  CLINICS_APPROVED_APPOINTMENTS_REQUEST,

  GET_CLINICS_REQUEST,
  GET_CLINICS_SUCCESS,
  GET_CLINICS_FAIL,
} from '../constants/clinicConstants';
import { PATIENT_FAIL_CLINICS, PATIENT_REQUEST_CLINICS, PATIENT_SUCCESS_CLINICS } from '../constants/patientConstants';

import {
  retrieveApprovedClinicAppointments,
  retrieveApprovedDoctorAppointments,
  retrieveClinicAppointments,
  retrieveClinicCalendarTimes,
  retrieveClinicData,
  retrieveClinicDoctors,
  retrieveClinicPatients,
  retrieveClinics,
  retrieveClinicsForPatientDashboard,
  retrieveClinicTimeSlots,
  retrieveDoctorCalendarTimes,
} from '../utils/getFirebaseData';
import { getDoctorApprovedAppointments } from './doctorActions';

export const getClinicInfo = () => async dispatch => {
  try {
    dispatch({type: CLINIC_INFO_REQUEST});

    const clinicInfo = await retrieveClinicData();
   
    dispatch({
      type: CLINIC_INFO_SUCCESS,
      payload: clinicInfo,
    });
  } catch (error) {
    dispatch({
      type: CLINIC_INFO_FAIL,
      payload: error,
    });
  }
};

export const getClinicDoctors = () => async dispatch => {

  try {
    dispatch({type: CLINIC_DOCTORS_REQUEST});

    const clinicDoctors = await retrieveClinicDoctors();

    dispatch({
      type: CLINIC_DOCTORS_SUCCESS,
      payload: clinicDoctors,
    });
  } catch (error) {
    dispatch({
      type: CLINIC_DOCTORS_FAIL,
      payload: error,
    });
  }
};

export const getScheduleTimings = () => async dispatch => {
  try {
    dispatch({type: CLINIC_TIMESLOTS_REQUEST});

    const clinicTimeSlots = await retrieveClinicTimeSlots();

    dispatch({
      type: CLINIC_TIMESLOTS_SUCCESS,
      payload: clinicTimeSlots,
    });
  } catch (error) {
    dispatch({
      type: CLINIC_TIMESLOTS_FAIL,
      payload: error,
    });
  }
};

export const getCalendarTimes = () => async dispatch => {
  try {
    dispatch({type: CLINIC_CALENDAR_REQUEST});

    const clinicCalendarTimes = await retrieveClinicCalendarTimes();

    dispatch({
      type: CLINIC_CALENDAR_SUCCESS,
      payload: clinicCalendarTimes,
    });
  } catch (error) {
    dispatch({
      type: CLINIC_CALENDAR_FAIL,
      payload: error,
    });
  }
};

export const getDoctorCalendarTimes = (doctorId, allDays) => async dispatch => {
  try {
    dispatch({type: DOCTOR_CALENDAR_REQUEST});

    const clinicCalendarTimes = await retrieveDoctorCalendarTimes(doctorId);

    dispatch(getDoctorApprovedAppointments(doctorId, clinicCalendarTimes, allDays))
    dispatch({
      type: DOCTOR_CALENDAR_SUCCESS,
      payload: clinicCalendarTimes,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_CALENDAR_FAIL,
      payload: error,
    });
  }
};

export const getClinics = () => async dispatch => {

  try {
    dispatch({type: GET_CLINICS_REQUEST});

    const clinics = await retrieveClinics();

    dispatch({
      type: GET_CLINICS_SUCCESS,
      payload: clinics,
    });
  } catch (error) {
    dispatch({
      type: GET_CLINICS_FAIL,
      payload: error,
    });
  }
};



export const getPatientsOfClinic = () => async dispatch => {
  try {
    dispatch({type: CLINICS_PATIENTS_REQUEST});

    const patientsOfClinic = await retrieveClinicPatients();

    dispatch({
      type: CLINICS_PATIENTS_SUCCESS,
      payload: patientsOfClinic,
    });
  } catch (error) {
    dispatch({
      type: CLINICS_PATIENTS_FAIL,
      payload: error,
    });
  }
};

export const getClinicAppointments = () => async dispatch => {
  try {
    dispatch({type: CLINICS_APPOINTMENTS_REQUEST});

    const clinicAppointments = await retrieveClinicAppointments();

    dispatch({
      type: CLINICS_APPOINTMENTS_SUCCESS,
      payload: clinicAppointments.clinicAppointments,
    });
  } catch (error) {
    dispatch({
      type: CLINICS_APPOINTMENTS_FAIL,
      payload: error,
    });
  }
};



export const getClinicApprovedAppointments = () => async dispatch => {
  // console.log('start here...');
  try {
    dispatch({type: CLINICS_APPROVED_APPOINTMENTS_REQUEST});

    const clinicApprovedAppointments =
      await retrieveApprovedClinicAppointments();
    // console.log('clinicApprovedAppointments....', clinicApprovedAppointments);
    dispatch({
      type: CLINICS_APPROVED_APPOINTMENTS_SUCCESS,
      payload: clinicApprovedAppointments,
    });
  } catch (error) {
    dispatch({
      type: CLINICS_APPROVED_APPOINTMENTS_FAIL,
      payload: error,
    });
  }
};

// export const changeApproved = () => async dispatch => {
//   try {
//     dispatch({type: CLINICS_APPOINTMENTS_REQUEST});

//     dispatch({
//       type: CLINICS_APPOINTMENTS_SUCCESS,
//       payload: clinicAppointments.clinicAppointments,
//     });
//   } catch (error) {
//     dispatch({
//       type: CLINICS_APPOINTMENTS_FAIL,
//       payload: error,
//     });
//   }
// };
