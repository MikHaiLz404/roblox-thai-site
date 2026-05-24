// ================================
// Roblox School — Dev Diary
// App JavaScript
// ================================

// Content data extracted from markdown files
const contentData = [
  // EPISODES
  {
    type: 'ep',
    typeLabel: 'EP',
    title: '[EP.01] แนะนำโปรเจค: ทำไมถึงเลือกทำเกมบน Roblox',
    desc: 'ตัดสินใจเลือก Roblox Studio แทน Unity/Unreal หรือ Godot เพราะ Solo dev friendly, ตลาดไทย และ Luau scripting ที่ใช้ง่าย',
    date: '2026-05-21',
    path: 'content/ep01_intro.md',
    updatedRecently: false
  },
  {
    type: 'ep',
    typeLabel: 'EP',
    title: '[EP.02] Core Loop — คิดยังไง',
    desc: 'วาง core loop แรกของเกม: Collect → Level Up → Unlock เขียน code ระบบ collection + inventory แบบง่าย',
    date: '2026-05-22',
    path: 'content/ep02_core_loop.md',
    updatedRecently: true
  },
  {
    type: 'ep',
    typeLabel: 'EP',
    title: '[EP.03] ระบบตัวละคร + Animation Pipeline',
    desc: 'ทำ character model, rigging, และ animation pipeline — สร้าง ผู้เล่นเดิน วิ่ง กระโดด และ attack animations',
    date: '2026-05-22',
    path: 'content/ep03_character_animation.md',
    updatedRecently: true
  },
  {
    type: 'ep',
    typeLabel: 'EP',
    title: '[EP.04] ระบบ Inventory ครั้งแรก + สิ่งที่ผิดพลาด',
    desc: 'สร้าง inventory system ครั้งแรก พร้อม lessons learned จากความผิดพลาดในการออกแบบ data structure',
    date: '2026-05-22',
    path: 'content/ep04_inventory.md',
    updatedRecently: false
  },

  // TUTORIALS
  {
    type: 'tut',
    typeLabel: 'Tutorial',
    title: '[TUT.01] State Machine สำหรับ NPC Behavior',
    desc: 'สร้าง NPC behavior system ด้วย State Machine pattern — รองรับ Idle, Patrol, Chase, Attack states',
    date: '2026-05-22',
    path: 'content/tut01_state_machine.md',
    updatedRecently: true
  },
  {
    type: 'tut',
    typeLabel: 'Tutorial',
    title: '[TUT.02] DataStore 101 — Save/Load ข้อมูลผู้เล่น',
    desc: 'สอนวิธี save/load player data ด้วย Roblox DataStoreService — inventory, stats, position',
    date: '2026-05-22',
    path: 'content/tut02_datastore.md',
    updatedRecently: false
  },

  // TIPS
  {
    type: 'tip',
    typeLabel: 'Tip',
    title: '[TIP.01] Lua Basics — เริ่มต้นกับ Luau',
    desc: 'พื้นฐาน Lua/Luau สำหรับคนที่มาจาก Python หรือ JavaScript — syntax, types, functions',
    date: '2026-05-21',
    path: 'content/tip01_lua_basics.md',
    updatedRecently: false
  },
  {
    type: 'tip',
    typeLabel: 'Tip',
    title: '[TIP.02] RemoteEvents ทำงานยังไง',
    desc: 'เข้าใจ Client-Server communication ด้วย RemoteEvents — ส่งข้อมูลระหว่าง client กับ server',
    date: '2026-05-22',
    path: 'content/tip02_remote_events.md',
    updatedRecently: false
  },
  {
    type: 'tip',
    typeLabel: 'Tip',
    title: '[TIP.03] State Machine พื้นฐานใน 5 นาที',
    desc: 'สร้าง simple state machine สำหรับ player movement states — ง่ายๆ ใช้ dictionary และ if-else',
    date: '2026-05-22',
    path: 'content/tip03_state_machine.md',
    updatedRecently: false
  },
  {
    type: 'tip',
    typeLabel: 'Tip',
    title: '[TIP.04] DataStore Basics — หลักการที่ควรรู้',
    desc: 'หลักการสำคัญของ Roblox DataStore — ทำยังไงให้ไม่ lose data, รู้จัก GetAsync/SetAsync',
    date: '2026-05-22',
    path: 'content/tip04_datastore.md',
    updatedRecently: false
  }
];

