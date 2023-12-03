import { DOCTOR_APPROVED_APPOINTMENTS_FAIL, DOCTOR_APPROVED_APPOINTMENTS_REQUEST, DOCTOR_APPROVED_APP_SUCCESS } from "../constants/doctorConstants";

export const getDoctorApprovedAppointmentsReducer = (state = {}, action) => {
    switch (action.type) {
      case DOCTOR_APPROVED_APPOINTMENTS_REQUEST:
        //   console.log('DOCTOR_APPROVED_APPOINTMENTS_REQUEST....');
          return {loading: true, doctorApprovedAppointments: {}};
          
          case DOCTOR_APPROVED_APP_SUCCESS:
        //   console.log('DOCTOR_APPROVED_APP_SUCCESS.....', action.payload);
        return {
          loading: false,
          doctorApprovedAppointments: action.payload,
      }
  
      case DOCTOR_APPROVED_APPOINTMENTS_FAIL:
        return {loading: false, error: action.payload};
  
      default:
        return state;
    }
  };
  