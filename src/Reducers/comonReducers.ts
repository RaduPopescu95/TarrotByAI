export const getTimeFormatReducer = (state = {}, action) => {
    switch (action.type) {
      case "24HOUR_REQUEST":
        //   console.log('DOCTOR_APPROVED_APPOINTMENTS_REQUEST....');
          return {loading: true, hourClock: false};
          
          case "24HOUR_SUCCESS":
        //   console.log('DOCTOR_APPROVED_APP_SUCCESS.....', action.payload);
        return {
          loading: false,
          hourClock: action.payload,
      }
  
      case "24HOUR_ERROR":
        return {loading: false, error: action.payload};
  
      default:
        return state;
    }
  };