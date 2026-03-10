const STORAGE_KEYS = {
  settings: "settings",
  rules: "rules",
  lastRunResults: "lastRunResults"
};

const COMMAND_SLOTS = [
  {
    command: "run-slot-1",
    slotId: "slot-1",
    label: "快捷键位 1",
    suggestedKey: "Windows / Linux：Ctrl+Shift+1 · macOS：Control+Shift+1"
  },
  {
    command: "run-slot-2",
    slotId: "slot-2",
    label: "快捷键位 2",
    suggestedKey: "Windows / Linux：Ctrl+Shift+2 · macOS：Control+Shift+2"
  },
  {
    command: "run-slot-3",
    slotId: "slot-3",
    label: "快捷键位 3",
    suggestedKey: "Windows / Linux：Ctrl+Shift+3 · macOS：Control+Shift+3"
  },
  {
    command: "run-slot-4",
    slotId: "slot-4",
    label: "快捷键位 4",
    suggestedKey: "Windows / Linux：Ctrl+Shift+4 · macOS：Control+Shift+4"
  },
  {
    command: "run-slot-5",
    slotId: "slot-5",
    label: "快捷键位 5",
    suggestedKey: "Windows / Linux：Ctrl+Shift+5 · macOS：Control+Shift+5"
  },
  {
    command: "run-slot-6",
    slotId: "slot-6",
    label: "快捷键位 6",
    suggestedKey: "Windows / Linux：Ctrl+Shift+6 · macOS：Control+Shift+6"
  },
  {
    command: "run-slot-7",
    slotId: "slot-7",
    label: "快捷键位 7",
    suggestedKey: "Windows / Linux：Ctrl+Shift+7 · macOS：Control+Shift+7"
  },
  {
    command: "run-slot-8",
    slotId: "slot-8",
    label: "快捷键位 8",
    suggestedKey: "Windows / Linux：Ctrl+Shift+8 · macOS：Control+Shift+8"
  }
];

const DEFAULT_SETTINGS = {
  activeRuleId: "rule-1"
};

const DEFAULT_RULES = [
  {
    id: "rule-1",
    name: "批量提取标题",
    description: "示例规则：读取每个页面标题并输出日志。",
    enabled: true,
    slotId: "slot-1",
    stopOnError: false,
    delayBetweenTabsMs: 300,
    runScope: "all",
    matchPattern: "*",
    userScript: [
      "log('Running on', tabUrl);",
      "const title = document.title;",
      "return {",
      "  title,",
      "  href: location.href",
      "};"
    ].join("\n")
  }
];

browser.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await injectIntoOpenTabs();
});

browser.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await injectIntoOpenTabs();
});

browser.commands.onCommand.addListener(async (command) => {
  try {
    const slot = COMMAND_SLOTS.find((item) => item.command === command);
    if (!slot) {
      return;
    }

    await runRuleBySlot(slot.slotId);
  } catch (error) {
    console.error("Failed to run shortcut workflow", error);
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (!message || typeof message !== "object") {
    return undefined;
  }

  if (message.type === "get-config") {
    return getConfig();
  }

  if (message.type === "save-config") {
    return saveConfig(message.payload);
  }

  if (message.type === "run-rule-now") {
    return runRuleById(message.ruleId);
  }

  if (message.type === "run-slot-now") {
    return runRuleBySlot(message.slotId);
  }

  if (message.type === "get-last-run-results") {
    return getStorageValue(STORAGE_KEYS.lastRunResults, {});
  }

  return undefined;
});

async function ensureDefaults() {
  const [settings, rules] = await Promise.all([
    getStorageValue(STORAGE_KEYS.settings, null),
    getStorageValue(STORAGE_KEYS.rules, null)
  ]);

  const writes = {};

  if (!settings) {
    writes[STORAGE_KEYS.settings] = DEFAULT_SETTINGS;
  }

  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    writes[STORAGE_KEYS.rules] = DEFAULT_RULES;
  }

  if (Object.keys(writes).length > 0) {
    await browser.storage.local.set(writes);
  }
}