// Current share target
let currentShareContent = null;

// Format date to Thai format
function formatDate(dateStr) {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

// Render content cards
function renderCards() {
  const episodesGrid = document.getElementById('episodesGrid');
  const tutorialsGrid = document.getElementById('tutorialsGrid');
  const tipsGrid = document.getElementById('tipsGrid');

  if (!episodesGrid) return;

  // Clear grids
  episodesGrid.innerHTML = '';
  tutorialsGrid.innerHTML = '';
  tipsGrid.innerHTML = '';

  contentData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.dataset.type = item.type;
    card.dataset.title = item.title.toLowerCase();
    card.dataset.desc = item.desc.toLowerCase();

    let badgeHtml = '';
    if (item.updatedRecently) {
      badgeHtml = '<span class="updated-badge">อัปเดตล่าสุด</span>';
    }

    let shareBtnHtml = `<button class="share-btn" onclick="openShareModal('${item.title}', event)">แชร์</button>`;

    card.innerHTML = `
      ${badgeHtml}
      <span class="card-type ${item.type}">${item.typeLabel}</span>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="card-meta">
        <span class="card-date">📅 ${formatDate(item.date)}</span>
      </div>
      ${shareBtnHtml}
    `;

    if (item.type === 'ep') {
      episodesGrid.appendChild(card);
    } else if (item.type === 'tut') {
      tutorialsGrid.appendChild(card);
    } else if (item.type === 'tip') {
      tipsGrid.appendChild(card);
    }
  });

  // Update badges
  const epCount = contentData.filter(i => i.type === 'ep').length;
  const tutCount = contentData.filter(i => i.type === 'tut').length;
  const tipCount = contentData.filter(i => i.type === 'tip').length;

  document.getElementById('epBadge').textContent = `${epCount} บท`;
  document.getElementById('tutBadge').textContent = `${tutCount} บท`;
  document.getElementById('tipsBadge').textContent = `${tipCount} บท`;
}

// Update progress bar
function updateProgress() {
  const total = contentData.length;
  // Count how many are "published" (we have all of them as done)
  const published = total; // For demo, all are published
  const percent = Math.round((published / total) * 100);

  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('progressPercent').textContent = `${percent}%`;
  document.getElementById('epCount').textContent = `${contentData.filter(i => i.type === 'ep').length}/${contentData.filter(i => i.type === 'ep').length}`;
  document.getElementById('tutCount').textContent = `${contentData.filter(i => i.type === 'tut').length}/${contentData.filter(i => i.type === 'tut').length}`;
  document.getElementById('tipCount').textContent = `${contentData.filter(i => i.type === 'tip').length}/${contentData.filter(i => i.type === 'tip').length}`;
}

// Filter content by search
function filterContent() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.content-card');
  let visibleCount = 0;

  // Update clear button
  const clearBtn = document.getElementById('searchClear');
  if (query.length > 0) {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  // Update result count
  updateSearchCount(query.length);

  cards.forEach(card => {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const match = title.includes(query) || desc.includes(query);
    if (match) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Show no results message
  let noResults = document.getElementById('noResults');
  if (visibleCount === 0 && query.length > 0) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.id = 'noResults';
      noResults.className = 'no-results';
      noResults.innerHTML = `<p>❌ ไม่พบ '"${query}"' — ลองค้นด้วยคำอื่น</p>`;
      document.querySelector('.main-content .container').appendChild(noResults);
    }
    noResults.style.display = 'block';
  } else if (noResults) {
    noResults.style.display = 'none';
  }
}

// Clear search
function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  filterContent();
  input.focus();
}

