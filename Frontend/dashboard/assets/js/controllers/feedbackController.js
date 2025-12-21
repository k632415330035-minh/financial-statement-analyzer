// Feedback Controller - Feedback/complaints management
import { save, load } from '../utils/helpers.js';

let feedbackInited = false;
let feedbackFiltersBound = false;
let feedbackDetailBound = false;
let allFeedback = [];
let feedbackPage = 1;

function getFeedbackStats() {
  const total = allFeedback.length;
  const processing = allFeedback.filter(f => f.status === 'pending' || f.status === 'processing').length;
  const resolved = allFeedback.filter(f => f.status === 'resolved').length;
  return { total, processing, resolved };
}

function getSatisfactionStats() {
  const veryHappy = allFeedback.filter(f => f.satisfaction === 5).length;
  const happy = allFeedback.filter(f => f.satisfaction === 4).length;
  const neutral = allFeedback.filter(f => f.satisfaction === 3).length;
  const unhappy = allFeedback.filter(f => f.satisfaction <= 2).length;
  const total = allFeedback.length;
  const avgSatisfaction = total > 0 ? (allFeedback.reduce((sum, f) => sum + (f.satisfaction || 3), 0) / total).toFixed(2) : 0;
  return { veryHappy, happy, neutral, unhappy, total, avgSatisfaction };
}

function renderSatisfactionStats() {
  const stats = getSatisfactionStats();
  const satVeryHappy = document.getElementById('satVeryHappy');
  const satHappy = document.getElementById('satHappy');
  const satNeutral = document.getElementById('satNeutral');
  const satUnhappy = document.getElementById('satUnhappy');
  const avgSatisfaction = document.getElementById('avgSatisfaction');
  const satisfactionChart = document.getElementById('satisfactionChart');
  
  if (satVeryHappy) satVeryHappy.textContent = stats.veryHappy;
  if (satHappy) satHappy.textContent = stats.happy;
  if (satNeutral) satNeutral.textContent = stats.neutral;
  if (satUnhappy) satUnhappy.textContent = stats.unhappy;
  if (avgSatisfaction) avgSatisfaction.textContent = stats.avgSatisfaction + '/5';
  
  if (satisfactionChart && window.Chart) {
    if (window.satisfactionChartInstance) window.satisfactionChartInstance.destroy();
    window.satisfactionChartInstance = new Chart(satisfactionChart, {
      type: 'doughnut',
      data: {
        labels: ['😍 Rất hài lòng (5)', '😊 Hài lòng (4)', '😐 Bình thường (3)', '😞 Không hài lòng (1-2)'],
        datasets: [{
          data: [stats.veryHappy, stats.happy, stats.neutral, stats.unhappy],
          backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } } }
      }
    });
  }
}

function filterFeedback(q, typeFilter = '', statusFilter = '') {
  q = q.trim().toLowerCase();
  return allFeedback.filter(f => {
    const matchSearch = !q || f.name.toLowerCase().includes(q) || (f.phone && f.phone.includes(q));
    const matchType = !typeFilter || f.type === typeFilter;
    const matchStatus = !statusFilter || f.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });
}

function getStatusBadge(status) {
  const statusMap = {
    pending: { label: 'Đang xử lý', color: '#f59e0b' },
    processing: { label: 'Đang xử lý', color: '#f59e0b' },
    resolved: { label: 'Đã xử lý', color: '#22c55e' }
  };
  const s = statusMap[status] || { label: status, color: '#64748b' };
  return `<span style="background:${s.color};color:white;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">${s.label}</span>`;
}

