# Shortcut Script Runner

A native Firefox WebExtension inspired by the rule management experience of `Shortkeys`.

## Features

- Manage multiple "shortcut slot -> rule script" configurations.
- Each rule can define a name, description, URL match pattern, run scope, delay, and error handling strategy.
- Rule input supports both regular scripts and pasted `javascript:` bookmarklets, which are normalized before execution.
- A rule can be run directly from the popup or the settings page.
- If a page is uploading `File`, `Blob`, or `FormData` data through `fetch` or `XMLHttpRequest`, execution waits until the upload finishes.
- Includes a `Shortkeys`-inspired settings page for managing rules, editing scripts, and reviewing the latest run results.

## File Structure

- `manifest.json`: Firefox extension manifest.
- `background.js`: Listens for shortcut slots and dispatches work across tabs in sequence.
- `content.js`: Runs page-side scripts and waits until uploads become idle.
- `page-bridge.js`: Injected into the page context to track upload requests.
- `options.html` / `options.css` / `options.js`: Settings page.
- `popup.html` / `popup.css` / `popup.js`: Extension popup.

## Loading the Extension

1. Open Firefox.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click "Load Temporary Add-on".
4. Select `manifest.json` from this directory.

## How to Use

1. Open the extension settings page.
2. Create one or more rules and bind them to `Shortcut Slot 1` through `Shortcut Slot 8`.
3. Open `about:addons` in Firefox.
4. Open the gear menu and go to "Manage Extension Shortcuts".
5. Assign the actual hotkeys you want for `Shortcut Slot 1` through `Shortcut Slot 8`.
6. Press the assigned hotkey to run the rule bound to that slot.

Recommended default shortcuts:

- Windows / Linux: `Ctrl+Shift+1` to `Ctrl+Shift+8`
- macOS: `Control+Shift+1` to `Control+Shift+8`

The script runtime provides direct access to:

- `document` / `window` / `location`
- `sleep(ms)`
- `tabUrl`
- `tabTitle`
- `scriptName`
- `log(...)`

## Limitations

- Firefox shortcut commands must be predefined in `manifest.json`, so this version provides 8 fixed shortcut slots and does not support unlimited dynamic shortcut creation.
- These default shortcuts were chosen to avoid common browser defaults such as downloads, bookmarks, developer tools, and private window shortcuts in Firefox and Chrome. If your OS or input method uses the same combinations, you still need to reassign them manually in the browser shortcut settings.
- Only `http`, `https`, and `file` tabs are processed.
- Upload detection currently focuses on file-based requests made through `fetch` and `XMLHttpRequest`.
- Restricted pages such as internal browser pages, extension pages, and AMO pages are not supported.
