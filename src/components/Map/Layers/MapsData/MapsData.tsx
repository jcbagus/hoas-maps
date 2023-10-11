import React from 'react';
import usePOIEvents, { useSelectedItem } from './events';
import POIs from './POIs';
import Areas from './Areas';
import { MainPopup, HoverPopup } from './Popups';
import Lines from './Lines';
import { HSLCityBikes, HSLPaymentZones, HSLStops } from './HSL';

export default function MapsData() {
  const { selectedItem } = useSelectedItem();
  const { hoverPopupInfo } = usePOIEvents();
  return (
    <>
      <HSLPaymentZones />
      <HSLCityBikes />
      <HSLStops />
      <Lines />
      <POIs />
      <Areas />
      {hoverPopupInfo && <HoverPopup data={hoverPopupInfo} />}
      {selectedItem && <MainPopup selectedItem={selectedItem} />}
    </>
  );
}
