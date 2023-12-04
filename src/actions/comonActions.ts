import { getUses24hourClockFromPhoneSettings } from "../../i18n";

export const getTimeFormat = () => async dispatch => {
    try {
      dispatch({type: "24HOUR_REQUEST"});
  
      const hourClock = await getUses24hourClockFromPhoneSettings()
  
      dispatch({
        type: "24HOUR_SUCCESS",
        payload: hourClock,
      });
    } catch (error) {
      dispatch({
        type: "24HOUR_ERROR",
        payload: error,
      });
    }
  };