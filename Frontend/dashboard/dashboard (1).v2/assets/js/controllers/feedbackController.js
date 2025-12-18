// Feedback Controller - Feedback/complaints management
import { save, load } from '../utils/helpers.js';

let feedbackInited = false;
let allFeedback = [];
let feedbackPage = 1;

function getFeedbackStats() {
  const total = allFeedback.length;
  const pending = allFeedback.filter(f => f.status === 'pending').length;
  const processing = allFeedback.filter(f => f.status === 'processing').length;
  const resolved = allFeedback.filter(f => f.status === 'resolved').length;
  return { total, pending, processing, resolved };
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
  document.getElementById('satVeryHappy').textContent = stats.veryHappy;
  document.getElementById('satHappy').textContent = stats.happy;
  document.getElementById('satNeutral').textContent = stats.neutral;
  document.getElementById('satUnhappy').textContent = stats.unhappy;
  document.getElementById('avgSatisfaction').textContent = stats.avgSatisfaction + '/5';
  
  const ctx = document.getElementById('satisfactionChart');
  if (ctx && window.Chart) {
    if (window.satisfactionChartInstance) window.satisfactionChartInstance.destroy();
    window.satisfactionChartInstance = new Chart(ctx, {
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
    pending: { label: 'Chưa xử lý', color: '#ef4444' },
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
      <td><strong>${f.anonymous ? '(Ẩn danh)' : f.name}</strong></td>
      <td>${f.phone || '-'}</td>
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
  
  document.getElementById('detailName').textContent = feedback.anonymous ? '(Ẩn danh)' : feedback.name;
  document.getElementById('detailPhone').textContent = feedback.phone || '-';
  document.getElementById('detailAddr').textContent = feedback.addr || '-';
  document.getElementById('detailType').textContent = feedback.type;
  document.getElementById('detailAnon').textContent = feedback.anonymous ? 'Có' : 'Không';
  document.getElementById('detailDate').textContent = feedback.date;
  document.getElementById('detailStatus').innerHTML = getStatusBadge(feedback.status);
  document.getElementById('detailContent').textContent = feedback.content;
  
  document.getElementById('status_select').value = feedback.status;
  document.getElementById('feedback_note').value = feedback.processingNote || '';
  
  window.currentFeedback = feedback;
  
  const modal = document.getElementById('feedbackDetailModal');
  if (modal) modal.classList.add('is-open');
}

function closeFeedbackDetailModal() {
  const modal = document.getElementById('feedbackDetailModal');
  if (modal) modal.classList.remove('is-open');
}

function bindFeedbackModal() {
  document.getElementById('closeFeedbackDetailModal')?.addEventListener('click', closeFeedbackDetailModal);
  document.getElementById('closeFeedbackFormBtn')?.addEventListener('click', closeFeedbackDetailModal);
  
  document.getElementById('feedbackStatusForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = window.currentFeedback;
    if (!feedback) return;
    
    const newStatus = document.getElementById('status_select').value;
    const note = document.getElementById('feedback_note').value.trim();
    
    if (!newStatus) {
      alert('Vui lòng chọn trạng thái');
      return;
    }
    
    feedback.status = newStatus;
    feedback.processingNote = note;
    
    save('allFeedback', allFeedback);
    updateFeedbackStats();
    renderFeedbackTable();
    closeFeedbackDetailModal();
    alert('Cập nhật trạng thái thành công!');
  });
  
  document.getElementById('feedbackDetailModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('feedbackDetailModal')) closeFeedbackDetailModal();
  });
}

function updateFeedbackStats() {
  const stats = getFeedbackStats();
  document.getElementById('totalFeedback').textContent = stats.total;
  document.getElementById('pendingFeedback').textContent = stats.pending;
  document.getElementById('processingFeedback').textContent = stats.processing;
  document.getElementById('resolvedFeedback').textContent = stats.resolved;
  renderSatisfactionStats();
}

export function initFeedback() {
  // Always refresh data to prevent loss on page navigation
  allFeedback = load('allFeedback', [
    {id: '1', name: 'Trần Văn A', phone: '0912345678', addr: 'Số 5, Ngõ 1, La Khê', type: 'hạ tầng', content: 'Đường Ngõ 1 bị nứt nhiều, cần sửa chữa cấp tốc', anonymous: false, date: '18/11/2025', status: 'pending', processingNote: '', satisfaction: 3},
    {id: '2', name: 'Nguyễn Thị B', phone: '0987654321', addr: 'Số 12, Đường A', type: 'vệ sinh môi trường', content: 'Cần tăng cường vệ sinh tại khu vực sân chơi cộng đồng', anonymous: true, date: '17/11/2025', status: 'processing', processingNote: 'Đã lên kế hoạch vệ sinh', satisfaction: 4},
    {id: '3', name: 'Phạm Hữu C', phone: '0934567890', addr: 'Số 18, Phường La Khê', type: 'an ninh', content: 'Đèn chiếu sáng khu hẻm bị hỏng, gây mất an toàn', anonymous: false, date: '16/11/2025', status: 'resolved', processingNote: 'Đã sửa chữa', satisfaction: 5},
    {id: '4', name: 'Lê Văn D', phone: '0945678901', addr: 'Số 25, Đường B', type: 'thủ tục hành chính', content: 'Quy trình cấp giấy tờ rất phức tạp', anonymous: false, date: '15/11/2025', status: 'resolved', processingNote: 'Đã cải thiện quy trình', satisfaction: 4},
    {id: '5', name: 'Hoàng Thị E', phone: '0956789012', addr: 'Số 35, Đường C', type: 'khác', content: 'Cần bổ sung camera giám sát ở khu vực công cộng', anonymous: true, date: '14/11/2025', status: 'pending', processingNote: '', satisfaction: 5},
    {id: '6', name: 'Đỗ Văn F', phone: '0967890123', addr: 'Số 42, Đường D', type: 'hạ tầng', content: 'Hệ thống thoát nước bị tắc', anonymous: false, date: '13/11/2025', status: 'processing', processingNote: 'Đang sửa chữa', satisfaction: 2}
  ]);
  
  updateFeedbackStats();
  if (!feedbackInited) {
    bindFeedbackFilters();
    bindFeedbackModal();
    feedbackInited = true;
  }
  renderFeedbackTable();
}
