import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUses24hourClockFromPhoneSettings } from '../../i18n';


const HourClockContext = createContext();

export const useHourClockContext = () => {
    return useContext(HourClockContext);
};

export const HourClockProvider = ({ children }) => {
    const [hourClock, setHourClock] = useState(null);

    useEffect(() => {
        const fetchHourClock = async () => {
            const clock = await getUses24hourClockFromPhoneSettings();
            setHourClock(clock);
        };

        fetchHourClock();
    }, []);

    return (
        <HourClockContext.Provider value={hourClock}>
            {children}
        </HourClockContext.Provider>
    );
};
