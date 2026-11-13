---
name: rules-md
description: >-
  Canonical framework map for Playwright UI/API automation. Use for any code change:
  integrate an API, UI change, new script, path.js wiring, testData, Jenkins/npm.
  Start here for locations and patterns. Coding rules live in framework-standards.mdc (always on).
---

# Playwright UI/API Automation — Framework Context

**This skill = where things live and how to wire them.**  
**Coding rules (imports, apibuilders, logging, safety) =** `.cursor/rules/framework-standards.mdc` (always on — do not restate them here).

You do **not** need the user to explain the framework. Read this, then open only the files you will edit.

---

## When to use

- Integrate an API, automate end-to-end, add/change a script, UI flow, testData, or conventions
- Need: file locations, URL/header wiring, payload/apibuilder/spec patterns, Jenkins/npm checklist

---

## 0. Architecture in one minute

| Layer                             | Role                                                                      |
| --------------------------------- | ------------------------------------------------------------------------- |
| **`config/`**                     | Which org (`NODE_ENV` → `config/<env>.json`): baseURL, orgId, admin creds |
| **`testData/`**                   | User-editable inputs only (names, titles). **No UUIDs**                   |
| **`helpers/API/payloads/`**       | Build request bodies                                                      |
| **`helpers/API/apibuilders/`**    | HTTP call + status + log + return body (**shared**)                       |
| **`helpers/API/url` + `headers`** | `urlData` / `headerData`                                                  |
| **`path.js`**                     | **Only** import hub for specs and helpers                                 |
| **`tests/API/`**                  | Repeatable API specs by domain                                            |
| **`tests/UI/`**                   | Browser specs                                                             |
| **`tests/oneTimeScripts/`**       | Seed / run-once (API or UI) — when user says one-time                     |
| **`package.json`**                | npm command names (= Jenkins dropdown = CSV command column)               |

**Flow to add a capability:** URL → header → payload → apibuilder → `path.js` export → testData → spec → package.json → Jenkinsfile → CSV → sync docs.

---

## 1. Folder map

| Location                                       | Purpose                                                                                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`path.js`**                                  | Single export hub. Specs/helpers import **only** from here.                                                                                                                                                   |
| **`helpers/API/payloads/`**                    | `[name]Payload.js` — dynamic + testData + API values → body                                                                                                                                                   |
| **`helpers/API/apibuilders/`**                 | `[name]Api.js` — request, JWT, urlData, headerData, payload; status; logger                                                                                                                                   |
| **`helpers/API/url/allUrls.js`**               | Constants + **`urlData`** keys                                                                                                                                                                                |
| **`helpers/API/headers/allHeaders.js`**        | Header fns + **`headerData`** keys                                                                                                                                                                            |
| **`tests/API/`**                               | By area: `Admin/`, `RAS/`, `Learner/`, `LXStudios/`, `removalApis/`, `CP/`, …                                                                                                                                 |
| **`tests/UI/`**                                | Browser specs + page objects from path.js                                                                                                                                                                     |
| **`tests/oneTimeScripts/`**                    | One-time/seed specs. Import `../../path.js`. Example: `createLearningAdminAndCollectionLearners.spec.js`                                                                                                      |
| **`testData/`**                                | Arrays of objects; configurable values only; no hardcoded IDs/UUIDs                                                                                                                                           |
| **`config/`**                                  | Environment JSON (baseURL, orgId, Admindata)                                                                                                                                                                  |
| **`configplaywright/`**                        | Safari / mobile Playwright configs                                                                                                                                                                            |
| **`pageObjects/`**                             | UI page objects (via path.js)                                                                                                                                                                                 |
| **`helpers/UI/commonFunctions.js`**            | **`reusableFunctions`**: `readJsonFile`, `readDatafromJsonFilenotasync`, `getPath`, `getOrgEntriesForSiteType` (incl. `TriggerInConfigOrg`), `pickLearnersFromUsers`, etc. **No `fs.readFileSync` in specs.** |
| **`logger.js`**                                | `logger.info` / `logger.error` — plain sentences; one log file per Playwright run                                                                                                                             |
| **`package.json`**                             | `"scripts"` = runnable commands                                                                                                                                                                               |
| **`Jenkinsfile`**                              | `command` choice list — **exact** package.json name, alphabetical; runs `npm run ${params.command}`                                                                                                           |
| **`testData/jenkins/jenkins-config.json`**     | Cron / org rotation                                                                                                                                                                                           |
| **`scripts/jenkins/`**, **`scripts/runners/`** | Jenkins helpers; some runners re-exported from path.js                                                                                                                                                        |
| **`README.md`**                                | Setup / ordered commands — update via sync-docs when user-facing                                                                                                                                              |
| **`docs/Tracking-all-sites-commands.csv`**     | **Canonical human command catalog** (feature, prereqs, description)                                                                                                                                           |
| **`.cursor/`**                                 | Router rule + standards rule + skills (this file = deep map)                                                                                                                                                  |

---

## 2. API file structure & naming

