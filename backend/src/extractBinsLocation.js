//@ts-nocheck

const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BINS = {
    'בקבוקים': 'bottles',
    'קרטון': 'carton',
    'זכוכית': 'glass',
    'פסולת אלקטרונית': 'electronic',
    'אריזות – מכלים מונפים': 'packaging',
    'טקסטיל': 'clothes',
}

const fetchJSON = async (baseUrl, params) => {
    const paramString = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    const url = baseUrl.concat("?", paramString);
    try {
        const res = await fetch(url);
        const resData = await res.json();
        return resData;
    } catch (e) {
        throw e;
    }
}

const fetchQuery = async (oid) => {
    const url = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/WM/IView2WM/MapServer/787/query"
    const params = {
        f: "json",
        outFields: "*",
        spatialRel: "esriSpatialRelIntersects",
        text: "%",
        where: `oid=${oid}`
    }
    try {
        const data = await fetchJSON(url, params);
        return {
            geometry: data.features[0].geometry,
            type: data.features[0].attributes.t_sug,
            street: data.features[0].attributes.shem_rechov,
            house: data.features[0].attributes.ms_bait
        }
    } catch (e) {
        throw e;
    }
}

const fetchIdentify = async (geometry) => {
    const url = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/WM/IView2WM/MapServer/identify";
    const params = {
        f: "json",
        tolerance: "12",
        returnGeometry: "false",
        returnFieldName: "false",
        returnUnformattedValues: "false",
        imageDisplay: "1920,427,96",
        geometry: JSON.stringify(geometry),
        sr: "102100",
        mapExtent: "3869423.432894009.3768713.1595730777.3870570.843252575.C3768968.338855946",
        layers: "all:787,527"
    }
    try {
        const data = await fetchJSON(url, params);
        return data.results;
    } catch (e) {
        throw e;
    }
}

const parseData = (binData, layerData) => {
    const house = binData.house;
    const type = BINS[binData.type.trim()];
    let street = null;
    // First try to find street value in layer data
    for (layer of layerData) {
        if (layer.layerId == 527) {
            street = layer.value.trim();
        }
    }
    // Else, try in bin data
    if (street == null) {
        street = binData.street.trim();
        const hasNumber = /\d/.test(street);
        if (!hasNumber) {
            street = `${street} ${house}`;
        }
    }
    if (street == null) {
        throw new Error("street not found");
    }
    return {
        type,
        street
    }
}

const request = async (oid) => {
    try {
        const bin = await fetchQuery(oid);
        const layerData = await fetchIdentify(bin.geometry);
        const data = parseData(bin, layerData);
        console.log(`[${oid}]: success`)
        return {
            ...data,
            oid
        };
    } catch (e) {
        console.log(`[${oid}]: ${e.message}`);
        throw e;
    }
}

const fetchChunk = async (start, size) => {
    const oids = Array.apply(start, Array(size)).map((elem, idx) => start + idx);
    const promises = oids.map((i) => request(i));
    const results = await Promise.allSettled(promises);
    const validResults = results.filter(res => res.status == 'fulfilled').map(res => res.value);
    return validResults;
}

const scrape = async (start, end) => {
    const delta = 100;
    for (let i = start, chunk = 0; i < end; i += delta, chunk += 1) {
        console.log(`=== Fetching Chunk ${chunk} ===`);
        try {
            const results = await fetchChunk(i, delta);
            fs.writeFile(`chunk${chunk}.json`,
                JSON.stringify(results),
                {},
                (err) => {
                    if (err) {
                        console.log(`Couldn't write chunk ${chunk}: ${err.message}`);
                    } else {
                        console.log(`=== Saved Chunk ${chunk} ===`);
                    }
                }
            );
            // Sleep 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.log(e);
        }
    }
    return allResults;
}


const allResults = scrape(7800, 10000)
    .then(v => fs.writeFileSync("output.json", JSON.stringify(v)))
    .catch(e => console.log(e));
