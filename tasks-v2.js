// ============================================================
// CENTURY OPS — PHASE 6: SMART TASK TEMPLATE SYSTEM
// tasks-v2.js
// Drop this into the Century Ops repo and call initTasksV2()
// after the page loads. Replaces the old task template logic.
// ============================================================

// ─────────────────────────────────────────────
// 1. TASK TEMPLATE LIBRARY
// ─────────────────────────────────────────────

const TASK_TEMPLATES = {

  tearoff: {
    label: 'Tear-Off',
    questions: [
      { id: 'plywood', text: 'Plywood needed?', options: ['Yes', 'No', 'Unknown – assess on site'] },
      { id: 'dumpster', text: 'Dumpster needed?', options: ['Yes', 'No'] },
      { id: 'solar_rnr', text: 'Solar R&R permit needed?', options: ['Yes', 'No'] },
    ],
    buildTasks(answers) {
      const t = [
        { text: 'Materials ordered', critical: true },
        { text: 'Permit pulled', critical: true },
      ];
      if (answers.solar_rnr === 'Yes') {
        t.push({ text: 'Solar R&R permit pulled', critical: true, conditional: 'solar_rnr' });
      }
      if (answers.plywood === 'Yes' || answers.plywood === 'Unknown – assess on site') {
        t.push({ text: 'Plywood in inventory', critical: true, conditional: 'plywood', note: answers.plywood === 'Unknown – assess on site' ? 'Confirm on site' : '' });
      }
      if (answers.dumpster === 'Yes') {
        t.push({ text: 'Dumpster scheduled', conditional: 'dumpster' });
      }
      t.push(
        { text: 'Toilet ordered' },
        { text: 'Tear-off complete', critical: true },
        { text: 'Dry-rot / Repairs complete' },
        { text: 'Tear-off inspection complete', critical: true },
      );
      if (answers.plywood === 'Yes' || answers.plywood === 'Unknown – assess on site') {
        t.push(
          { text: 'Plywood complete', critical: true, conditional: 'plywood' },
          { text: 'Plywood inspection complete', critical: true, conditional: 'plywood' },
        );
      }
      t.push(
        { text: 'Dry-in / Felt installed', critical: true },
        { text: 'Final cleanup' },
        { text: 'Inspection passed', critical: true },
        { text: 'Invoice sent', critical: true },
      );
      return t;
    }
  },

  solar: {
    label: 'Solar',
    questions: [
      { id: 'msu', text: 'Main Service Upgrade (MSU) included?', options: ['Yes', 'No'] },
      { id: 'battery', text: 'Battery storage included?', options: ['Yes', 'No'] },
    ],
    buildTasks(answers) {
      const t = [
        { text: 'Site survey complete', critical: true },
        { text: 'Plan set ordered / Gene', critical: true },
        { text: 'Permit pulled', critical: true },
        { text: 'Materials ordered', critical: true },
        { text: 'Materials delivered', critical: true },
      ];
      if (answers.msu === 'Yes') {
        t.push(
          { text: 'Service upgrade request — PG&E', critical: true, conditional: 'msu' },
          { text: 'Grounding complete', critical: true, conditional: 'msu' },
          { text: 'Meter release inspection', critical: true, conditional: 'msu' },
        );
      }
      t.push(
        { text: 'Roof penetrations complete', critical: true },
        { text: 'Racking installed', critical: true },
        { text: 'Panels installed', critical: true },
      );
      if (answers.battery === 'Yes') {
        t.push({ text: 'Batteries installed', critical: true, conditional: 'battery' });
      }
      t.push({ text: 'Electrical rough-in', critical: true });
      if (answers.msu === 'Yes') {
        t.push({ text: 'Cut and Swing — PG&E', critical: true, conditional: 'msu' });
      }
      t.push(
        { text: 'Inspection passed', critical: true },
        { text: 'System activated', critical: true },
        { text: 'Invoice sent', critical: true },
        { text: 'Toilet picked up' },
        { text: 'Utility interconnect application', critical: true },
      );
      return t;
    }
  },

  electrical: {
    label: 'Electrical',
    questions: [
      { id: 'msu', text: 'Main Service Upgrade (MSU) included?', options: ['Yes', 'No'] },
    ],
    buildTasks(answers) {
      const t = [];
      if (answers.msu === 'Yes') {
        t.push(
          { text: 'Service upgrade request — PG&E', critical: true, conditional: 'msu' },
          { text: 'Grounding complete', critical: true, conditional: 'msu' },
          { text: 'Meter release inspection', critical: true, conditional: 'msu' },
        );
      }
      t.push(
        { text: 'Scope confirmed', critical: true },
        { text: 'Permit pulled', critical: true },
        { text: 'Materials ordered', critical: true },
        { text: 'Rough-in complete', critical: true },
        { text: 'Inspection passed', critical: true },
        { text: 'Final trim complete', critical: true },
        { text: 'Final inspection passed', critical: true },
      );
      if (answers.msu === 'Yes') {
        t.push({ text: 'Cut and Swing — PG&E', critical: true, conditional: 'msu' });
      }
      t.push(
        { text: 'Toilet picked up' },
        { text: 'Invoice sent', critical: true },
      );
      return t;
    }
  },

  roof: {
    label: 'Roof Installation',
    questions: [
      {
        id: 'material',
        text: 'Roof material?',
        options: ['Shingle', 'Tile', 'CertainTeed Presidential / Presidential TL', 'IB / Duro-Last', 'Other']
      },
      { id: 'gutters', text: 'New gutters in scope?', options: ['Yes', 'No'] },
      { id: 'fireplace', text: 'Fireplace or skylight flashings?', options: ['Yes', 'No'] },
      { id: 'stucco', text: 'Stucco patching needed?', options: ['Yes', 'No'] },
    ],
    buildTasks(answers) {
      // Lead time note
      const leadTimeMap = {
        'Shingle': '⚠️ Order materials 1 month before start date',
        'Tile': '⚠️ Order materials 2 months before start date. Confirm EBS in yard. Check if Walkaflex needed.',
        'CertainTeed Presidential / Presidential TL': '⚠️ Order materials 2 months before start date',
        'IB / Duro-Last': '⚠️ Order materials 2 weeks before start date',
        'Other': '',
      };
      const leadNote = leadTimeMap[answers.material] || '';

      const t = [
        { text: 'Permit pulled', critical: true },
        { text: 'Materials ordered', critical: true, note: leadNote },
      ];

      if (answers.material === 'Tile') {
        t.push(
          { text: 'Confirm EBS in yard', conditional: 'tile', critical: true },
          { text: 'Confirm Walkaflex order if needed', conditional: 'tile' },
        );
      }

      t.push(
        { text: 'Underlayment installed', critical: true },
        { text: 'In-progress inspection complete', critical: true },
      );

      if (answers.gutters === 'Yes') {
        t.push({ text: 'New gutters installed', conditional: 'gutters' });
      }
      if (answers.fireplace === 'Yes') {
        t.push({ text: 'Fireplace / skylight flashings installed', conditional: 'fireplace' });
      }
      if (answers.stucco === 'Yes') {
        t.push({ text: 'Stucco patched at fireplace and walls', conditional: 'stucco' });
      }

      t.push(
        { text: 'Roof-to-wall metal installed', critical: true },
        { text: 'Tile / shingle installed', critical: true },
        { text: 'Ridge and flashing complete', critical: true },
        { text: 'Final cleanup' },
        { text: 'Inspection passed', critical: true },
        { text: 'Toilet picked up' },
        { text: 'Invoice sent', critical: true },
      );
      return t;
    }
  },

  gutters: {
    label: 'Gutters',
    questions: [],
    buildTasks() {
      return [
        { text: 'Measurements confirmed', critical: true, note: '⚠️ Order materials 2 weeks before start' },
        { text: 'Materials ordered', critical: true },
        { text: 'Old gutters removed' },
        { text: 'New gutters installed', critical: true },
        { text: 'Gutter screens installed' },
        { text: 'Downspouts complete', critical: true },
        { text: 'Water test passed', critical: true },
        { text: 'Final cleanup' },
        { text: 'Toilet picked up' },
        { text: 'Invoice sent', critical: true },
      ];
    }
  },

  repair: {
    label: 'Repair',
    questions: [
      { id: 'permit', text: 'Permit needed?', options: ['Yes', 'No', 'Unknown – assess on site'] },
    ],
    buildTasks(answers) {
      const t = [
        { text: 'Damage assessed', critical: true },
      ];
      if (answers.permit === 'Yes' || answers.permit === 'Unknown – assess on site') {
        t.push(
          { text: 'Permit needed? — confirm', conditional: 'permit', note: answers.permit === 'Unknown – assess on site' ? 'Confirm after assessment' : '' },
          { text: 'Permit pulled', critical: true, conditional: 'permit' },
        );
      }
      t.push(
        { text: 'Materials ordered', critical: true },
        { text: 'Confirm yard materials' },
        { text: 'Repair complete', critical: true },
        { text: 'Water test', critical: true },
        { text: 'Photos taken', critical: true },
        { text: 'Final cleanup' },
        { text: 'Toilet picked up' },
        { text: 'Invoice sent', critical: true },
      );
      return t;
    }
  },

  stucco: {
    label: 'Stucco',
    questions: [],
    buildTasks() {
      return [
        { text: 'Scope confirmed', critical: true },
        { text: 'Materials ordered', critical: true },
        { text: 'Lath installed', critical: true },
        { text: 'Scratch coat applied', critical: true },
        { text: 'Brown coat applied', critical: true },
        { text: 'Finish coat applied', critical: true },
        { text: 'Final inspection', critical: true },
        { text: 'Final cleanup' },
        { text: 'Toilet picked up' },
        { text: 'Invoice sent', critical: true },
      ];
    }
  },

};

