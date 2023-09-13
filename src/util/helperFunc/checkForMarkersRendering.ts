const showMarker = (map: naver.maps.Map, marker: naver.maps.Marker) => {
  marker.setMap(map);
};

const hideMarker = (marker: naver.maps.Marker) => {
  marker.setMap(null);
};

export const checkForMarkersRendering = (map: naver.maps.Map, markers: naver.maps.Marker[]) => {
  const mapBounds: any = map.getBounds();

  for (let i = 0; i < markers.length; i++) {
    const position = markers[i].getPosition();

    if (mapBounds.hasLatLng(position)) {
      showMarker(map, markers[i]);
    } else {
      hideMarker(markers[i]);
    }
  }
};
