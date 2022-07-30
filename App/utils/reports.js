import AsyncStorage from '@react-native-async-storage/async-storage';
import {reportMissingSite_req, reportNewSite_req} from './requests'

const isReportExists = (reports, id) => {
    for(let report_idx = 0; report_idx < reports.length; report_idx++ ){
        if(reports[report_idx].id == id) return true;
    }
    return false;
};


export const reportMissingSite = async (missingSite) => {
    try {
        let existingReports = await JSON.parse(AsyncStorage.getItem('@missingReports'));
        if (!existingReports){
            existingReports = [];
        }
        if (!isReportExists(existingReports, missingSite.id)){
            existingReports.push(missingSite);
            await AsyncStorage.setItem('@missingReports', JSON.stringify(existingReports));
            await reportMissingSite_req(missingSite);
        }
    } catch (error) {
        console.log(error);
    }
};