export const districts = [
    { id: 1, name: 'Bengaluru Urban' },
    { id: 2, name: 'Mysuru' },
    { id: 3, name: 'Belagavi' },
    { id: 4, name: 'Dakshina Kannada' },
    { id: 5, name: 'Kalaburagi' }
];

export const units = [
    { id: 1, districtId: 1, name: 'Shivajinagar PS' },
    { id: 2, districtId: 1, name: 'Indiranagar PS' },
    { id: 3, districtId: 1, name: 'Halasuru PS' },
    { id: 4, districtId: 2, name: 'Devaraja PS' },
    { id: 5, districtId: 2, name: 'Lakshmipuram PS' },
    { id: 6, districtId: 3, name: 'Belagavi Town PS' },
    { id: 7, districtId: 4, name: 'Mangaluru South PS' },
    { id: 8, districtId: 5, name: 'Kalaburagi City PS' }
];

export const getUserDetailsByRole = (role) => {
    switch (role) {
        case 'SCRB_ADMIN':
            return {
                employeeID: 100,
                firstName: 'Prashant',
                lastName: 'Kumar',
                email: 'prashant.kumar@ksp.gov.in',
                designation: 'Director General, SCRB',
                districtName: 'State Headquarters',
                unitName: 'SCRB HQ, Bengaluru'
            };
        case 'DISTRICT_OFFICER':
            return {
                employeeID: 9,
                firstName: 'Praveen',
                lastName: 'Verma',
                email: 'praveen.verma@ksp.gov.in',
                designation: 'Superintendent of Police',
                districtName: 'Bengaluru Urban',
                unitName: 'District Office'
            };
        case 'INVESTIGATION_OFFICER':
            return {
                employeeID: 1,
                firstName: 'Mohammed',
                lastName: 'Puttaiah',
                email: 'mohammed.puttaiah@ksp.gov.in',
                designation: 'Sub-Inspector',
                districtName: 'Bengaluru Urban',
                unitName: 'Shivajinagar PS'
            };
        default:
            return {};
    }
};

export const repeatOffenders = [
    { id: 1, name: 'Rajesh Choudhary', age: 30, gender: 'Male', riskScore: 92, caseCount: 11, distinctDistricts: 3, moPhrase: 'posed as bank official via mobile phone and extracted OTP', districtId: 1, unitId: 1 },
    { id: 2, name: 'Imran Basappa', age: 29, gender: 'Male', riskScore: 84, caseCount: 8, distinctDistricts: 2, moPhrase: 'gained entry through rear window after removing iron grille', districtId: 1, unitId: 2 },
    { id: 3, name: 'Sneha Yellappa', age: 41, gender: 'Female', riskScore: 78, caseCount: 6, distinctDistricts: 2, moPhrase: 'created fake matrimonial profile online and defrauded multiple victims', districtId: 2, unitId: 4 },
    { id: 4, name: 'Vikas Gupta', age: 35, gender: 'Male', riskScore: 65, caseCount: 5, distinctDistricts: 1, moPhrase: 'waylaid victim near ATM and snatched gold chain and mobile phone', districtId: 3, unitId: 6 },
    { id: 5, name: 'Anil Deshpande', age: 38, gender: 'Male', riskScore: 49, caseCount: 4, distinctDistricts: 1, moPhrase: 'pushed parked motorcycle silently and departed using hotwire ignition technique', districtId: 4, unitId: 7 }
];

export const districtSocioEconomic = [
  { districtId: 1, name: 'Bengaluru Urban', povertyIndex: 8.2, populationDensity: 4381, urbanizationRate: 99.5, unemploymentRate: 3.8, literacyRate: 91.2, perCapitaIncome: 425000, crimeRatePer100k: 452 },
  { districtId: 2, name: 'Mysuru', povertyIndex: 14.7, populationDensity: 276, urbanizationRate: 41.5, unemploymentRate: 5.2, literacyRate: 82.4, perCapitaIncome: 185000, crimeRatePer100k: 218 },
  { districtId: 3, name: 'Belagavi', povertyIndex: 22.3, populationDensity: 354, urbanizationRate: 24.3, unemploymentRate: 7.1, literacyRate: 73.5, perCapitaIncome: 142000, crimeRatePer100k: 195 },
  { districtId: 4, name: 'Dakshina Kannada', povertyIndex: 11.5, populationDensity: 386, urbanizationRate: 47.8, unemploymentRate: 4.5, literacyRate: 88.6, perCapitaIncome: 265000, crimeRatePer100k: 312 },
  { districtId: 5, name: 'Kalaburagi', povertyIndex: 28.9, populationDensity: 232, urbanizationRate: 20.1, unemploymentRate: 9.3, literacyRate: 67.8, perCapitaIncome: 98000, crimeRatePer100k: 178 }
];

