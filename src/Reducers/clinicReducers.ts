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
  CLINICS_APPROVED_APPOINTMENTS_REQUEST,
  CLINICS_APPROVED_APPOINTMENTS_SUCCESS,
  CLINICS_APPROVED_APPOINTMENTS_FAIL,

  GET_CLINICS_REQUEST,
  GET_CLINICS_SUCCESS,
  GET_CLINICS_FAIL,

} from '../constants/clinicConstants';

export const getClinicInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case CLINIC_INFO_REQUEST:
      return {loading: true, clinicInformation: {}};

    case CLINIC_INFO_SUCCESS:
      return {
        loading: false,
        clinicInformation: action.payload,
      };

    case CLINIC_INFO_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicDoctorsReducer = (state = {}, action) => {
  switch (action.type) {
    case CLINIC_DOCTORS_REQUEST:
      return {loading: true, clinicDoctorsInfo: {}};

    case CLINIC_DOCTORS_SUCCESS:
      return {
        loading: false,
        clinicDoctorsInfo: action.payload,
      };

    case CLINIC_DOCTORS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicTimeSlotsReducer = (state = {}, action) => {

  switch (action.type) {
    case CLINIC_TIMESLOTS_REQUEST:
      return {loading: true, clinicInformation: {}};

    case CLINIC_TIMESLOTS_SUCCESS:
      console.log('START....HERE');
      return {
        loading: false,
        allDaysDB: action.payload,
      };

    case CLINIC_TIMESLOTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicCalendarTimeReducer = (state = {}, action) => {
  switch (action.type) {
    case CLINIC_CALENDAR_REQUEST:
      return {loading: true, calendarTimes: {}};

    case CLINIC_CALENDAR_SUCCESS:
      // console.log('action.payload....', action.payload);
      console.log('START....');
      return {
        loading: false,
        calendarTimes: action.payload,
      };

    case CLINIC_CALENDAR_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getDoctorCalendarTimeReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_CALENDAR_REQUEST:
      return {loading: true, doctorTimes: {}};

    case DOCTOR_CALENDAR_SUCCESS:
      // console.log('action.payload....', action.payload);
      console.log('START....getDoctorCalendarTimeReducer', action.payload);
      return {
        loading: false,
        doctorTimes: action.payload,
      };

    case DOCTOR_CALENDAR_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicsReducer = (state = {}, action) => {

  switch (action.type) {
    case GET_CLINICS_REQUEST:
      return {loading: true, clinicsDB: {}};

    case GET_CLINICS_SUCCESS:
      // console.log('action.payload....', action.payload);
      console.log('START....REDUCER....GET...CLINICS', action.payload);
      return {
        loading: false,
        clinicsDB: action.payload,
      };

    case GET_CLINICS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};


export const getClinicsPatientsReducer = (state = {}, action) => {

  switch (action.type) {
    case CLINICS_PATIENTS_REQUEST:
      
      return {loading: true, clinicsPatients: {}};

    case CLINICS_PATIENTS_SUCCESS:
      // console.log('PATIENTS OF CLINIC REDUCER....', action.payload);
      return {
        loading: false,
        clinicsPatients: action.payload,
      };

    case CLINICS_PATIENTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicAppointmentsReducer = (state = {}, action) => {
  switch (action.type) {
    case CLINICS_APPOINTMENTS_REQUEST:
      return {loading: true, clinicAppointments: {}};

    case CLINICS_APPOINTMENTS_SUCCESS:
      return {
        loading: false,
        clinicAppointments: action.payload,
      };

    case CLINICS_APPOINTMENTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};


export const getClinicApprovedAppointmentsReducer = (state = {}, action) => {
  switch (action.type) {
    case CLINICS_APPROVED_APPOINTMENTS_REQUEST:
      return {loading: true, clinicApprovedAppointments: {}};

    case CLINICS_APPROVED_APPOINTMENTS_SUCCESS:
      console.log('START....REDUCER....GET...APPROVED_CLINICS', action.payload);
      return {
        loading: false,
        clinicApprovedAppointments: action.payload,
      };

    case CLINICS_APPROVED_APPOINTMENTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const changeAppointmentApproval = (state = {}, action) => {
  switch (action.type) {
    case 'CLINICS_CHANGE_APPOINTMENT_APPROVAL':
      return {loading: true, clinicAppointments: {}};

    case CLINICS_APPOINTMENTS_SUCCESS:
      return {
        loading: false,
        clinicAppointments: action.payload,
      };

    case CLINICS_APPOINTMENTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};
