const DEFAULT_RULE_SCRIPT = [
  "log('Running on', tabUrl);",
  "",
  "// Example:",
  "// const button = document.querySelector('button');",
  "// button?.click();",
  "// return { clicked: Boolean(button) };"
].join("\n");

const state = {
  rules: [],
  slots: [],
  settings: {
    activeRuleId: null
  }
};

const elements = {
  ruleList: document.querySelector("#rule-list"),
  slotOverview: document.querySelector("#slot-overview"),
  ruleName: document.querySelector("#rule-name"),
  ruleDescription: document.querySelector("#rule-description"),
  ruleSlot: document.querySelector("#rule-slot"),
  matchPattern: document.querySelector("#match-pattern"),
  runScope: document.querySelector("#run-scope"),
  delayBetweenTabs: document.querySelector("#delay-between-tabs"),
  ruleEnabled: document.querySelector("#rule-enabled"),
  stopOnError: document.querySelector("#stop-on-error"),
  userScript: document.querySelector("#user-script"),
  saveButton: document.querySelector("#save-button"),
  addRuleButton: document.querySelector("#add-rule-button"),
  duplicateRuleButton: document.querySelector("#duplicate-rule-button"),
  deleteRuleButton: document.querySelector("#delete-rule-button"),
  runActiveRuleButton: document.querySelector("#run-active-rule-button"),
  openShortcutsButton: document.querySelector("#open-shortcuts-button"),
  refreshResults: document.querySelector("#refresh-results"),
  statusBanner: document.querySelector("#status-banner"),
  resultsList: document.querySelector("#results-list"),
  ruleTemplate: document.querySelector("#rule-item-template"),
  resultTemplate: document.querySelector("#result-item-template")
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();
  await refreshResults();

  elements.addRuleButton.addEventListener("click", addRule);
  elements.duplicateRuleButton.addEventListener("click", duplicateActiveRule);
  elements.deleteRuleButton.addEventListener("click", deleteActiveRule);
  elements.saveButton.addEventListener("click", saveActiveRule);
  elements.runActiveRuleButton.addEventListener("click", runActiveRule);
  elements.openShortcutsButton.addEventListener("click", openShortcutsHelp);
  elements.refreshResults.addEventListener("click", refreshResults);
});

async function loadConfig() {
  const config = await browser.runtime.sendMessage({ type: "get-config" });
  state.rules = Array.isArray(config.rules) ? config.rules : [];
  state.slots = Array.isArray(config.slots) ? config.slots : [];
  state.settings = config.settings || { activeRuleId: null };

  if (!state.rules.find((rule) => rule.id === state.settings.activeRuleId)) {
    state.settings.activeRuleId = state.rules[0] ? state.rules[0].id : null;
  }

  renderSlotSelect();
  renderRuleList();
  renderSlotOverview();
  fillEditorFromActiveRule();
}

function renderSlotSelect() {
  elements.ruleSlot.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "不绑定快捷键";
  elements.ruleSlot.appendChild(empty);

  for (const slot of state.slots) {
    const option = document.createElement("option");
    option.value = slot.slotId;
    option.textContent = `${slot.label} · 默认 ${slot.suggestedKey}`;
    elements.ruleSlot.appendChild(option);
  }
}

function renderRuleList() {
  elements.ruleList.innerHTML = "";

  for (const rule of state.rules) {
    const fragment = elements.ruleTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".rule-item");
    const title = fragment.querySelector(".rule-item__title");
    const slot = fragment.querySelector(".rule-item__slot");
    const meta = fragment.querySelector(".rule-item__meta");

    title.textContent = rule.name;
    slot.textContent = describeSlot(rule.slotId);
    meta.textContent = `${rule.enabled ? "已启用" : "已停用"} · ${rule.matchPattern || "*"} · ${rule.runScope === "current-window" ? "当前窗口" : "所有窗口"}`;
    button.dataset.ruleId = rule.id;

    if (rule.id === state.settings.activeRuleId) {
      button.dataset.active = "true";
    }

    button.addEventListener("click", () => {
      state.settings.activeRuleId = rule.id;
      renderRuleList();
      fillEditorFromActiveRule();
    });

    elements.ruleList.appendChild(fragment);
  }
}

function renderSlotOverview() {
  elements.slotOverview.innerHTML = "";

  for (const slot of state.slots) {
    const boundRule = state.rules.find((rule) => rule.enabled && rule.slotId === slot.slotId);
    const card = document.createElement("div");
    card.className = "slot-card";
    card.innerHTML = `
      <span class="slot-card__label">${slot.label}</span>
      <strong>${slot.suggestedKey}</strong>
      <p>${boundRule ? boundRule.name : "未绑定规则"}</p>
    `;
    elements.slotOverview.appendChild(card);
  }
}

function fillEditorFromActiveRule() {
  const rule = getActiveRule();
  if (!rule) {
    return;
  }

  elements.ruleName.value = rule.name;
  elements.ruleDescription.value = rule.description || "";
  elements.ruleSlot.value = rule.slotId || "";
  elements.matchPattern.value = rule.matchPattern || "*";
  elements.runScope.value = rule.runScope || "all";
  elements.delayBetweenTabs.value = String(rule.delayBetweenTabsMs ?? 300);
  elements.ruleEnabled.checked = Boolean(rule.enabled);
  elements.stopOnError.checked = Boolean(rule.stopOnError);
  elements.userScript.value = rule.userScript || DEFAULT_RULE_SCRIPT;
}