// ─────────────────────────────────────────────
// 2. MODAL HTML (injected into document)
// ─────────────────────────────────────────────

function injectTaskModalHTML() {
  const existing = document.getElementById('task-setup-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'task-setup-modal';
  modal.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(2px);
    align-items:center; justify-content:center;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff; border-radius:12px; width:92%; max-width:560px;
      max-height:88vh; overflow-y:auto; box-shadow:0 8px 40px rgba(0,0,0,0.22);
      font-family:'DM Sans', sans-serif;
    ">
      <!-- Header -->
      <div style="
        background:#2d7a3a; color:#fff; padding:18px 22px 14px;
        border-radius:12px 12px 0 0; display:flex; align-items:center; justify-content:space-between;
      ">
        <div>
          <div style="font-size:11px; letter-spacing:1.5px; opacity:0.75; text-transform:uppercase; margin-bottom:2px;">Phase 6 — Task Setup</div>
          <div id="tsm-job-name" style="font-size:18px; font-weight:700;">Load Tasks</div>
        </div>
        <button onclick="closeTaskModal()" style="
          background:rgba(255,255,255,0.15); border:none; color:#fff;
          width:32px; height:32px; border-radius:50%; font-size:18px; cursor:pointer; line-height:1;
        ">×</button>
      </div>

      <!-- Step 1: Job type selection -->
      <div id="tsm-step-1" style="padding:20px 22px;">
        <div style="font-size:13px; font-weight:600; color:#444; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.8px;">
          Select job type(s) — check all that apply
        </div>
        <div id="tsm-type-checkboxes" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:20px;">
          ${Object.entries(TASK_TEMPLATES).map(([key, tmpl]) => `
            <label style="
              display:flex; align-items:center; gap:10px; padding:10px 12px;
              border:2px solid #e5e5e5; border-radius:8px; cursor:pointer;
              transition:border-color 0.15s, background 0.15s;
            " id="tsm-label-${key}" onclick="toggleTypeLabel('${key}')">
              <input type="checkbox" id="tsm-type-${key}" value="${key}"
                style="width:16px;height:16px;accent-color:#2d7a3a;cursor:pointer;"
                onchange="toggleTypeLabel('${key}')">
              <span style="font-size:14px; font-weight:500; color:#333;">${tmpl.label}</span>
            </label>
          `).join('')}
        </div>
        <button onclick="tsm_nextStep()" style="
          background:#2d7a3a; color:#fff; border:none; padding:11px 24px;
          border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; width:100%;
        ">Next: Configure Options →</button>
      </div>

      <!-- Step 2: Questions per selected type -->
      <div id="tsm-step-2" style="display:none; padding:20px 22px;">
        <div id="tsm-questions-container"></div>
        <div style="display:flex; gap:10px; margin-top:16px;">
          <button onclick="tsm_backStep()" style="
            background:#f0f0f0; color:#444; border:none; padding:11px 20px;
            border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; flex:0 0 auto;
          ">← Back</button>
          <button onclick="tsm_buildAndSave()" style="
            background:#f0b429; color:#1a1a1a; border:none; padding:11px 24px;
            border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; flex:1;
          ">✓ Build Task List</button>
        </div>
      </div>

      <!-- Step 3: Preview -->
      <div id="tsm-step-3" style="display:none; padding:20px 22px;">
        <div style="font-size:13px; font-weight:600; color:#444; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.8px;">
          Task list preview — drag to reorder before saving
        </div>
        <div id="tsm-preview-list" style="margin-bottom:16px;"></div>
        <div style="display:flex; gap:10px;">
          <button onclick="tsm_backToQuestions()" style="
            background:#f0f0f0; color:#444; border:none; padding:11px 20px;
            border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; flex:0 0 auto;
          ">← Back</button>
          <button onclick="tsm_confirmSave()" style="
            background:#2d7a3a; color:#fff; border:none; padding:11px 24px;
            border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; flex:1;
          ">✓ Save Tasks to Job</button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(modal);
}

// ─────────────────────────────────────────────
// 3. MODAL STATE & LOGIC
// ─────────────────────────────────────────────

let _tsm_jobId = null;
let _tsm_jobName = '';
let _tsm_builtTasks = [];

function openTaskSetupModal(jobId, jobName) {
  _tsm_jobId = jobId;
  _tsm_jobName = jobName || 'New Job';

  // Reset
  document.getElementById('tsm-job-name').textContent = _tsm_jobName;
  document.getElementById('tsm-step-1').style.display = 'block';
  document.getElementById('tsm-step-2').style.display = 'none';
  document.getElementById('tsm-step-3').style.display = 'none';

  // Uncheck all
  Object.keys(TASK_TEMPLATES).forEach(key => {
    const cb = document.getElementById(`tsm-type-${key}`);
    if (cb) cb.checked = false;
    const lbl = document.getElementById(`tsm-label-${key}`);
    if (lbl) { lbl.style.borderColor = '#e5e5e5'; lbl.style.background = '#fff'; }
  });

  const modal = document.getElementById('task-setup-modal');
  modal.style.display = 'flex';
}

function closeTaskModal() {
  document.getElementById('task-setup-modal').style.display = 'none';
}

function toggleTypeLabel(key) {
  const cb = document.getElementById(`tsm-type-${key}`);
  const lbl = document.getElementById(`tsm-label-${key}`);
  if (cb && lbl) {
    if (cb.checked) {
      lbl.style.borderColor = '#2d7a3a';
      lbl.style.background = '#f0faf2';
    } else {
      lbl.style.borderColor = '#e5e5e5';
      lbl.style.background = '#fff';
    }
  }
}

function tsm_nextStep() {
  const selected = Object.keys(TASK_TEMPLATES).filter(k => {
    const cb = document.getElementById(`tsm-type-${k}`);
    return cb && cb.checked;
  });

  if (selected.length === 0) {
    alert('Please select at least one job type.');
    return;
  }

  // Build questions for selected types that have them
  const container = document.getElementById('tsm-questions-container');
  container.innerHTML = '';

  let hasQuestions = false;
  selected.forEach(key => {
    const tmpl = TASK_TEMPLATES[key];
    if (tmpl.questions && tmpl.questions.length > 0) {
      hasQuestions = true;
      const section = document.createElement('div');
      section.style.marginBottom = '20px';
      section.innerHTML = `
        <div style="
          font-size:12px; font-weight:700; color:#2d7a3a; text-transform:uppercase;
          letter-spacing:1px; margin-bottom:10px; padding-bottom:6px;
          border-bottom:2px solid #e8f5eb;
        ">${tmpl.label}</div>
      `;
      tmpl.questions.forEach(q => {
        const qDiv = document.createElement('div');
        qDiv.style.marginBottom = '12px';
        qDiv.innerHTML = `
          <div style="font-size:13px; font-weight:600; color:#333; margin-bottom:6px;">${q.text}</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${q.options.map((opt, i) => `
              <label style="
                display:flex; align-items:center; gap:6px; padding:7px 12px;
                border:2px solid #e5e5e5; border-radius:6px; cursor:pointer; font-size:13px;
                transition:all 0.15s;
              " id="tsm-opt-label-${key}-${q.id}-${i}">
                <input type="radio" name="tsm-q-${key}-${q.id}" value="${opt}"
                  id="tsm-opt-${key}-${q.id}-${i}"
                  style="accent-color:#2d7a3a;"
                  onchange="tsm_highlightRadio('${key}','${q.id}',${q.options.length})">
                ${opt}
              </label>
            `).join('')}
          </div>
        `;
        section.appendChild(qDiv);
      });
      container.appendChild(section);
    }
  });

  if (!hasQuestions) {
    // No questions needed — go straight to build
    tsm_buildAndSave();
    return;
  }

  document.getElementById('tsm-step-1').style.display = 'none';
  document.getElementById('tsm-step-2').style.display = 'block';
}

function tsm_highlightRadio(key, qid, count) {
  for (let i = 0; i < count; i++) {
    const lbl = document.getElementById(`tsm-opt-label-${key}-${qid}-${i}`);
    const inp = document.getElementById(`tsm-opt-${key}-${qid}-${i}`);
    if (lbl && inp) {
      lbl.style.borderColor = inp.checked ? '#2d7a3a' : '#e5e5e5';
      lbl.style.background = inp.checked ? '#f0faf2' : '#fff';
      lbl.style.fontWeight = inp.checked ? '600' : '400';
    }
  }
}

function tsm_backStep() {
  document.getElementById('tsm-step-2').style.display = 'none';
  document.getElementById('tsm-step-1').style.display = 'block';
}

function tsm_backToQuestions() {
  document.getElementById('tsm-step-3').style.display = 'none';
  const selected = Object.keys(TASK_TEMPLATES).filter(k => {
    const cb = document.getElementById(`tsm-type-${k}`);
    return cb && cb.checked;
  });
  const hasQ = selected.some(k => TASK_TEMPLATES[k].questions && TASK_TEMPLATES[k].questions.length > 0);
  if (hasQ) {
    document.getElementById('tsm-step-2').style.display = 'block';
  } else {
    document.getElementById('tsm-step-1').style.display = 'block';
  }
}

function tsm_buildAndSave() {
  const selected = Object.keys(TASK_TEMPLATES).filter(k => {
    const cb = document.getElementById(`tsm-type-${k}`);
    return cb && cb.checked;
  });

  // Gather answers
  const allAnswers = {};
  selected.forEach(key => {
    const tmpl = TASK_TEMPLATES[key];
    const answers = {};
    if (tmpl.questions) {
      tmpl.questions.forEach(q => {
        const radios = document.querySelectorAll(`input[name="tsm-q-${key}-${q.id}"]`);
        radios.forEach(r => { if (r.checked) answers[q.id] = r.value; });
        if (!answers[q.id]) answers[q.id] = q.options[1]; // default to second option (usually No)
      });
    }
    allAnswers[key] = answers;
  });

  // Build merged task list
  let allTasks = [];
  selected.forEach(key => {
    const tmpl = TASK_TEMPLATES[key];
    const tasks = tmpl.buildTasks(allAnswers[key] || {});
    tasks.forEach(t => {
      allTasks.push({
        ...t,
        jobType: key,
        order: allTasks.length,
        done: false,
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      });
    });
  });

  _tsm_builtTasks = allTasks;

  // Render preview
  renderTaskPreview(allTasks);
  document.getElementById('tsm-step-2').style.display = 'none';
  document.getElementById('tsm-step-1').style.display = 'none';
  document.getElementById('tsm-step-3').style.display = 'block';
}

function renderTaskPreview(tasks) {
  const container = document.getElementById('tsm-preview-list');
  container.innerHTML = '';

  const typeColors = {
    tearoff: '#c8401a', solar: '#f0b429', electrical: '#1a6fc8',
    roof: '#2d7a3a', gutters: '#7a3a2d', repair: '#7a2d7a', stucco: '#555'
  };

  tasks.forEach((task, idx) => {
    const row = document.createElement('div');
    row.id = `tsm-preview-row-${idx}`;
    row.draggable = true;
    row.dataset.idx = idx;
    row.style.cssText = `
      display:flex; align-items:center; gap:10px; padding:9px 12px;
      border:1.5px solid ${task.critical ? '#2d7a3a33' : '#e5e5e5'};
      border-radius:7px; margin-bottom:5px; background:${task.critical ? '#f8fff9' : '#fff'};
      cursor:grab; user-select:none; transition:box-shadow 0.15s;
    `;

    const typeColor = typeColors[task.jobType] || '#888';
    const badge = task.jobType ? `<span style="
      background:${typeColor}18; color:${typeColor}; font-size:10px; font-weight:700;
      padding:2px 6px; border-radius:4px; white-space:nowrap; text-transform:uppercase; letter-spacing:0.5px;
    ">${TASK_TEMPLATES[task.jobType]?.label || task.jobType}</span>` : '';

    const criticalDot = task.critical ? `<span title="Critical path" style="
      display:inline-block; width:7px; height:7px; border-radius:50%;
      background:#2d7a3a; flex-shrink:0;
    "></span>` : `<span style="display:inline-block;width:7px;height:7px;flex-shrink:0;"></span>`;

    const noteHtml = task.note ? `<div style="font-size:11px;color:#c8401a;margin-top:2px;">${task.note}</div>` : '';

    row.innerHTML = `
      <span style="color:#bbb; font-size:16px; cursor:grab; padding:0 2px;">⠿</span>
      ${criticalDot}
      <div style="flex:1; min-width:0;">
        <div style="font-size:13px; font-weight:500; color:#222;">${task.text}</div>
        ${noteHtml}
      </div>
      ${badge}
      <button onclick="tsm_removePreviewTask(${idx})" title="Remove this task" style="
        background:none; border:none; cursor:pointer; font-size:15px;
        color:#ccc; padding:0 2px; flex-shrink:0; line-height:1;
        transition:color 0.15s;
      " onmouseover="this.style.color='#c0392b'" onmouseout="this.style.color='#ccc'">✕</button>
    `;

    // Drag and drop
    row.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', idx);
      row.style.opacity = '0.4';
    });
    row.addEventListener('dragend', () => { row.style.opacity = '1'; });
    row.addEventListener('dragover', e => {
      e.preventDefault();
      row.style.boxShadow = '0 0 0 2px #2d7a3a';
    });
    row.addEventListener('dragleave', () => { row.style.boxShadow = 'none'; });
    row.addEventListener('drop', e => {
      e.preventDefault();
      row.style.boxShadow = 'none';
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      const toIdx = idx;
      if (fromIdx === toIdx) return;
      const moved = _tsm_builtTasks.splice(fromIdx, 1)[0];
      _tsm_builtTasks.splice(toIdx, 0, moved);
      _tsm_builtTasks.forEach((t, i) => { t.order = i; });
      renderTaskPreview(_tsm_builtTasks);
    });

    container.appendChild(row);
  });

  // Legend
  const legend = document.createElement('div');
  legend.style.cssText = 'margin-top:10px; font-size:11px; color:#888; display:flex; gap:14px; flex-wrap:wrap;';
  legend.innerHTML = `
    <span>● Green dot = critical path task</span>
    <span>⠿ Drag rows to reorder</span>
  `;
  container.appendChild(legend);
}

