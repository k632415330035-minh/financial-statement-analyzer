// Utils - Helper Functions

export function debounce(fn, wait = 250) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
}

export function save(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

export function load(k, d = null) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
}

export function ymd(d) {
  return d.toISOString().slice(0, 10);
}

export function parseYmd(s) {
  const [Y, M, D] = s.split('-').map(Number);
  return new Date(Y, M - 1, D);
}

export function monthIndex(d) {
  return d.getMonth();
}

export function yearOf(d) {
  return d.getFullYear();
}

export function getStatusBadge(status) {
  const statusMap = {
    pending: { label: 'Chưa xử lý', color: '#ef4444' },
    processing: { label: 'Đang xử lý', color: '#f59e0b' },
    resolved: { label: 'Đã xử lý', color: '#22c55e' }
  };
  const s = statusMap[status] || { label: status, color: '#64748b' };
  return `<span style="background:${s.color};color:white;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">${s.label}</span>`;
}

export function getActiveDays(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const today = new Date(ymd(new Date()));
  const diffTime = Math.max(0, to.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
