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

export async function getHouseholds() {
  try {
    const response = await fetch("http://localhost:3000/api/get/allHouseholds");
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error("Error fetching feedback stats: ", error);
    return null;
  }
}

export async function getResidenceShare() {
  try {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch('http://localhost:3000/api/statistics/dashboard', { method: 'GET', headers });
    if (!resp.ok) {
      try {
        const txt = await resp.text();
        console.warn('fetchResidenceShare failed', { status: resp.status, statusText: resp.statusText, body: txt.slice(0, 200) });
      } catch (e) {
        console.warn('fetchResidenceShare failed', { status: resp.status, statusText: resp.statusText });
      }
      return [
        { label: 'Thường trú', value: 0, color: '#3b82f6' },
        { label: 'Tạm trú', value: 0, color: '#22c55e' },
        { label: 'Tạm vắng', value: 0, color: '#f59e0b' }
      ];
    }

    const json = await resp.json();
    const rates = json?.data?.charts?.residentRates;
    if (!rates) return mockData.residenceShare;

    return [
      { label: 'Thường trú', value: Number(rates.ThuongTru || 0), color: '#3b82f6' },
      { label: 'Tạm trú', value: Number(rates.TamTru || 0), color: '#22c55e' },
      { label: 'Tạm vắng', value: Number(rates.TamVang || 0), color: '#f59e0b' }
    ];
  } catch (e) {
    console.warn('fetchResidenceShare error', e);
    return mockData.residenceShare;
  }
}

export async function getGenderStats() {
  try {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch('http://localhost:3000/api/statistics/dashboard', { method: 'GET', headers });
    if (!resp.ok) {
      try {
        const txt = await resp.text();
        console.warn('fetchGenderStats failed', { status: resp.status, statusText: resp.statusText, body: txt.slice(0, 200) });
      } catch (e) {
        console.warn('fetchGenderStats failed', { status: resp.status, statusText: resp.statusText });
      }
      return mockData.genderCounts;
    }

    const json = await resp.json();
    const gender = json?.data?.demographic?.gender;
    if (!gender) return mockData.genderCounts;

    const male = Number(gender.male || 0);
    const female = Number(gender.female || 0);
    const total = Number(gender.total || (male + female));
    return { male, female, total };
  } catch (e) {
    console.warn('fetchGenderStats error', e);
    return { male: 0, female: 0 };
  }
}

export async function getAgeGroupStats() {
  try {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch('http://localhost:3000/api/statistics/dashboard', { method: 'GET', headers });
    if (!resp.ok) {
      try {
        const txt = await resp.text();
        console.warn('fetchAgeGroupStats failed', { status: resp.status, statusText: resp.statusText, body: txt.slice(0, 200) });
      } catch (e) {
        console.warn('fetchAgeGroupStats failed', { status: resp.status, statusText: resp.statusText });
      }
      return {
        mamNon: 0, mauGiao: 0, cap1: 0, cap2: 0, cap3: 0, laoDong: 0, nghiHuu: 0,
      };
    }

    const json = await resp.json();
    const age = json?.data?.demographic?.age;
    if (!age) return {
      mamNon: 0, mauGiao: 0, cap1: 0, cap2: 0, cap3: 0, laoDong: 0, nghiHuu: 0,
    };

    return {
      mamNon: Number(age.mamNon || 0),
      mauGiao: Number(age.mauGiao || 0),
      cap1: Number(age.cap1 || 0),
      cap2: Number(age.cap2 || 0),
      cap3: Number(age.cap3 || 0),
      laoDong: Number(age.laoDong || 0),
      nghiHuu: Number(age.nghiHuu || 0)
    };
  } catch (e) {
    console.warn('fetchAgeGroupStats error', e);
    return {
      mamNon: 0, mauGiao: 0, cap1: 0, cap2: 0, cap3: 0, laoDong: 0, nghiHuu: 0,
    };
  }
}

export async function getEventStats(fromDate, toDate) {
  try {
    // 1. Lấy token bảo mật từ localStorage
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // 2. Xây dựng URL với Query Parameters
    // Lưu ý: Backend dùng 'startDate' và 'endDate'
    const params = new URLSearchParams();
    if (fromDate) params.append('startDate', fromDate);
    if (toDate) params.append('endDate', toDate);

    const url = `http://localhost:3000/api/statistics/dashboard${params.toString() ? '?' + params.toString() : ''
      }`;

    // 3. Thực hiện gọi API
    const resp = await fetch(url, {
      method: 'GET',
      headers
    });

    // 4. Kiểm tra phản hồi từ Server
    if (!resp.ok) {
      console.error(`Lỗi API: ${resp.status} - ${resp.statusText}`);
      return { tam_tru: 0, tam_vang: 0, total: 0 };
    }

    const json = await resp.json();

    /**
     * 5. Truy xuất dữ liệu (Mapping)
     * Cấu trúc Backend trả về: { success: true, data: { movement: { tamTru, tamVang, chuyenDi } } }
     */
    const mv = json?.data?.movement;

    if (!mv) {
      console.warn('Không tìm thấy dữ liệu movement trong phản hồi API');
      return { tam_tru: 0, tam_vang: 0, total: 0 };
    }

    // 6. Chuyển đổi dữ liệu để khớp với các Component hiển thị của Frontend
    // Backend trả về camelCase (tamTru), Frontend dùng snake_case (tam_tru)
    const tam_tru = Number(mv.tamTru || 0);
    const tam_vang = Number(mv.tamVang || 0);

    // Trả về Object đã được chuẩn hóa số liệu
    return {
      tam_tru,
      tam_vang,
      total: tam_tru + tam_vang // Tính tổng cộng để hiển thị trên Dashboard
    };

  } catch (error) {
    // 7. Xử lý lỗi ngoại lệ (Mất mạng, Crash...)
    console.error('Lỗi thực thi getEventStats:', error);
    // Trả về giá trị mặc định để giao diện không bị treo
    return { tam_tru: 0, tam_vang: 0, total: 0 };
  }
}

export function getProfile() {
  return load('userProfile', mockData.profile);
}


export async function getAbsentDashboardData() {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  // URL mới: /api/manageabsent/dashboard
  const response = await fetch('http://localhost:3000/api/manageabsent/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Không thể lấy dữ liệu tạm vắng');
  return await response.json();
}

export async function getResidentDashboardData() {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/residentManage/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Không thể lấy dữ liệu nhân khẩu');
  return await response.json();
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

export async function updateResidentData(id, data) {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/api/residentManage/update/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể cập nhật thông tin nhân khẩu');
  }

  return await response.json();
}