function tsm_removePreviewTask(idx) {
  _tsm_builtTasks.splice(idx, 1);
  _tsm_builtTasks.forEach((t, i) => { t.order = i; });
  renderTaskPreview(_tsm_builtTasks);
}

// ─────────────────────────────────────────────
// 4. SAVE TO AIRTABLE
// ─────────────────────────────────────────────

async function tsm_confirmSave() {
  if (!_tsm_jobId || _tsm_builtTasks.length === 0) {
    alert('No tasks to save.');
    return;
  }

  const btn = document.querySelector('#tsm-step-3 button:last-child');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  const AIRTABLE_TOKEN = 'patdw99npBzStV62o.9de4eaaa1b0a38c79d37a0e6eca7e1e58e0b1e8d4a32c725f6731ffe65aedd0e';
  const BASE_ID = 'appn1m7nkB7AqfMsN';
  const TASKS_TABLE = 'tblaB0sGkfDujQr43';

  try {
    // Delete existing tasks for this job first
    await clearExistingTasks(_tsm_jobName, AIRTABLE_TOKEN, BASE_ID, TASKS_TABLE);

    // Create tasks in batches of 10 (Airtable limit)
    const batches = [];
    for (let i = 0; i < _tsm_builtTasks.length; i += 10) {
      batches.push(_tsm_builtTasks.slice(i, i + 10));
    }

    for (const batch of batches) {
      const records = batch.map((task, batchIdx) => ({
        fields: {
          'Task': task.text,
          'Job': _tsm_jobName,
          'Sort Order': task.order,
          'Done': false,
          'Critical Path': task.critical ? true : false,
          'Job Type': TASK_TEMPLATES[task.jobType]?.label || task.jobType,
          'Notes': task.note || '',
          'Conditional': task.conditional || '',
        }
      }));

      const resp = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TASKS_TABLE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error?.message || 'Airtable error');
      }
    }

    btn.textContent = '✓ Saved!';
    btn.style.background = '#2d7a3a';

    // Log for AI learning
    logTaskSetup(_tsm_jobId, _tsm_jobName, _tsm_builtTasks);

    setTimeout(() => {
      closeTaskModal();
      // Reload the tasks display if the function exists in the main app
      if (typeof loadTasksForJob === 'function') loadTasksForJob(_tsm_jobId);
      if (typeof renderTasks === 'function') renderTasks();
    }, 1200);

  } catch (err) {
    console.error('Task save error:', err);
    btn.textContent = '✗ Error — try again';
    btn.style.background = '#c8401a';
    btn.disabled = false;
    alert('Error saving tasks: ' + err.message);
  }
}

