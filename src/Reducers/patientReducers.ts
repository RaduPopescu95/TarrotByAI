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
  PATIENT_FAIL_CLINICS,
  PATIENT_SUCCESS_CLINICS,
  PATIENT_REQUEST_CLINICS,
} from '../constants/patientConstants';


// REDUCER FOR STORING ALL CLINICS FOR PATIENT SEARCH DASHBOARD
// COMMENTED OUT FOR ANOTHER FUNCTION FOR PERFORMANCE ->
// export const getClinicsForPatientDashReducer = (state = {}, action) => {
//   console.log("-----------getClinicsForPatientDashReducer REDUCER----------")
//   switch (action.type) {
//     case PATIENT_REQUEST_CLINICS:
//       return {loading: true, clinicsForDash: {}};

//     case PATIENT_SUCCESS_CLINICS:
//       // console.log('action.payload....', action.payload);

//       return {
//         loading: false,
//         clinicsForDash: action.payload,
//       };

//     case PATIENT_FAIL_CLINICS:
//       return {loading: false, error: action.payload};

//     default:
//       return state;
//   }
// };


export const getPatientInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_INFO_REQUEST:
      return {loading: true, patientInformation: {}};

    case PATIENT_INFO_SUCCESS:
      return {
        loading: false,
        patientInformation: action.payload,
      };

    case PATIENT_INFO_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getPatientClinicsDoctorsAroundReducer = (state = {}, action:any) => {
  switch (action.type) {
    case PATIENT_DOCTORS_CLINICS_AROUND_REQUEST:
      return {loading: true, aroundPatient: {}};

    case PATIENT_DOCTORS_CLINICS_AROUND_SUCCESS:
      return {
        loading: false,
        aroundPatient: action.payload,
      };

    case PATIENT_DOCTORS_CLINICS_AROUND_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getPatientAppointmentsReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_APPOINTMENTS_REQUEST:
      return {loading: true, myAppointments: {}};

    case PATIENT_APPOINTMENTS_SUCCESS:
      return {
        loading: false,
        myAppointments: action.payload,
      };

    case PATIENT_APPOINTMENTS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getClinicsOfPatientReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_CLINICS_REQUEST:
      return {loading: true, clinicsAppointed: {}};

    case PATIENT_CLINICS_SUCCESS:
      return {
        loading: false,
        clinicsAppointed: action.payload,
      };

    case PATIENT_CLINICS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const setTemporaryPatientReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "TEMPORARY_REVIEW_REQUEST":
      return {loading: true, tempPatientReview: {}};

    case "TEMPORARY_REVIEW_SUCCESS":
      return {
        loading: false,
        tempPatientReview: action.payload,
      };

    case "TEMPORARY_REVIEW_FAIL":
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const setTemporaryPatientClinicReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "TEMPORARY_CLINICREVIEW_REQUEST":
      return {loading: true, tempPatientClinicReview: {}};

    case "TEMPORARY_CLINICREVIEW_SUCCESS":
      return {
        loading: false,
        tempPatientClinicReview: action.payload,
      };

    case "TEMPORARY_CLINICREVIEW_FAIL":
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getPatientsForReviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENTS_FOR_REVIEWS_REQUEST:
      return {loading: true, patientsForReviews: []};

    case PATIENTS_FOR_REVIEWS_SUCCESS:
      return {
        loading: false,
        patientsForReviews: action.payload,
      };

    case PATIENTS_FOR_REVIEWS_FAIL:
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

export const getGuestDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GUEST_DETAILS_REQUEST":
      return {loading: true, guestDetails: []};

    case "GUEST_DETAILS_SUCCESS":
      return {
        loading: false,
        guestDetails: action.payload,
      };

    case "GUEST_DETAILS_FAIL":
      return {loading: false, error: action.payload};

    default:
      return state;
  }
};

// export const getClinicTimeSlotsReducer = (state = {}, action) => {
//   switch (action.type) {
//     case CLINIC_TIMESLOTS_REQUEST:
//       return {loading: true, clinicInformation: {}};

//     case CLINIC_TIMESLOTS_SUCCESS:
//       console.log('START....HERE');
//       return {
//         loading: false,
//         allDaysDB: action.payload,
//       };

//     case CLINIC_TIMESLOTS_FAIL:
//       return {loading: false, error: action.payload};

//     default:
//       return state;
//   }
// };

// export const getClinicCalendarTimeReducer = (state = {}, action) => {
//   switch (action.type) {
//     case CLINIC_CALENDAR_REQUEST:
//       return {loading: true, calendarTimes: {}};

//     case CLINIC_CALENDAR_SUCCESS:
//       // console.log('action.payload....', action.payload);
//       console.log('START....');
//       return {
//         loading: false,
//         calendarTimes: action.payload,
//       };

//     case CLINIC_CALENDAR_FAIL:
//       return {loading: false, error: action.payload};

//     default:
//       return state;
//   }
// };
