const popupElements = {
  ruleList: document.querySelector("#popup-rule-list"),
  status: document.querySelector("#popup-status")
};

document.addEventListener("DOMContentLoaded", loadPopup);

async function loadPopup() {
  const config = await browser.runtime.sendMessage({ type: "get-config" });
  popupElements.ruleList.innerHTML = "";

  for (const rule of config.rules || []) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "popup-rule-button";
    button.innerHTML = `
      <strong>${escapeHtml(rule.name)}</strong>
      <span>${escapeHtml(rule.description || "无说明")}</span>
      <small>${rule.enabled ? "已启用" : "已停用"} · ${escapeHtml(describeSlot(rule.slotId))} · ${escapeHtml(rule.matchPattern || "*")}</small>
    `;

    button.disabled = !rule.enabled;
    button.addEventListener("click", async () => {
      popupElements.status.textContent = `正在运行 ${rule.name}...`;
      const summary = await browser.runtime.sendMessage({
        type: "run-rule-now",
        ruleId: rule.id
      });
      popupElements.status.textContent = `${summary.ruleName} 执行完成，成功 ${summary.completed}，报错 ${summary.errored}。`;
    });

    popupElements.ruleList.appendChild(button);
  }

  if ((config.rules || []).length === 0) {
    popupElements.status.textContent = "还没有规则，请先在设置页创建。";
  }
}

function describeSlot(slotId) {
  if (!slotId) {
    return "未绑定快捷键";
  }

  const match = String(slotId).match(/^slot-(\d+)$/);
  if (!match) {
    return slotId;
  }

  return `快捷键位 ${match[1]}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