function renderFeedbackTable() {
  const search = document.getElementById('feedbackSearch')?.value || '';
  const typeFilter = document.getElementById('feedbackTypeFilter')?.value || '';
  const statusFilter = document.getElementById('feedbackStatusFilter')?.value || '';
  
  const filtered = filterFeedback(search, typeFilter, statusFilter);
  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  feedbackPage = Math.min(feedbackPage, totalPages);
  
  const tbody = document.querySelector('#feedbackTable tbody');
  if (tbody) {
    const slice = filtered.slice((feedbackPage - 1) * PAGE_SIZE, (feedbackPage - 1) * PAGE_SIZE + PAGE_SIZE);
    tbody.innerHTML = slice.map((f, i) => `<tr>
      <td>${(feedbackPage - 1) * PAGE_SIZE + i + 1}</td>
      <td><strong>${f.name}</strong></td>
      <td><span style="background:#f0f0f0;padding:4px 8px;border-radius:4px;font-size:12px;">${f.type}</span></td>
      <td>${getStatusBadge(f.status)}</td>
      <td style="font-size:12px;color:var(--muted);">${f.date}</td>
      <td><button class="btn-view" data-fbid="${f.id}" style="font-size:12px;padding:6px 10px;">👁 Xem</button></td>
    </tr>`).join('');
  }
  
  const empty = document.getElementById('emptyStateFeedback');
  if (empty) empty.style.display = filtered.length === 0 ? 'block' : 'none';
  
  const pi = document.getElementById('pageInfoFeedback');
  if (pi) pi.textContent = `Trang ${feedbackPage}/${totalPages} (${filtered.length} kết quả)`;
  
  const prev = document.getElementById('prevPageFeedback'), next = document.getElementById('nextPageFeedback');
  if (prev) {
    prev.disabled = feedbackPage <= 1;
    prev.onclick = () => { if (feedbackPage > 1) { feedbackPage--; renderFeedbackTable(); } };
  }
  if (next) {
    next.disabled = feedbackPage >= totalPages;
    next.onclick = () => { if (feedbackPage < totalPages) { feedbackPage++; renderFeedbackTable(); } };
  }
  
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => openFeedbackDetailModal(btn.dataset.fbid));
  });
}

function bindFeedbackFilters() {
  if (feedbackFiltersBound) return;
  feedbackFiltersBound = true;
  
  const search = document.getElementById('feedbackSearch');
  const typeFilter = document.getElementById('feedbackTypeFilter');
  const statusFilter = document.getElementById('feedbackStatusFilter');
  const prev = document.getElementById('prevPageFeedback');
  const next = document.getElementById('nextPageFeedback');
  
  const onFilterChange = () => { feedbackPage = 1; renderFeedbackTable(); };
  
  search?.addEventListener('input', onFilterChange);
  typeFilter?.addEventListener('change', onFilterChange);
  statusFilter?.addEventListener('change', onFilterChange);
}

function openFeedbackDetailModal(feedbackId) {
  const feedback = allFeedback.find(f => f.id === feedbackId);
  if (!feedback) return;
  
  document.getElementById('detailName').textContent = feedback.name;
  document.getElementById('detailPhone').textContent = feedback.phone || '-';
  document.getElementById('detailAddr').textContent = feedback.addr || '-';
  document.getElementById('detailType').textContent = feedback.type;
  document.getElementById('detailDate').textContent = feedback.date;
  document.getElementById('detailStatus').innerHTML = getStatusBadge(feedback.status);
  document.getElementById('detailContent').textContent = feedback.content;
  
  document.getElementById('feedback_note').value = '';
  
  // Render history
  const historyDiv = document.getElementById('feedbackHistory');
  if (historyDiv) {
    if (!feedback.history || feedback.history.length === 0) {
      historyDiv.innerHTML = '<p style="color:var(--muted);margin:0;">Chưa có lịch sử xử lý</p>';
    } else {
      historyDiv.innerHTML = feedback.history.map(h => `
        <div style="border-bottom:1px solid #e2e8f0;padding:8px 0;margin-bottom:8px;">
          <div style="font-weight:600;color:#1e293b;margin-bottom:2px;">${h.timestamp} - ${h.user}</div>
          <div style="color:#64748b;">${h.note}</div>
        </div>
      `).join('');
    }
  }
  
  window.currentFeedback = feedback;
  
  const modal = document.getElementById('feedbackDetailModal');
  if (modal) modal.classList.add('is-open');
}

function closeFeedbackDetailModal() {
  const modal = document.getElementById('feedbackDetailModal');
  if (modal) modal.classList.remove('is-open');
}