async function clearExistingTasks(jobId, token, baseId, tableId) {
  // Find existing tasks for this job
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula={Job}="${jobId}"&fields[]=Task`;
  const resp = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!resp.ok) return;
  const data = await resp.json();
  const ids = (data.records || []).map(r => r.id);
  if (ids.length === 0) return;

  // Delete in batches of 10
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const params = batch.map(id => `records[]=${id}`).join('&');
    await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}?${params}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}

// ─────────────────────────────────────────────
// 5. AI LEARNING — passive data logging
// ─────────────────────────────────────────────
// Stores setup choices in localStorage under century_task_history.
// When AI layer is added, this data feeds pattern analysis.

function logTaskSetup(jobId, jobName, tasks) {
  try {
    const key = 'century_task_history';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      jobId,
      jobName,
      timestamp: new Date().toISOString(),
      taskCount: tasks.length,
      types: [...new Set(tasks.map(t => t.jobType))],
      taskTexts: tasks.map(t => t.text),
      criticalCount: tasks.filter(t => t.critical).length,
    });
    // Keep last 200 entries
    if (existing.length > 200) existing.splice(0, existing.length - 200);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    // Non-critical — don't block
  }
}

// ─────────────────────────────────────────────
// 6. WIRE INTO EXISTING "LOAD TASKS" BUTTONS
// ─────────────────────────────────────────────
// The existing app has "+ Load Tasks" buttons with onclick or data attrs.
// This function replaces their click handlers.

function wireLoadTaskButtons() {
  // Look for any element with data-job-id and text "Load Tasks"
  document.querySelectorAll('[data-action="load-tasks"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const jobId = btn.dataset.jobId;
      const jobName = btn.dataset.jobName || btn.closest('[data-job-name]')?.dataset.jobName || 'Job';
      openTaskSetupModal(jobId, jobName);
    };
  });
}

// ─────────────────────────────────────────────
// 7. INIT
// ─────────────────────────────────────────────

function initTasksV2() {
  injectTaskModalHTML();
  wireLoadTaskButtons();

  // Expose globally so existing app code can call openTaskSetupModal(id, name)
  window.openTaskSetupModal = openTaskSetupModal;
  window.closeTaskModal = closeTaskModal;
  window.toggleTypeLabel = toggleTypeLabel;
  window.tsm_nextStep = tsm_nextStep;
  window.tsm_backStep = tsm_backStep;
  window.tsm_backToQuestions = tsm_backToQuestions;
  window.tsm_buildAndSave = tsm_buildAndSave;
  window.tsm_confirmSave = tsm_confirmSave;
  window.tsm_highlightRadio = tsm_highlightRadio;
  window.TASK_TEMPLATES = TASK_TEMPLATES;
  window.tsm_removePreviewTask = tsm_removePreviewTask;

  console.log('[Century Ops] Task system v2 initialized — Phase 6 ready.');
}

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTasksV2);
} else {
  initTasksV2();
}