1. Payload: `helpers/API/payloads/[name]Payload.js`
2. Apibuilder: `helpers/API/apibuilders/[name]Api.js`
3. Test data: `testData/[Module]/[name].json` (array; no UUIDs)
4. Spec: `tests/API/[Module]/[name].spec.js` **or** `tests/oneTimeScripts/` if one-time
5. URL in `allUrls.js` → `urlData` key
6. Header in `allHeaders.js` → `headerData` key
7. **`path.js`**: export payload first, then apibuilder (keep section order)

---

## 3. Key principles (wiring & data)

Coding style (imports, logging, apibuilder boundaries) → **framework-standards.mdc**.

- **Dynamic IDs:** fetch from APIs, runtime, or config — never hardcode in testData.
- **Parallel / serial:** independent cases → parallel; dependent setup → `test.describe.serial()`.
- **Test data reads:** `reusableFunctions.readJsonFile` / `readDatafromJsonFilenotasync` / `getPath`.
- **`FileName` env:**
  - One file → `process.env.FileName` only (trim; default or error per spec). **Do not** use `splitFileNameEnv()`.
  - Two datasets → `FileName=a,b` and **`splitFileNameEnv()`** → `{ primary, secondary, all }`.
  - Exception: commas are part of one filter string (e.g. LX Studios PPT titles) → pass `FileName` through unchanged.
  - `createAndShareContentToChildSites`: ignore `FileName` and `SITE_NAME` for targeting. Share PUT **replaces** `sharedTo` — a subset (e.g. `FileName=platformeval51-100`) unshares older children. Always pass every `hierarchy[0].children` org id. Share only published linked content (reuse status 2 by title; else create+publish from `shareContentToSitesData.json`). Log parent published count and child-site count **before** any share PUT.
  - `createCustomLandingPages`: `AUDIENCE_NAME` for audience; else first `audienceName` in workbook JSON.

---

## 4. Payload pattern

```javascript
export function [name]Payload(paramFromAPI, testDataRow) {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return { /* dynamic + API + testData */ };
}
```

---

## 5. Apibuilder pattern

```javascript
import { headerData, urlData, [payloadFn], expect, logger } from "../../../path.js";

export async function [name]Api(request, jwt, ...params) {
  try {
    const payload = [payloadFn](...params);
    const response = await request.post(urlData.[apiUrl], {
      data: payload,
      headers: headerData.[headerFn](jwt, "application/json"),
    });
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    logger.info(`Short success message`);
    return { success: true, ...extracted, response: responseData };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    throw error;
  }
}
```

---

## 6. Spec pattern (API)

```javascript
import { test, expect, logger, generateToken, [apiFn], reusableFunctions } from "../../../path.js";
// oneTimeScripts: from "../../path.js"

const rows = reusableFunctions.readDatafromJsonFilenotasync(
  reusableFunctions.getPath("testData/[Module]", `${fileName}.json`),
);

test.beforeAll(async ({ request }) => { /* JWT / shared setup */ });

test.describe.serial("Setup", () => { /* dependent fetches */ });
test.describe.parallel("Cases", () => { /* data-driven */ });
```

Match nearby specs in the same module for `getPath` / `readDatafromJsonFilenotasync` vs `readJsonFile`.

---

## 7. UI tests

- Specs in **`tests/UI/`**; page objects + `reusableFunctions` from path.js; `logger`; `config` via path.js; browser configs under `configplaywright/`.

---

## 8. Integration checklist (full)

Before calling a new API flow or command done:

- [ ] URL(s) in **`allUrls.js`** + `urlData`
- [ ] Header(s) in **`allHeaders.js`** + `headerData`
- [ ] Payload + apibuilder
- [ ] **`path.js`** exports (payload then apibuilder)
- [ ] **testData** JSON (no UUIDs)
- [ ] Spec under **`tests/API/…`**, **`tests/UI/…`**, or **`tests/oneTimeScripts/`**
- [ ] **`package.json`** script — full spec path from repo root + needed env vars
- [ ] **`Jenkinsfile`** `command` choice — exact name, alphabetical
- [ ] **`docs/Tracking-all-sites-commands.csv`** row (same name)
- [ ] **README** / onboarding notes if user-facing
- [ ] **`/sync-docs-with-framework`** (see that skill — CSV is command catalog SoT)

**Verify:** grep script name in `package.json`, `Jenkinsfile`, and CSV — identical string.

On delete: remove path.js exports and orphaned package/Jenkins/CSV entries.

---

## 9. How to proceed on a request

1. Classify ask (new API, script, UI, one-time seed, docs-only).
2. Use this map + **framework-standards**.
3. Read only sibling/example files in the same module + `path.js` export style.
4. Implement; finish checklist if wiring/commands changed.
5. Sync docs if package/Jenkins/README/folder map changed.
6. If agent conventions change → update **router rule** and/or **standards** and this skill so they stay aligned (no copy-paste of the same paragraph into three places — pick the SoT from the router table).

---

## 10. Anti-patterns (quick)

Full coding anti-patterns → **framework-standards**. Wiring anti-patterns:

- ❌ Hardcoded UUIDs in testData
- ❌ `fs.readFileSync` in specs
- ❌ Spec logic inside shared apibuilders
- ❌ Guessing folders / inventing npm names not in package.json
- ❌ Updating only package.json but not Jenkins/CSV
- ❌ Putting one-time specs under `tests/API/` or `tests/UI/`
- ❌ Running org-mutating automation without explicit user ask
