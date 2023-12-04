import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapInput from "../components/MapInput";

import {
  getLocation,
  geocodeLocationByName,
  _getLocationAsync,
  geocodeLocationByCoords,
} from "../services/location-service";
import { MyMapView } from "../components/MyMapView";
import { AntDesign } from "@expo/vector-icons";
import {
  H14fontRegularRed,
  H30fontRegularLightBlack2,
} from "../components/commonText";
import { ml10, mt10, mt15 } from "../common/commonStyles";
import i18n from "../../i18n";

export default function MapContainer({
  handleClinicAddress,
  clinicAddressLocation,
  clinicCoords,
  clinicAddress,
  notEditable,
  noCoordsSelected,
  setClinicAddress,
  children,
  handleMapPress,
}) {
  const [region, setRegion] = useState({});

  useEffect(() => {
    getInitialState();
    console.log(
      "clinicAddressLocation MAP CONTAINER ...",
      clinicAddressLocation.clinicCoords
    );
  }, []);

  const getInitialState = async () => {
    const data = await _getLocationAsync();
    console.log("data", data);

    setRegion({
      region: {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    });
  };

  const getCoordsFromName = (loc, addressDescription, city) => {
    console.log("loc...getCoordsFromName", loc);
    console.log("addressDescription", addressDescription);
    handleClinicAddress(loc, addressDescription, city);
    setRegion({
      region: {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    });
  };

  const onMapRegionChange = (region) => {
    setRegion({ region });
  };

  return (
    <View style={{ zIndex: 5 }}>
      <View
        style={{
          height: "100%",
        }}
      >
        {/* <H30fontRegularLightBlack2 style={[mt10, ml10]}>
                {i18n.translate("clinicAddress")}
              </H30fontRegularLightBlack2> */}

        {children}
        <MapInput
          notifyChange={(loc, addressDescription, city) =>
            getCoordsFromName(loc, addressDescription, city)
          }
          clinicAddressLocation={clinicAddressLocation}
          clinicAddress={clinicAddress}
          setClinicAddress={setClinicAddress}
          noCoordsSelected={noCoordsSelected}
        />

        {region.region && region.region["latitude"] ? (
          <View style={{ width: "100%", height: "100%" }}>
            <MyMapView
              region={region.region}
              onRegionChange={(reg) => onMapRegionChange(reg)}
              notEditable={notEditable}
              handleMapPress={handleMapPress}
              clinicCoords={clinicCoords}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
  //   }
}