function bindFeedbackModal() {
  if (feedbackDetailBound) return;
  feedbackDetailBound = true;
  
  document.getElementById('closeFeedbackDetailModal')?.addEventListener('click', closeFeedbackDetailModal);
  document.getElementById('closeFeedbackFormBtn')?.addEventListener('click', closeFeedbackDetailModal);
  
  document.getElementById('feedbackStatusForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = window.currentFeedback;
    if (!feedback) return;
    
    const note = document.getElementById('feedback_note').value.trim();
    if (!note) {
      alert('Vui lòng nhập ghi chú xử lý');
      return;
    }
    
    // Add to history
    if (!feedback.history) feedback.history = [];
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const user = 'Admin'; // In reality this would be the logged-in user
    
    feedback.history.push({
      timestamp: timestamp,
      user: user,
      note: note
    });
    
    save('allFeedback', allFeedback);
    updateFeedbackStats();
    renderFeedbackTable();
    
    // Re-open modal to show updated history
    openFeedbackDetailModal(feedback.id);
    alert('Lưu ghi chú xử lý thành công!');
  });
  
  document.getElementById('feedbackDetailModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('feedbackDetailModal')) closeFeedbackDetailModal();
  });
}

function updateFeedbackStats() {
  const stats = getFeedbackStats();
  document.getElementById('totalFeedback').textContent = stats.total;
  document.getElementById('processingFeedback').textContent = stats.processing;
  document.getElementById('resolvedFeedback').textContent = stats.resolved;
  renderSatisfactionStats();
}

export function initFeedback() {
  // Reset flags to rebind on each visit
  feedbackFiltersBound = false;
  feedbackDetailBound = false;
  
  // Always refresh data to prevent loss on page navigation
  allFeedback = load('allFeedback', [
    {id: '1', name: 'Trần Văn A', phone: '0912345678', addr: 'Số 5, Ngõ 1, La Khê', type: 'hạ tầng', content: 'Đường Ngõ 1 bị nứt nhiều, cần sửa chữa cấp tốc', date: '18/11/2025', status: 'processing', history: [{timestamp: '19/11/2025 09:30', user: 'Admin', note: 'Đã ghi nhận, lên kế hoạch sửa chữa'}], satisfaction: 3},
    {id: '2', name: 'Nguyễn Thị B', phone: '0987654321', addr: 'Số 12, Đường A', type: 'vệ sinh môi trường', content: 'Cần tăng cường vệ sinh tại khu vực sân chơi cộng đồng', date: '17/11/2025', status: 'processing', history: [{timestamp: '18/11/2025 10:15', user: 'Admin', note: 'Đã lên kế hoạch vệ sinh'}], satisfaction: 4},
    {id: '3', name: 'Phạm Hữu C', phone: '0934567890', addr: 'Số 18, Phường La Khê', type: 'an ninh', content: 'Đèn chiếu sáng khu hẻm bị hỏng, gây mất an toàn', date: '16/11/2025', status: 'resolved', history: [{timestamp: '17/11/2025 14:00', user: 'Admin', note: 'Đã sửa chữa đèn'}, {timestamp: '17/11/2025 16:30', user: 'Admin', note: 'Kiểm tra lại, hoạt động bình thường'}], satisfaction: 5},
    {id: '4', name: 'Lê Văn D', phone: '0945678901', addr: 'Số 25, Đường B', type: 'thủ tục hành chính', content: 'Quy trình cấp giấy tờ rất phức tạp', date: '15/11/2025', status: 'resolved', history: [{timestamp: '16/11/2025 11:00', user: 'Admin', note: 'Đã cải thiện quy trình'}, {timestamp: '16/11/2025 15:45', user: 'Admin', note: 'Thông báo quy trình mới cho cư dân'}], satisfaction: 4},
    {id: '5', name: 'Hoàng Thị E', phone: '0956789012', addr: 'Số 35, Đường C', type: 'khác', content: 'Cần bổ sung camera giám sát ở khu vực công cộng', date: '14/11/2025', status: 'processing', history: [{timestamp: '15/11/2025 09:20', user: 'Admin', note: 'Đang xin kinh phí bổ sung camera'}], satisfaction: 5},
    {id: '6', name: 'Đỗ Văn F', phone: '0967890123', addr: 'Số 42, Đường D', type: 'hạ tầng', content: 'Hệ thống thoát nước bị tắc', date: '13/11/2025', status: 'processing', history: [{timestamp: '14/11/2025 08:00', user: 'Admin', note: 'Đã liên hệ thợ sửa'}, {timestamp: '14/11/2025 13:30', user: 'Admin', note: 'Đang tiến hành sửa chữa'}], satisfaction: 2}
  ]);
  
  updateFeedbackStats();
  if (!feedbackInited) {
    bindFeedbackFilters();
    bindFeedbackModal();
    feedbackInited = true;
  }
  renderFeedbackTable();
}