async function getConfig() {
  const [settings, rules] = await Promise.all([
    getStorageValue(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    getStorageValue(STORAGE_KEYS.rules, DEFAULT_RULES)
  ]);

  return {
    settings: normalizeSettings(settings),
    rules: normalizeRules(rules),
    slots: COMMAND_SLOTS
  };
}

async function saveConfig(payload) {
  const normalizedSettings = normalizeSettings(payload && payload.settings ? payload.settings : DEFAULT_SETTINGS);
  const normalizedRules = normalizeRules(payload && payload.rules ? payload.rules : DEFAULT_RULES);

  await browser.storage.local.set({
    [STORAGE_KEYS.settings]: normalizedSettings,
    [STORAGE_KEYS.rules]: normalizedRules
  });

  return getConfig();
}

async function runRuleBySlot(slotId) {
  const rules = await getRules();
  const matchedRule = rules.find((rule) => rule.enabled && rule.slotId === slotId);

  if (!matchedRule) {
    return persistAndReturnSummary({
      startedAt: new Date().toISOString(),
      ruleId: null,
      ruleName: COMMAND_SLOTS.find((slot) => slot.slotId === slotId)?.label || slotId,
      total: 0,
      completed: 0,
      skipped: 0,
      errored: 0,
      results: [],
      notice: "这个快捷键槽位还没有绑定启用中的规则。"
    });
  }

  return runRule(matchedRule);
}

async function runRuleById(ruleId) {
  const rules = await getRules();
  const matchedRule = rules.find((rule) => rule.id === ruleId);

  if (!matchedRule) {
    return persistAndReturnSummary({
      startedAt: new Date().toISOString(),
      ruleId,
      ruleName: "未知规则",
      total: 0,
      completed: 0,
      skipped: 0,
      errored: 0,
      results: [],
      notice: "未找到对应规则。"
    });
  }

  return runRule(matchedRule);
}

async function runRule(rule) {
  const tabs = await getTargetTabs(rule.runScope);
  const results = [];

  for (const tab of tabs) {
    if (!ruleMatchesTab(rule, tab)) {
      results.push({
        tabId: tab.id,
        title: tab.title || tab.url || "未命名标签页",
        url: tab.url || "",
        status: "skipped",
        detail: `URL 不匹配规则：${rule.matchPattern || "*"}`
      });
      continue;
    }

    const result = await runScriptInTab(tab, rule);
    results.push(result);

    if (rule.stopOnError && result.status === "error") {
      break;
    }

    if (rule.delayBetweenTabsMs > 0) {
      await sleep(rule.delayBetweenTabsMs);
    }
  }

  return persistAndReturnSummary({
    startedAt: new Date().toISOString(),
    ruleId: rule.id,
    ruleName: rule.name,
    total: tabs.length,
    completed: results.filter((item) => item.status === "ok").length,
    skipped: results.filter((item) => item.status === "skipped").length,
    errored: results.filter((item) => item.status === "error").length,
    results
  });
}

async function persistAndReturnSummary(summary) {
  await browser.storage.local.set({
    [STORAGE_KEYS.lastRunResults]: summary
  });

  return summary;
}

async function getRules() {
  const rules = await getStorageValue(STORAGE_KEYS.rules, DEFAULT_RULES);
  return normalizeRules(rules);
}

async function getTargetTabs(runScope) {
  const query = runScope === "current-window" ? { currentWindow: true } : {};
  const tabs = await browser.tabs.query(query);
  return tabs.filter((tab) => isRunnableUrl(tab.url));
}

async function runScriptInTab(tab, rule) {
  try {
    await ensureTabContentScript(tab.id);
    const executableScript = normalizeExecutableSource(rule.userScript);

    const response = await browser.tabs.sendMessage(tab.id, {
      type: "run-user-script",
      payload: {
        userScript: executableScript,
        scriptName: rule.name
      }
    });

    if (!response) {
      return {
        tabId: tab.id,
        title: tab.title || tab.url || "未命名标签页",
        url: tab.url || "",
        status: "skipped",
        detail: "标签页没有返回结果"
      };
    }

    return {
      tabId: tab.id,
      title: tab.title || tab.url || "未命名标签页",
      url: tab.url || "",
      ...response
    };
  } catch (error) {
    return {
      tabId: tab.id,
      title: tab.title || tab.url || "未命名标签页",
      url: tab.url || "",
      status: "error",
      detail: error.message
    };
  }
}

async function injectIntoOpenTabs() {
  const tabs = await browser.tabs.query({});

  for (const tab of tabs) {
    if (!isRunnableUrl(tab.url)) {
      continue;
    }

    await ensureTabContentScript(tab.id);
  }
}

async function ensureTabContentScript(tabId) {
  try {
    await browser.tabs.sendMessage(tabId, { type: "ping" });
  } catch (error) {
    await browser.tabs.executeScript(tabId, {
      file: "content.js",
      runAt: "document_start"
    });
  }
}

function normalizeSettings(settings) {
  return {
    activeRuleId: typeof settings.activeRuleId === "string" ? settings.activeRuleId : DEFAULT_SETTINGS.activeRuleId
  };
}

function normalizeRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return DEFAULT_RULES;
  }

  return rules.map((rule, index) => ({
    id: typeof rule.id === "string" && rule.id ? rule.id : `rule-${index + 1}`,
    name: typeof rule.name === "string" && rule.name.trim() ? rule.name.trim() : `规则 ${index + 1}`,
    description: typeof rule.description === "string" ? rule.description : "",
    enabled: Boolean(rule.enabled),
    slotId: isValidSlot(rule.slotId) ? rule.slotId : "",
    stopOnError: Boolean(rule.stopOnError),
    delayBetweenTabsMs: Math.max(0, Number(rule.delayBetweenTabsMs || 0)),
    runScope: rule.runScope === "current-window" ? "current-window" : "all",
    matchPattern: typeof rule.matchPattern === "string" && rule.matchPattern.trim() ? rule.matchPattern.trim() : "*",
    userScript: typeof rule.userScript === "string" ? rule.userScript : ""
  }));
}

function normalizeExecutableSource(source) {
  const raw = typeof source === "string" ? source.trim() : "";
  if (!/^javascript:/i.test(raw)) {
    return raw;
  }

  let body = raw.replace(/^javascript:/i, "").trim();

  try {
    body = decodeURIComponent(body);
  } catch (error) {
    // Keep the original body when the bookmarklet is not URI-encoded.
  }

  if (body.endsWith(";")) {
    return body;
  }

  return `${body};`;
}

function isValidSlot(slotId) {
  return COMMAND_SLOTS.some((slot) => slot.slotId === slotId);
}

function ruleMatchesTab(rule, tab) {
  const pattern = (rule.matchPattern || "*").trim();
  if (pattern === "*" || pattern === "<all_urls>") {
    return true;
  }

  try {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    return new RegExp(`^${escaped}$`, "i").test(tab.url || "");
  } catch (error) {
    return true;
  }
}

function isRunnableUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  return /^(https?|file):/i.test(url);
}

async function getStorageValue(key, fallbackValue) {
  const stored = await browser.storage.local.get(key);
  return Object.prototype.hasOwnProperty.call(stored, key) ? stored[key] : fallbackValue;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
