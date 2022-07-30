import React from 'react';
import { requestBins } from '../utils/requests';
import { BINS_ID } from './bins';

export const MarkersContext = React.createContext([]);

export const getClosestSites = async (coordinate) => {
    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;

    const data = await requestBins({ latitude, longitude }, 2000);
    const markers = collectMarkers(data);
    return markers;
}


const collectMarkers = (data) => {
    let nonEmptyTypes =  { 
        [BINS_ID.PAPER]: false, 
        [BINS_ID.GLASS]: false, 
        [BINS_ID.PACKAGING]: false,
        [BINS_ID.CLOTHES]: false,
        [BINS_ID.ELECTRONIC]: false,
        [BINS_ID.BOTTLES]: false, 
        [BINS_ID.CARTON]: false, 
    };
    const hash = Object.create(null);
    const result = data
        .map(getMarkerProps)
        .filter(elem => elem)
        .map(x => {
            nonEmptyTypes[x.itemType] = true;
            const { latitude, longitude } = x.coordinate;
            const latLng = `${latitude}_${longitude}`;
            if (hash[latLng]) {
                return {
                    ...x,
                    coordinate: {
                        latitude: latitude - 0.0001,
                        longitude,
                    },
                };
            }
            hash[latLng] = true;
            return x;
        });
    return {
        markers: result,
        status: nonEmptyTypes
    };
}

const getMarkerProps = (data) => {
    const type = data.type.toUpperCase();
    const coors = data.location.coordinates;
    const street = data.street ?? '';
    const distance = data.distance;
    const bin_id = data._id;

    if (type && BINS_ID[type] && coors && distance && bin_id) {
        return {
            coordinate: { latitude: coors[1], longitude: coors[0] },
            itemType: BINS_ID[type],
            address: street || `${coors[1]}, ${coors[0]}`,
            distance,
            id: bin_id
        };
    }
};