export const resourceDeployment = [
  { unitId: 1, unitName: 'Shivajinagar PS', districtId: 1, currentPatrol: 5, recommendedPatrol: 8, gap: -3, riskLevel: 'critical', hotspotDensity: 24, responseTime: 11.2, priorityScore: 92 },
  { unitId: 2, unitName: 'Indiranagar PS', districtId: 1, currentPatrol: 4, recommendedPatrol: 6, gap: -2, riskLevel: 'high', hotspotDensity: 18, responseTime: 9.8, priorityScore: 78 },
  { unitId: 3, unitName: 'Halasuru PS', districtId: 1, currentPatrol: 4, recommendedPatrol: 6, gap: -2, riskLevel: 'high', hotspotDensity: 16, responseTime: 10.5, priorityScore: 74 },
  { unitId: 4, unitName: 'Devaraja PS', districtId: 2, currentPatrol: 3, recommendedPatrol: 4, gap: -1, riskLevel: 'medium', hotspotDensity: 10, responseTime: 8.2, priorityScore: 58 },
  { unitId: 5, unitName: 'Lakshmipuram PS', districtId: 2, currentPatrol: 3, recommendedPatrol: 3, gap: 0, riskLevel: 'low', hotspotDensity: 7, responseTime: 7.5, priorityScore: 42 },
  { unitId: 6, unitName: 'Belagavi Town PS', districtId: 3, currentPatrol: 4, recommendedPatrol: 4, gap: 0, riskLevel: 'low', hotspotDensity: 6, responseTime: 8.9, priorityScore: 38 },
  { unitId: 7, unitName: 'Mangaluru South PS', districtId: 4, currentPatrol: 5, recommendedPatrol: 7, gap: -2, riskLevel: 'high', hotspotDensity: 22, responseTime: 12.1, priorityScore: 84 },
  { unitId: 8, unitName: 'Kalaburagi City PS', districtId: 5, currentPatrol: 3, recommendedPatrol: 3, gap: 0, riskLevel: 'low', hotspotDensity: 5, responseTime: 10.8, priorityScore: 32 }
];

export const crimeCategoryTrends = [
  { category: 'Property Offences', currentMonth: 147, historicalAvg: 98, trend: 'spiking', spikeRatio: 1.5, anomalyThreshold: 1.3 },
  { category: 'Cyber Crimes', currentMonth: 89, historicalAvg: 42, trend: 'spiking', spikeRatio: 2.12, anomalyThreshold: 1.3 },
  { category: 'Crimes Against Body', currentMonth: 56, historicalAvg: 62, trend: 'stable', spikeRatio: 0.9, anomalyThreshold: 1.3 },
  { category: 'Narcotics NDPS', currentMonth: 34, historicalAvg: 28, trend: 'stable', spikeRatio: 1.21, anomalyThreshold: 1.3 },
  { category: 'Public Nuisance', currentMonth: 72, historicalAvg: 45, trend: 'spiking', spikeRatio: 1.6, anomalyThreshold: 1.3 }
];

export const rawCrimesLog = [
    { id: 101, crimeNo: '10041202600001', registrationDate: '2026-07-01', crimeHeadName: 'Property Offences', crimeSubHeadName: 'Burglary by Night', unitName: 'Shivajinagar PS', districtName: 'Bengaluru Urban', districtId: 1, unitId: 1, caseStatusName: 'Under Investigation', gravity: '1', isAnomaly: true },
    { id: 102, crimeNo: '10041202600002', registrationDate: '2026-06-29', crimeHeadName: 'Cyber Crimes', crimeSubHeadName: 'Online Financial Fraud', unitName: 'Indiranagar PS', districtName: 'Bengaluru Urban', districtId: 1, unitId: 2, caseStatusName: 'Chargesheeted', gravity: '2', isAnomaly: false },
    { id: 103, crimeNo: '10042202600003', registrationDate: '2026-06-28', crimeHeadName: 'Crimes Against Body', crimeSubHeadName: 'Murder for Gain', unitName: 'Shivajinagar PS', districtName: 'Bengaluru Urban', districtId: 1, unitId: 1, caseStatusName: 'Under Investigation', gravity: '1', isAnomaly: false },
    { id: 104, crimeNo: '10043202600004', registrationDate: '2026-06-25', crimeHeadName: 'Property Offences', crimeSubHeadName: 'Vehicle Theft', unitName: 'Devaraja PS', districtName: 'Mysuru', districtId: 2, unitId: 4, caseStatusName: 'Disposed', gravity: '2', isAnomaly: false },
    { id: 105, crimeNo: '10044202600005', registrationDate: '2026-06-20', crimeHeadName: 'Narcotics NDPS', crimeSubHeadName: 'Cannabis/Ganja Possession', unitName: 'Mangaluru South PS', districtName: 'Dakshina Kannada', districtId: 4, unitId: 7, caseStatusName: 'Chargesheeted', gravity: '1', isAnomaly: true },
    { id: 106, crimeNo: '10045202600006', registrationDate: '2026-06-18', crimeHeadName: 'Cyber Crimes', crimeSubHeadName: 'Online Obscenity', unitName: 'Belagavi Town PS', districtName: 'Belagavi', districtId: 3, unitId: 6, caseStatusName: 'Under Investigation', gravity: '2', isAnomaly: false },
    { id: 107, crimeNo: '10046202600007', registrationDate: '2026-06-15', crimeHeadName: 'Property Offences', crimeSubHeadName: 'Theft (Other)', unitName: 'Kalaburagi City PS', districtName: 'Kalaburagi', districtId: 5, unitId: 8, caseStatusName: 'Disposed', gravity: '2', isAnomaly: false },
    { id: 108, crimeNo: '10041202600008', registrationDate: '2026-06-12', crimeHeadName: 'Property Offences', crimeSubHeadName: 'Burglary by Night', unitName: 'Halasuru PS', districtName: 'Bengaluru Urban', districtId: 1, unitId: 3, caseStatusName: 'Under Investigation', gravity: '1', isAnomaly: false }
];
