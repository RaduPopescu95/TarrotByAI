import React, {Fragment, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route, useIsFocused} from '@react-navigation/native';
import {NavBarPatient} from '../../common/commonComponents';
import {MainContainer} from '../../components/commonViews';
import {SegmentControl} from '../../components/segmentControl';
import AppointmentList from './appointmentsClinic';
import PrescriptionList from './prescriptions';
import Billing from './billing';
import MedicalRecords from './medicalRecords';
import {segment} from '../../utils/constant';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const PatientAppointments: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [selectedTab, setSelectedTab] =
    useState<'Appointments'>('Appointments');
  // const [selectedTab, setSelectedTab] = useState<
  //   'Appointments' | 'Prescriptions' | 'Medical Records' | 'Billing'
  // >('Appointments');
  const isFocused = useIsFocused();
  useEffect(() => {
    selectedTab == 'Appointments';
  }, [isFocused]);

  return (
    <Fragment>
      <MainContainer>
        <ScrollView>
          <NavBarPatient title={'Patient Appointments'} />
          <ScrollView horizontal={true}>
            {/* <SegmentControl
              tabs={segment}
              defaultTab={selectedTab}
              onTabChanged={(
                tab:
                  | 'Appointments'
                  | 'Prescriptions'
                  | 'Medical Records'
                  | 'Billing',
              ) => {
                setSelectedTab(tab);
              }}
            /> */}
            {/* <SegmentControl
              tabs={segment}
              defaultTab={selectedTab}
              onTabChanged={(
                tab:
                  | 'Appointments'
              ) => {
                setSelectedTab(tab);
              }}
            /> */}
          </ScrollView>
          {/* {selectedTab == 'Appointments' ? <AppointmentList /> : null} */}
          {/* {selectedTab == 'Prescriptions' ? <PrescriptionList /> : null}
          {selectedTab == 'Medical Records' ? <MedicalRecords /> : null}
          {selectedTab == 'Billing' ? <Billing /> : null} */}
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};
export default PatientAppointments;
