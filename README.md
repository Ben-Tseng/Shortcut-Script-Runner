# 快捷键脚本运行器

一个原生 Firefox WebExtension，方向上参考了 `Shortkeys` 的规则管理体验。

功能：

- 管理多条“快捷键槽位 -> 规则脚本”配置
- 每条规则可设置名称、说明、URL 匹配、执行范围、延迟、报错策略
- 规则输入既支持普通脚本，也支持直接粘贴 `javascript:` bookmarklet，执行前会自动转换
- 可从弹窗和设置页直接运行某条规则
- 如果页面正在通过 `fetch` / `XMLHttpRequest` 上传 `File`、`Blob`、`FormData`，会等待上传结束再执行
- 提供一个参考 `Shortkeys` 风格的设置页，用来管理规则、编辑脚本和查看最近一次运行结果

## 文件结构

- `manifest.json`：Firefox 扩展清单
- `background.js`：监听快捷键槽位并顺序调度每个标签页
- `content.js`：页面内执行脚本，等待上传空闲
- `page-bridge.js`：注入到页面上下文，跟踪上传请求
- `options.html` / `options.css` / `options.js`：设置页
- `popup.html` / `popup.css` / `popup.js`：扩展弹窗

## 加载方式

1. 打开 Firefox
2. 进入 `about:debugging#/runtime/this-firefox`
3. 点击 “Load Temporary Add-on”
4. 选择这个目录里的 `manifest.json`

## 使用方式

1. 打开扩展的设置页
2. 创建一条或多条规则，并给规则绑定 `快捷键位 1` 到 `快捷键位 8`
3. 在 Firefox 里打开 `about:addons`
4. 点击齿轮菜单，进入 “Manage Extension Shortcuts”
5. 为 `快捷键位 1` 到 `快捷键位 8` 配置你想要的实际快捷键
6. 按对应快捷键运行绑定到该槽位的规则

默认建议键位：

- Windows / Linux：`Ctrl+Shift+1` 到 `Ctrl+Shift+8`
- macOS：`Control+Shift+1` 到 `Control+Shift+8`

脚本运行环境里可直接使用：

- `document` / `window` / `location`
- `sleep(ms)`
- `tabUrl`
- `tabTitle`
- `scriptName`
- `log(...)`

## 限制说明

- Firefox 的快捷键命令必须在 `manifest.json` 中预定义，所以当前版本固定提供 8 个快捷键槽位，不支持无限动态新增命令
- 这组默认键位已避开 Firefox / Chrome 官方文档中常见的下载、书签、开发者工具、隐私窗口等默认快捷键；如果你的系统或输入法另外占用了相同组合，仍需在浏览器快捷键设置里手动调整
- 只会处理 `http`、`https`、`file` 标签页
- 当前上传检测主要覆盖 `fetch` 和 `XMLHttpRequest` 的文件型请求
- 浏览器内部页、扩展页、AMO 页面等受限页面不会执行
