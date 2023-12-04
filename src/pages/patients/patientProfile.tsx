import React, {Fragment, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route, useIsFocused} from '@react-navigation/native';
import {NavBarPatient} from '../../common/commonComponents';
import {MainContainer} from '../../components/commonViews';
import {SegmentControl} from '../../components/segmentControl';
// import AppointmentList from './appointmentsClinic';
import PrescriptionList from './prescriptions';
import MedicalRecords from './medicalRecords';
import Billing from './billing';
import PatientOverView from './overView';
import {patientsegments} from '../../utils/constant';
import {useSelector} from 'react-redux';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const PatientProfile: React.FC<Props> = ({navigation, route}): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<
    | 'OverView'
    | 'Appointments'
    | 'Prescriptions'
    | 'Medical Records'
    | 'Billing'
  >('OverView');
  const isFocused = useIsFocused();

  const patientInfoDB = useSelector(state => state.patientInfoData);
  const {patientInformation} = patientInfoDB;

  useEffect(() => {
    selectedTab == 'OverView';
  }, [isFocused]);

  return (
    <Fragment>
      <MainContainer>
        <ScrollView>
          <NavBarPatient
            title={'Patient Appointments'}
            isPatient={patientInformation.isPatient}
          />
          <ScrollView horizontal={true}>
            <SegmentControl
              tabs={patientsegments}
              defaultTab={selectedTab}
              onTabChanged={(
                tab:
                  | 'OverView'
                  | 'Appointments'
                  | 'Prescriptions'
                  | 'Medical Records'
                  | 'Billing',
              ) => {
                setSelectedTab(tab);
              }}
            />
          </ScrollView>
          {selectedTab == 'OverView' ? <PatientOverView /> : null}
          {selectedTab == 'Appointments' ? <AppointmentList /> : null}
          {selectedTab == 'Prescriptions' ? <PrescriptionList /> : null}
          {selectedTab == 'Medical Records' ? <MedicalRecords /> : null}
          {selectedTab == 'Billing' ? <Billing /> : null}
        </ScrollView>
      </MainContainer>
    </Fragment>
  );
};
export default PatientProfile;
