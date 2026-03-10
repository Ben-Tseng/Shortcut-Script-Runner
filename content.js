(function bootstrapContentScript() {
  if (window.__uploadAwareRunnerContentLoaded) {
    return;
  }

  window.__uploadAwareRunnerContentLoaded = true;

  const uploadState = {
    activeCount: 0,
    lastStartedAt: null,
    lastFinishedAt: null
  };

  let idleWaiters = [];

  injectBridgeScript();

  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.source !== "upload-aware-bridge") {
      return;
    }

    if (event.data.type === "upload-state") {
      uploadState.activeCount = Number(event.data.payload.activeCount || 0);
      uploadState.lastStartedAt = event.data.payload.lastStartedAt || null;
      uploadState.lastFinishedAt = event.data.payload.lastFinishedAt || null;

      if (uploadState.activeCount === 0) {
        flushIdleWaiters();
      }
    }
  });

  browser.runtime.onMessage.addListener((message) => {
    if (!message || typeof message !== "object") {
      return undefined;
    }

    if (message.type === "ping") {
      return Promise.resolve({ ok: true });
    }

    if (message.type === "run-user-script") {
      return runUserScript(message.payload);
    }

    return undefined;
  });

  async function runUserScript(payload) {
    const startedAt = Date.now();
    await waitForUploadsToFinish();

    try {
      const runner = new Function(
        "context",
        `"use strict";
return (async () => {
  const sleep = context.sleep;
  const tabUrl = context.tabUrl;
  const tabTitle = context.tabTitle;
  const scriptName = context.scriptName;
  const log = context.log;
  ${payload.userScript}
})();`
      );

      const value = await runner({
        sleep,
        tabUrl: location.href,
        tabTitle: document.title,
        scriptName: payload.scriptName,
        log: (...args) => console.log(`[${payload.scriptName}]`, ...args)
      });

      return {
        status: "ok",
        detail: formatResult(value),
        durationMs: Date.now() - startedAt
      };
    } catch (error) {
      return {
        status: "error",
        detail: error && error.message ? error.message : String(error),
        durationMs: Date.now() - startedAt
      };
    }
  }

  async function waitForUploadsToFinish() {
    if (uploadState.activeCount === 0) {
      return;
    }

    await new Promise((resolve) => {
      idleWaiters.push(resolve);
    });
  }

  function flushIdleWaiters() {
    const waiters = idleWaiters;
    idleWaiters = [];

    for (const resolve of waiters) {
      resolve();
    }
  }

  function injectBridgeScript() {
    if (document.documentElement.dataset.uploadAwareBridge === "ready") {
      return;
    }

    const script = document.createElement("script");
    script.src = browser.runtime.getURL("page-bridge.js");
    script.dataset.source = "upload-aware-runner";
    script.onload = () => {
      script.remove();
      document.documentElement.dataset.uploadAwareBridge = "ready";
    };

    (document.head || document.documentElement).appendChild(script);
  }

  function formatResult(value) {
    if (typeof value === "undefined") {
      return "执行完成";
    }

    if (value === null) {
      return "执行完成（返回 null）";
    }

    if (typeof value === "string") {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
})();
