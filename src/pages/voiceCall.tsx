import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {GeneralProps} from '../interfaces/generalProps';
import {Route} from '@react-navigation/native';
import {H7fontRegularWhite} from '../components/commonText';
import {screenName} from '../utils/screenName';
// import {DevHeight, DevWidth} from '../utils/device';
import {Dimensions} from 'react-native';


import Patient4 from '../../assets/images/patients/patient4.svg';
import CallIcon from '../../assets/images/call-bg.svg';
import Doctor2 from '../../assets/images/doctors/doctor-02.svg';
import VideoIcon from '../../assets/images/video-icon.svg';
import PauseIcon from '../../assets/images/pause-icon.svg';
import ManIcon from '../../assets/images/man-icon.svg';
import MicIcon from '../../assets/images/mic-icon.svg';
import GridIcon from '../../assets/images/grid-icon.svg';
import SpeakerIcon from '../../assets/images/specker-icon.svg';
import CloseIcon from '../../assets/images/call-close.svg';

interface Props extends GeneralProps {
  route: Route<string, object | undefined>;
}
const voiceCall: React.FC<Props> = ({navigation, route}): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
        <CallIcon height={Dimensions.get('window').height} width={Dimensions.get('window').width*2}/>
      </View>
        <View style={styles.imageContainer}>
          <View style={styles.imageStyle}>
            <Patient4 height={70} width={70} />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.drImageBorder}>
            <Doctor2 height={140} width={210} />
          </View>
          <View style={styles.callDetails}>
            <H7fontRegularWhite>Dr. Darren Elder</H7fontRegularWhite>
            <H7fontRegularWhite>00:59</H7fontRegularWhite>
          </View>

          <View style={styles.footerButtonContainer}>
            <TouchableOpacity>
              <VideoIcon height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity>
              <PauseIcon height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity>
              <ManIcon height={50} width={50} />
            </TouchableOpacity>
          </View>
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity>
              <MicIcon height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity>
              <GridIcon height={50} width={50} />
            </TouchableOpacity>
            <TouchableOpacity>
              <SpeakerIcon height={50} width={50} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{paddingTop: 30}}
            onPress={() => navigation.navigate(screenName.DashBoardScreen)}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
    </View>
  );
};
export default voiceCall;

const styles = StyleSheet.create({
  container: {flex: 1},
  footerStyle: {bottom: 30, paddingHorizontal: 90},
  footerOptionsImageStyle: {height: 50, width: 50},
  footerOptionsEndImageStyle: {height: 60, width: 60, marginTop: 20},
  imageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    borderColor: '#fff',
    borderWidth: 5,
    borderRadius: 5,
    margin: 10,
    overflow: 'hidden'
  },
  imageStyle: {height: 70, width: 70, borderRadius: 5, overflow: 'hidden'},
  bodyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  drImageBorder: {
    width: 150,
    height: 150,
    borderRadius: 150,
    borderWidth: 5,
    borderColor: '#fff',
    overflow: 'hidden'
  },
  drImageStyle: {height: 140, width: 140, borderRadius: 140},
  callDetails: {paddingVertical: 10, paddingBottom: 100, alignItems: 'center'},
  footerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width / 2,
    paddingTop: 15,
  },
});
