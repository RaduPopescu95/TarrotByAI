import React, {Fragment, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {GeneralProps} from '../../interfaces/generalProps';
import {Route, useIsFocused} from '@react-navigation/native';
import {NavBarPatient} from '../../common/commonComponents';
import {MainContainer} from '../../components/commonViews';
import {SegmentControl} from '../../components/segmentControl';
import AppointmentList from './appointmentsClinic';
import PrescriptionList from './prescriptions';
import MedicalRecords from './medicalRecords';
import Billing from './billing';
import PatientOverView from './overView';
import {myProfilePatientSegments, patientsegments} from '../../utils/constant';
import {useDispatch, useSelector} from 'react-redux';
import AppointmentsPatient from './PastAppointmentsPatient';
import {getPatientAppointments} from '../../actions/patientActions';
import UpCommingAppointmentsPatient from './UpCommingAppointmentsPatient';
import PastAppointmentsPatient from './PastAppointmentsPatient';
import { getLocales } from 'expo-localization';
import { extendMoment } from 'moment-range';
import Moment from 'moment';
import i18n, { languageTag } from '../../../i18n';
import { ActivityIndicator } from 'react-native-paper';
import CustomLoader from '../../components/customLoader';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}

const MyProfilePatient: React.FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<any>(languageTag === "ro-RO" ? "Prezentare generală" : 'OverView');
  const [showAllPast, setShowAllPast] = useState<any>(false);
  const [showAllUpcomming, setShowAllUpcomming] = useState<any>(false);

  const ptAppointments = useSelector(state => state.patientAppointments);
  const {myAppointments, loading} = ptAppointments;


  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const patientInfoDB = useSelector(state => state.patientInfoData);
  const {patientInformation} = patientInfoDB;

  const guestDetailsData = useSelector(state => state.guestDetailsPatient);
  const {guestDetails} = guestDetailsData;


  const  handleToggleShowAllAppointments = (showAllUpcomming, showAllPast) => {
   
    
    const startFunction = Date.now();
    console.log("STart....")
  
    if(showAllPast){

      setShowAllUpcomming(false)
    }

    if(showAllUpcomming){
      
      setShowAllPast(false)
    }

    dispatch(getPatientAppointments(showAllUpcomming, showAllPast)).then(() => {
      const endFunction = Date.now();
      console.log(`Execution time: ${endFunction - startFunction} ms`);

    })
  }



  useEffect(() => {
    selectedTab == 'OverView';
  
    console.log(languageTag)
    console.log("patientInformation...", patientInformation)
    
  }, [isFocused]);

  return (
    <Fragment>
      <MainContainer>
        <NavBarPatient
          title={'My Profile'}
          isPatient={patientInformation.isPatient}
          isTermsAccepted={true}
        />
        {
          loading
          ?
            <CustomLoader isLoading={loading}/>
          :
          <ScrollView>
          <ScrollView horizontal={true}>
          {languageTag === "ro-RO" ? 
          
          <SegmentControl
            tabs={myProfilePatientSegments}
            defaultTab={selectedTab}
            onTabChanged={( tab:  'Prezentare generală' | 'upcomingAppointments' | 'pastAppointments') => {
              setSelectedTab(tab);
            }}
          />
          
          :
          <SegmentControl
            tabs={myProfilePatientSegments}
            defaultTab={selectedTab}
            onTabChanged={(tab:  'overView' | 'upcomingAppointments' | 'pastAppointments')  => {
              setSelectedTab(tab);
            }}
          />
          
        }
          </ScrollView>
          {selectedTab == i18n.translate('Overview') ? <PatientOverView patientImag = {patientInformation.patientImage} /> : null}
          {selectedTab == i18n.translate('upcomingAppointments') ? (
            <UpCommingAppointmentsPatient showAllUpcomming = {showAllUpcomming} setShowAllUpcomming={setShowAllUpcomming} handleToggleShowAllAppointments ={handleToggleShowAllAppointments}/>
          ) : null}
          {selectedTab ==  i18n.translate('pastAppointments') ? (
            <PastAppointmentsPatient showAllPast = {showAllPast} setShowAllPast={setShowAllPast} handleToggleShowAllAppointments ={handleToggleShowAllAppointments}/>
          ) : null}
          {/* {selectedTab == 'Prescriptions' ? <PrescriptionList /> : null}
          {selectedTab == 'Medical Records' ? <MedicalRecords /> : null}
          {selectedTab == 'Billing' ? <Billing /> : null} */}
        </ScrollView>
        }

      </MainContainer>
    </Fragment>
  );
};
export default MyProfilePatient;