async function saveActiveRule() {
  const activeRule = getActiveRule();
  if (!activeRule) {
    return;
  }

  Object.assign(activeRule, collectRuleForm(activeRule.id));
  await persistConfig();
  setBanner("规则已保存。");
}

async function addRule() {
  const rule = makeNewRule();
  state.rules.unshift(rule);
  state.settings.activeRuleId = rule.id;
  await persistConfig();
  setBanner("已新增规则。");
}

async function duplicateActiveRule() {
  const activeRule = getActiveRule();
  if (!activeRule) {
    return;
  }

  const copy = {
    ...activeRule,
    id: createRuleId(),
    name: `${activeRule.name} 副本`,
    slotId: ""
  };

  state.rules.unshift(copy);
  state.settings.activeRuleId = copy.id;
  await persistConfig();
  setBanner("已复制当前规则。");
}

async function deleteActiveRule() {
  if (state.rules.length <= 1) {
    setBanner("至少保留一条规则。");
    return;
  }

  const activeRule = getActiveRule();
  state.rules = state.rules.filter((rule) => rule.id !== activeRule.id);
  state.settings.activeRuleId = state.rules[0].id;
  await persistConfig();
  setBanner("已删除当前规则。");
}

async function runActiveRule() {
  await saveActiveRule();
  const activeRule = getActiveRule();
  const results = await browser.runtime.sendMessage({
    type: "run-rule-now",
    ruleId: activeRule.id
  });
  renderResults(results);
}

async function refreshResults() {
  const results = await browser.runtime.sendMessage({
    type: "get-last-run-results"
  });
  renderResults(results);
}

async function persistConfig() {
  const config = await browser.runtime.sendMessage({
    type: "save-config",
    payload: {
      settings: state.settings,
      rules: state.rules
    }
  });

  state.rules = config.rules;
  state.slots = config.slots;
  state.settings = config.settings;

  renderRuleList();
  renderSlotOverview();
  fillEditorFromActiveRule();
}

function collectRuleForm(ruleId) {
  const normalizedScript = normalizeEditableScript(elements.userScript.value);

  return {
    id: ruleId,
    name: elements.ruleName.value.trim() || "未命名规则",
    description: elements.ruleDescription.value.trim(),
    enabled: elements.ruleEnabled.checked,
    slotId: elements.ruleSlot.value,
    stopOnError: elements.stopOnError.checked,
    delayBetweenTabsMs: Math.max(0, Number(elements.delayBetweenTabs.value || 0)),
    runScope: elements.runScope.value === "current-window" ? "current-window" : "all",
    matchPattern: elements.matchPattern.value.trim() || "*",
    userScript: normalizedScript
  };
}

function getActiveRule() {
  return state.rules.find((rule) => rule.id === state.settings.activeRuleId) || null;
}

function makeNewRule() {
  return {
    id: createRuleId(),
    name: "新规则",
    description: "",
    enabled: true,
    slotId: "",
    stopOnError: false,
    delayBetweenTabsMs: 300,
    runScope: "all",
    matchPattern: "*",
    userScript: DEFAULT_RULE_SCRIPT
  };
}

function createRuleId() {
  return `rule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function describeSlot(slotId) {
  if (!slotId) {
    return "未绑定快捷键";
  }

  const slot = state.slots.find((item) => item.slotId === slotId);
  return slot ? `${slot.label}` : slotId;
}

function renderResults(summary) {
  elements.resultsList.innerHTML = "";

  if (!summary || !summary.results || summary.results.length === 0) {
    setBanner(summary && summary.notice ? summary.notice : "还没有可展示的运行结果。");
    return;
  }

  const startedAt = summary.startedAt ? new Date(summary.startedAt).toLocaleString() : "未知时间";
  const notice = summary.notice ? ` ${summary.notice}` : "";
  setBanner(
    `${summary.ruleName || "规则"} 最近运行于 ${startedAt}，成功 ${summary.completed}，跳过 ${summary.skipped}，报错 ${summary.errored}。${notice}`
  );

  for (const item of summary.results) {
    const fragment = elements.resultTemplate.content.cloneNode(true);
    const title = fragment.querySelector(".result-item__title");
    const badge = fragment.querySelector(".result-item__badge");
    const url = fragment.querySelector(".result-item__url");
    const detail = fragment.querySelector(".result-item__detail");

    title.textContent = item.title || "未命名标签页";
    badge.textContent = item.status;
    badge.dataset.status = item.status;
    url.textContent = item.url || "(no url)";
    detail.textContent = `${item.detail ?? "执行完成"}${item.durationMs ? ` · ${item.durationMs}ms` : ""}`;

    elements.resultsList.appendChild(fragment);
  }
}

function setBanner(text) {
  elements.statusBanner.textContent = text;
}

function openShortcutsHelp() {
  const helpText = [
    "Firefox 里请打开 about:addons",
    "点击齿轮图标",
    "选择“Manage Extension Shortcuts”",
    "再修改 快捷键位 1 到 快捷键位 8 的实际按键"
  ].join(" / ");

  setBanner(helpText);
}

function normalizeEditableScript(source) {
  const raw = typeof source === "string" ? source.trim() : "";
  if (!/^javascript:/i.test(raw)) {
    return source;
  }

  let body = raw.replace(/^javascript:/i, "").trim();

  try {
    body = decodeURIComponent(body);
  } catch (error) {
    // Keep the original body when the bookmarklet is not URI-encoded.
  }

  if (!body.endsWith(";")) {
    body = `${body};`;
  }

  return body;
}
