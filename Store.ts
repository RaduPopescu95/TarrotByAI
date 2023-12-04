import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
// import devToolsEnhancer from 'remote-redux-devtools';
import {composeWithDevTools} from 'redux-devtools-extension';
// import {composeWithDevTools} from '@redux-devtools/core';
// import {termsListReducers} from './app/Reducers/termReducers';

// import {updateTheme} from './app/actions/userActions';
import {
  getClinicAppointmentsReducer,
  getClinicApprovedAppointmentsReducer,
  getClinicCalendarTimeReducer,
  getClinicInfoReducer,
  getClinicsPatientsReducer,
  getClinicsReducer,
  getClinicTimeSlotsReducer,
  getClinicDoctorsReducer,
  getDoctorCalendarTimeReducer,
  

} from './src/Reducers/clinicReducers';
import {
  getClinicsOfPatientReducer,
  getPatientAppointmentsReducer,
  getPatientClinicsDoctorsAroundReducer,
  getPatientInfoReducer,
  getPatientsForReviewsReducer,
  setTemporaryPatientClinicReviewReducer,
  setTemporaryPatientReviewReducer,
  // getClinicsForPatientDashReducer,
  getGuestDetailsReducer
} from './src/Reducers/patientReducers';
import {getClinicApprovedAppointments} from './src/actions/clinicActions';
import { getDoctorApprovedAppointmentsReducer } from './src/Reducers/doctorReducers';
import { getTimeFormatReducer } from './src/Reducers/comonReducers';

const reducer = combineReducers({
  clinicInfoData: getClinicInfoReducer,
  clinicTimeSlots: getClinicTimeSlotsReducer,
  clinicCalendarTimes: getClinicCalendarTimeReducer,
  doctorCalendarTimes: getDoctorCalendarTimeReducer,
  allClinics: getClinicsReducer,
  clinicsPatients: getClinicsPatientsReducer,
  clinicAppointments: getClinicAppointmentsReducer,
clinicApprovedAppointments: getClinicApprovedAppointmentsReducer,
  doctorApprovedAppointments: getDoctorApprovedAppointmentsReducer,
  clinicDoctors: getClinicDoctorsReducer,
  
  patientInfoData: getPatientInfoReducer,
  aroundPatientData: getPatientClinicsDoctorsAroundReducer,
  patientAppointments: getPatientAppointmentsReducer,
  // allClinicsForPatientDash: getClinicsForPatientDashReducer,
  clinicsOfPatient: getClinicsOfPatientReducer,
  tempPatientRev: setTemporaryPatientReviewReducer,
  tempPatientClinicRev: setTemporaryPatientClinicReviewReducer,
  patientsForReviews: getPatientsForReviewsReducer,
  guestDetailsPatient: getGuestDetailsReducer,
  hourFormat: getTimeFormatReducer,
});

const middleware = [thunk];

// const composeEnhancers =
//   typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//       })
//     : compose;

// const enhancer = composeEnhancers(
//   applyMiddleware(...middleware),
//   // other store enhancers if any
// );


const store = createStore(
  reducer,
  // initialState,
  
  composeWithDevTools(applyMiddleware(...middleware)),
);


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch



export default store;
