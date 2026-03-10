(function installUploadTracker() {
  if (window.__uploadAwareBridgeInstalled) {
    return;
  }

  window.__uploadAwareBridgeInstalled = true;

  const state = {
    activeCount: 0,
    lastStartedAt: null,
    lastFinishedAt: null
  };

  const originalFetch = window.fetch;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  publish();

  if (typeof originalFetch === "function") {
    window.fetch = function patchedFetch(input, init) {
      const isUpload = hasUploadPayload(extractFetchBody(input, init));
      if (!isUpload) {
        return originalFetch.apply(this, arguments);
      }

      markStart();
      return originalFetch.apply(this, arguments).finally(markFinish);
    };
  }

  XMLHttpRequest.prototype.send = function patchedSend(body) {
    const isUpload = hasUploadPayload(body);
    if (isUpload) {
      markStart();
      this.addEventListener(
        "loadend",
        () => {
          markFinish();
        },
        { once: true }
      );
    }

    return originalXhrSend.apply(this, arguments);
  };

  function markStart() {
    state.activeCount += 1;
    state.lastStartedAt = new Date().toISOString();
    publish();
  }

  function markFinish() {
    state.activeCount = Math.max(0, state.activeCount - 1);
    state.lastFinishedAt = new Date().toISOString();
    publish();
  }

  function publish() {
    window.postMessage(
      {
        source: "upload-aware-bridge",
        type: "upload-state",
        payload: {
          activeCount: state.activeCount,
          lastStartedAt: state.lastStartedAt,
          lastFinishedAt: state.lastFinishedAt
        }
      },
      "*"
    );
  }

  function extractFetchBody(input, init) {
    if (init && Object.prototype.hasOwnProperty.call(init, "body")) {
      return init.body;
    }

    if (input && typeof input === "object" && "body" in input) {
      return input.body;
    }

    return undefined;
  }

  function hasUploadPayload(body) {
    if (!body) {
      return false;
    }

    if (typeof Blob !== "undefined" && body instanceof Blob) {
      return true;
    }

    if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) {
      return true;
    }

    if (typeof FormData !== "undefined" && body instanceof FormData) {
      for (const value of body.values()) {
        if (typeof Blob !== "undefined" && value instanceof Blob) {
          return true;
        }
      }
    }

    return false;
  }
})();
