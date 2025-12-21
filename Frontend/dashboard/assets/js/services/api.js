// Data Service - Handle all data operations
import { mockData } from '../models/mockData.js';
import { ymd, parseYmd, monthIndex, yearOf, save, load } from '../utils/helpers.js';

// ============ READ OPERATIONS ============
export function getKPIs() {
  return mockData.kpis;
}

export function getMonthlyData(year) {
  return mockData.monthlyChangesByYear[year];
}

export function getHouseholds() {
  const stored = load('households', null);
  if (stored) return stored;
  const data = mockData.households;
  data.forEach(h => {
    if (!h.history) h.history = [];
  });
  return data;
}

export function getResidenceShare() {
  return mockData.residenceShare;
}

export function getGenderStats() {
  return mockData.genderCounts;
}

export function getAgeGroupStats() {
  return mockData.ageGroupCounts;
}

export function getEventStats(fromDate, toDate) {
  const from = typeof fromDate === 'string' ? parseYmd(fromDate) : fromDate;
  const to = typeof toDate === 'string' ? parseYmd(toDate) : toDate;
  let cur = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  let tam_tru = 0, tam_vang = 0;
  while (cur <= end) {
    const y = yearOf(cur), m = monthIndex(cur);
    const bucket = mockData.eventMonthly[y];
    if (bucket) {
      tam_tru += bucket.tam_tru[m] || 0;
      tam_vang += bucket.tam_vang[m] || 0;
    }
    cur.setMonth(cur.getMonth() + 1);
  }
  const total = tam_tru + tam_vang;
  return { tam_tru, tam_vang, total };
}

export function getProfile() {
  return load('userProfile', mockData.profile);
}

// ============ WRITE OPERATIONS ============
export function saveHouseholds(data) {
  save('households', data);
}

export function saveProfile(profile) {
  save('userProfile', profile);
}

export function addHousehold(household) {
  const households = getHouseholds();
  households.push(household);
  saveHouseholds(households);
  return household;
}

export function updateHousehold(soHK, updates) {
  const households = getHouseholds();
  const household = households.find(h => h.soHK === soHK);
  if (household) {
    Object.assign(household, updates);
    saveHouseholds(households);
  }
  return household;
}

export function deleteHousehold(soHK) {
  let households = getHouseholds();
  households = households.filter(h => h.soHK !== soHK);
  saveHouseholds(households);
}