// Show search result count
function updateSearchCount(queryLen) {
  let countEl = document.getElementById('searchCount');
  if (queryLen === 0) {
    if (countEl) countEl.remove();
    return;
  }
  if (!countEl) {
    countEl = document.createElement('span');
    countEl.id = 'searchCount';
    countEl.style.cssText = `
      position: absolute; right: 70px; font-size: 0.75rem;
      color: var(--accent); pointer-events: none; z-index: 2;
    `;
    document.querySelector('.nav-search').appendChild(countEl);
  }
  const visible = document.querySelectorAll('.content-card:not(.hidden)').length;
  countEl.textContent = `${visible} ผลลัพธ์`;
}

// Quick start flow
function showQuickStart(type) {
  const result = document.getElementById('quickStartResult');
  let content = '';

  switch(type) {
    case 'beginner':
      content = `
        <h4>🌱 เริ่มต้นที่นี่!</h4>
        <p>ถ้าคุณเพิ่งเริ่ม — แนะนำให้อ่านตามลำดับนี้:</p>
        <ol style="margin: 12px 0; padding-left: 20px; color: var(--text-secondary);">
          <li><a href="#episodes">EP.01 — แนะนำโปรเจค</a> (เริ่มต้นที่นี่)</li>
          <li><a href="#tips">TIP.01 — Lua Basics</a> (พื้นฐานการเขียน code)</li>
          <li><a href="#episodes">EP.02 — Core Loop</a> (วางระบบเกม)</li>
          <li><a href="#tutorials">TUT.01 — State Machine</a> (เทคนิคขั้นสูง)</li>
        </ol>
      `;
      break;
    case 'learn':
      content = `
        <h4>📚 ลำดับการเรียนรู้</h4>
        <p>เรียนตาม roadmap นี้:</p>
        <ol style="margin: 12px 0; padding-left: 20px; color: var(--text-secondary);">
          <li><a href="#tips">TIP.01 — Lua Basics</a></li>
          <li><a href="#tips">TIP.02 — RemoteEvents</a></li>
          <li><a href="#tutorials">TUT.01 — State Machine</a></li>
          <li><a href="#tutorials">TUT.02 — DataStore</a></li>
          <li><a href="#episodes">EP.02-04 — Devlogs</a> (ดูตัวอย่างจริง)</li>
        </ol>
      `;
      break;
    case 'inspire':
      content = `
        <h4>💡 อ่าน Devlogs ล่าสุด</h4>
        <p>อ่านเรื่องราวการพัฒนาจริง:</p>
        <ul style="margin: 12px 0; padding-left: 20px; color: var(--text-secondary);">
          <li><a href="#episodes">EP.03 — ระบบตัวละคร + Animation</a> (ล่าสุด)</li>
          <li><a href="#episodes">EP.02 — Core Loop</a></li>
          <li><a href="#episodes">EP.01 — แนะนำโปรเจค</a></li>
        </ul>
      `;
      break;
  }

  result.innerHTML = content;
  result.classList.add('active');
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Social share modal
function openShareModal(title, event) {
  event.stopPropagation();
  currentShareContent = title;
  document.getElementById('socialShare').classList.add('active');
}

function closeShareModal() {
  document.getElementById('socialShare').classList.remove('active');
  currentShareContent = null;
}

function shareToTwitter() {
  if (!currentShareContent) return;
  const text = encodeURIComponent(`📖 ${currentShareContent} — อ่านเพิ่มเติมที่`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook() {
  if (!currentShareContent) return;
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToLinkedIn() {
  if (!currentShareContent) return;
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

// Newsletter handler
function handleNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  alert(`✅ สมัครสำเร็จ! จะส่ง Devlog ไปที่ ${email}`);
  event.target.reset();
}

// Back to top button visibility
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTopBtn');
  if (window.scrollY > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  updateProgress();

  // Search input - live filter on every keystroke
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterContent);

    // Focus search on "/" key press (when not already in an input)
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      // Escape clears search
      if (e.key === 'Escape') {
        clearSearch();
      }
    });
  }
});

