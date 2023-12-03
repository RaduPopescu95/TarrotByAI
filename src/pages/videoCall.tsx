import React from 'react';
import { View, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { GeneralProps } from '../interfaces/generalProps';
import { Route } from '@react-navigation/native';
import {  RowView } from '../components/commonViews';
import { H7fontRegularWhite } from '../components/commonText';
import { screenName } from '../utils/screenName';
import { flex1, p15 } from '../common/commonStyles';
// import { DevHeight, DevWidth } from '../utils/device';
import {Dimensions} from 'react-native';


import BackIcon from '../../assets/images/back.svg';
import Patient4 from '../../assets/images/patients/patient4.svg';
import VideoCallIcon from '../../assets/images/video-call.svg';
import SettingsIcon from '../../assets/images/icon-settings.svg';
import MuteIcon from '../../assets/images/mute.svg';
import CallClose from '../../assets/images/call-close.svg';
import VideoIcon from '../../assets/images/video-call-icon.svg';

interface Props extends GeneralProps {
    route: Route<string, object | undefined>;
}
const VideoCall: React.FC<Props> = ({ navigation, route }): JSX.Element => {

    return (
            <View style={styles.container}>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
                    <VideoCallIcon height={Dimensions.get('window').height} width={Dimensions.get('window').width*1.6}/>
                </View>
                    <RowView style={p15}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <SettingsIcon height={27} width={27} />
                        </TouchableOpacity>
                    </RowView>
                    <View style={styles.videoCallStyle}>
                        <View style={styles.videoCallViewStyle}>
                            <Patient4 height={90} width={90} />
                        </View>
                        <H7fontRegularWhite>04:15 Hrs</H7fontRegularWhite>
                    </View>
                    <RowView style={styles.footerStyle}>
                        <TouchableOpacity>
                                <MuteIcon fill="#000" height={50} width={50} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate(screenName.DashBoardScreen)}>
                                <CallClose height={50} width={50} />
                            </TouchableOpacity>
                        <TouchableOpacity>
                                <VideoIcon height={50} width={50} />
                            </TouchableOpacity>
                    </RowView>
            </View>
    )
}

export default VideoCall;
const styles = StyleSheet.create({
    container:{flex: 1},
    backIcon:{
        height: 30, width: 30
    },
    settingsIcons:{
        height: 27, width: 27
    },
    videoCallStyle:{flex: 1, paddingTop: 250, justifyContent: 'center', alignItems: 'center'},
    videoCallViewStyle:{ borderColor: '#fff', borderWidth: 5, borderRadius: 5, marginBottom: 5},
    videoCallImageStyle:{height: 90, width: 90, borderRadius: 5,},
    footerStyle:{bottom: 30, paddingHorizontal: 90},
    footerOptionsImageStyle:{height: 50, width: 50}
})  