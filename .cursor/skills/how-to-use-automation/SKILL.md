---
name: how-to-use-automation
description: >-
  Onboarding and operations: how to run scripts locally vs Jenkins, folder map, parameters, troubleshooting.
  Use when someone is new to the repo or needs step-by-step run instructions.
---

# How to Use This Automation — Complete Guide for Everyone

**Role of this skill:** how to **run** automation (local + Jenkins), folder map for people, troubleshooting.  
**Not for coding rules** → `.cursor/rules/framework-standards.mdc` + **rules-md**.  
**Command names/descriptions SoT** → `package.json` + **`docs/Tracking-all-sites-commands.csv`** (do not invent commands here).

**If you are new to this project, read this document first.**  
It explains everything in simple words so you can understand what this project does, where things are, and how to use it—without asking anyone.

**Related human summaries:** **`automated-features-summary`** (PPT), **`high-level-scripts-and-features`** (what data each script fills). Both must stay consistent with the CSV.

---

## 1. What is this project? (In one sentence)

This project is a **set of automated scripts** that create and manage **test data** (users, courses, dashboards, badges, content, etc.) on **many learning-platform sites** (we call each site an **org**). Instead of people doing the same clicks and data entry again and again on 200+ sites, we run a **script** and the computer does it for us.

---

## 2. Where is everything? (Folder map)

Think of the project like a big filing cabinet. Here is where each important thing lives.

| Folder or file                             | What it is (in simple words)                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`tests/`**                               | The actual automation code. Inside here we have **API** tests (talking to the server directly, fast) and **UI** tests (controlling the browser like a user). Each `.spec.js` file is one test suite.                                                                                                                                    |
| **`tests/API/`**                           | Tests that use the **API** (no browser needed for most). Examples: create user, create area, create assignment.                                                                                                                                                                                                                         |
| **`tests/UI/`**                            | Tests that use the **browser** (e.g. create banners, complete courses, executive dashboard).                                                                                                                                                                                                                                            |
| **`tests/oneTimeScripts/`**                | **One-time / seed scripts** (API or UI). Shared folder outside `API/` and `UI/`. When someone says a script is one-time, it goes here.                                                                                                                                                                                                  |
| **`testData/`**                            | **All the data** that scripts read. For example: list of users, list of areas, list of assignments, banner text, LX Studios file names. **If you want to change what gets created, you often change a file here** (see section 7).                                                                                                      |
| **`config/`**                              | **Environment settings**: which server to talk to (prod, dev, preval, presales, proservices, etc.). Each JSON file is one environment.                                                                                                                                                                                                  |
| **`configplaywright/`**                    | Special Playwright configs: **Safari** and **mobile device**. Used when we need to run the same test in Safari or on a mobile view.                                                                                                                                                                                                     |
| **`scripts/`**                             | Helper scripts. **`scripts/jenkins/`** = scripts used by Jenkins (build Docker image, run tests, check disk space, check agent health, etc.). **`scripts/runners/`** = small Node modules used by tests (e.g. `convertSampleToTestData.js`, `readTerminationList.js` for hire/termination CSV/XLSX).                                    |
| **`package.json`**                         | The **list of all commands** we can run. Each "script" entry (e.g. `createUsers`, `createArea`) is one automation we can trigger. Jenkins "command" dropdown shows these same names.                                                                                                                                                    |
| **`docs/Tracking-all-sites-commands.csv`** | **Cross-site command tracker:** npm script names grouped by feature, suggested prerequisites, and short descriptions—open in Excel or Google Sheets.                                                                                                                                                                                    |
| **`Jenkinsfile`**                          | The **Jenkins pipeline**: what happens when you click "Build" (load config, build Docker image, run the command you chose, archive reports).                                                                                                                                                                                            |
| **`testData/jenkins/jenkins-config.json`** | **Cron and org rotation**: which 14 commands run on schedule, their timeouts, and which org runs at which day/hour.                                                                                                                                                                                                                     |
| **`.cursor/skills/`**                      | **Agent skills** (each folder has `SKILL.md`): **rules-md** = framework for coders; **how-to-use-automation** = this guide; **automated-features-summary** = full command list; **high-level-scripts-and-features** = feature → what each script does; **sync-docs-with-framework** = keep README + these skills in sync after changes. |
| **`.cursor/skills/`**                      | **Cursor skills** for contributors: **rules-md** = framework structure and patterns; **sync-docs-with-framework** = checklist to keep this folder and **README.md** in sync after script or Jenkins changes.                                                                                                                            |

**Summary:**

- **Want to know which script does what?** → Section 6 below has examples; the full list of all commands is in **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`).
- **Want to change the data that a script uses?** → Look in **`testData/`** (see section 7).
- **Want to run a script?** → Use **Jenkins** (section 5) or **your laptop** (section 4).

---

## 3. What is a "script" and what is a "command"?

- **Script** = one automation job. For example: "create 10 users" or "create areas and channels" or "fill the activity dashboard."
- **Command** = the **name** we use to run that script. In this project, every command is defined in **`package.json`** under `"scripts"`. The same names appear in the **Jenkins "command" dropdown**. So when someone says "run the command createUsers," they mean: run the script named **createUsers**.

There are **140+ commands** (see `.cursor/skills/automated-features-summary/SKILL.md` for the current count). You don't need to remember them; you use the dropdown or the summary document to pick the right one.

---

## 4. How do I run a script? (Two ways)

### Option A: Run from your laptop (local)

1. Open a terminal in the project folder.
2. Make sure you have **Node.js** and **npm** installed. Run `npm install` once.
3. Run: **`npm run <commandName>`**  
   Example: `npm run createUsers` or `npm run createArea`.
4. The script will use the **config** (e.g. from `config/`) to know which server (org) to talk to. For local runs, the org/URL is usually set by your **environment or config**, not by Jenkins.

**When to use:** When you are testing one script on one org from your machine.

### Option B: Run from Jenkins (what most people use)

1. Open the **Jenkins job** for this project.
2. Click **"Build with Parameters."**
3. Choose:
   - **URL** (which org/site) — if you want one org only.
   - **command** (which script to run) — pick from the dropdown.
   - **environment** (prod / dev / preval).
   - **adminUsername** and **adminPassword** (to log in to that org).
   - **singleOrMultipleOrgs** — "run on one org" vs "run on many orgs" (see section 12).
4. Click **Build.** Jenkins will build a Docker image, run your command inside a container, and save the reports.

**When to use:** When you want to run a script on a specific org (or set of orgs) in a repeatable way and keep reports in Jenkins.

---

## 5. Jenkins parameters — what each one means

When you "Build with Parameters," you see these. Here is what to choose.

| Parameter                | What it is                                                                                                                                                | What you should do                                                                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **url**                  | The **site (org)** you want to run the script on. It's a dropdown of 150+ URLs (e.g. https://presales1.percipio.com).                                     | If you want **one org only**, pick that org's URL. If you leave it empty and only choose a **command**, Jenkins can still run that command (e.g. for cron or for a command that doesn't need a single org).              |
| **adminUsername**        | The **admin login email/user** for that org.                                                                                                              | Pick from the dropdown or type the correct admin for the org you chose.                                                                                                                                                  |
| **adminPassword**        | The **password** for that admin.                                                                                                                          | Enter it. (It is not stored in the code; it's only used for this run.)                                                                                                                                                   |
| **environment**          | Which **environment** to use: **prod**, **dev**, or **preval**. This decides which config file (server URLs, etc.) is used.                               | Choose **prod** for production-like sites, **dev** for dev, **preval** for preval.                                                                                                                                       |
| **command**              | The **script** to run. This is the list of 140+ automation commands (createUsers, createArea, createDataInActivityDashboard, etc.).                       | Pick the command that does what you need. Section 6 in this doc has examples; full list is in **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`).                                   |
| **singleOrMultipleOrgs** | Do you want to run on **one org** (the URL you picked) or on **many orgs** (e.g. presales parents, all parent sites, all proservices, all platform eval)? | **TriggerInSingleOrg** = use the **url** you selected. Other options (e.g. presalesParentSites, allParentSites, TriggerInProservicesSites, TriggerInAllSites) = run the same command on **many orgs** one after another. |
| **sitesFilter**          | Only for **multi-org** runs. If you want to limit which sites, you can list them here (comma-separated). If empty, "all" sites for that group run.        | Leave empty to run on all; or type e.g. `presales1,presales2` to limit.                                                                                                                                                  |
| **test**                 | **Override**: a custom test command (e.g. a full `npx playwright test ...` command). If you set this, **do not** set **command**.                         | Most people leave this empty and only use **command**.                                                                                                                                                                   |

**Important:**

- For **one org**: choose **url**, **adminUsername**, **adminPassword**, **environment**, **command**, and **singleOrMultipleOrgs = TriggerInSingleOrg**.
- For **many orgs**: choose **command**, **singleOrMultipleOrgs** (e.g. presalesParentSites or allParentSites), **environment**, and admin credentials (used for each org). You can leave **url** empty.

---

## 6. Which script does what? Where do I look?

Use the **command** dropdown in Jenkins (or `npm run <name>` locally). The names are in **`package.json`** under `"scripts"`. Below are common examples. For the **full list of all 140+ commands** with one-line descriptions by feature, open **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`).

**Common examples:**

| If you want to…                                                              | Use this command                                                                                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Create users                                                                 | **createUsers** or **createDefaultUsers**                                                                                                                                      |
| Learning Admin + 17 collection learners (one-time)                           | **createLearningAdminAndCollectionLearners** (`tests/oneTimeScripts/`, `NODE_ENV=percipioeval`)                                                                                |
| US Strategic Site Admins (one-time)                                          | **addUsStrategicSiteAdmins** (`tests/oneTimeScripts/`, FileName defaults to usStrategicSiteAdmins)                                                                             |
| US Strategic Content Collections attribute (one-time)                        | **addUsStrategicContentCollectionsAttribute** (`tests/oneTimeScripts/`, FileName defaults to usStrategicSiteAdmins)                                                            |
| US Strategic Content Collections audiences (one-time)                        | **addUsStrategicContentCollectionsAudiences** (`tests/oneTimeScripts/`, first site by default; `SITE_NAME=all` after check)                                                    |
| US Strategic Content Collections licence pools (one-time)                    | **addUsStrategicContentCollectionsLicencePools** (`tests/oneTimeScripts/`, first site by default; `SITE_NAME=all` after check)                                                 |
| Content Eval Mphasis users active/password/Date Created attribute (one-time) | **editContentevalMphasisUsers** (`tests/oneTimeScripts/`, `NODE_ENV=contenteval`, FileName defaults to contentevalMphasisUsers)                                                |
| Create areas (learning areas)                                                | **createArea** or **createAreaWithSingleWorker**                                                                                                                               |
| Create assignments                                                           | **createAssignment**                                                                                                                                                           |
| Fill the activity dashboard                                                  | **createDataInActivityDashboard**                                                                                                                                              |
| Turn on AI Coach                                                             | **enableAiCoachSettings**                                                                                                                                                      |
| AI Coach default-user demos                                                  | **createDataInAiCoachForDefaultUsers** (includes full-user chats + weekly sessions)                                                                                            |
| AI Coach admin dashboard                                                     | **createDataInAiCoachDashboard** (`USERCOUNT` 50/100/150…, npm default 100; includes pool chats)                                                                               |
| Full AI Coach (settings + defaults + dashboard)                              | **fullAiCoachCommand**                                                                                                                                                         |
| Split managers vs learners for manager dashboard                             | **createDataInManagerDashboard** (`NODE_ENV` e.g. percipiodemo)                                                                                                                |
| Create courses in LX Studios                                                 | **createCourseInLXStudios** / **createCourseInLXStudiosAllOrgs** (all orgs); **createCourseInLXStudiosInConfigOrg** (active config org only); plus parent/child/EU/US variants |
| Create banners (including in another language)                               | **createJustBanner**, **createFrenchBanner**, **createGermanBanner**, etc.                                                                                                     |
| Remove all assignments                                                       | **removeAllAssignments**                                                                                                                                                       |
| Full first-time setup for an org                                             | **initialSetup**                                                                                                                                                               |

The summary document has **all 140+** commands grouped by feature. Use it as your "index" to find the right script.

---

## 7. Where does the test data come from? (Which file does each script read?)

Scripts **don't type data by hand**. They read from **files** in the **`testData/`** folder. So if you want to change _what_ gets created (e.g. different user names, different area names), you edit the right file in **`testData/`**.

**How does a script know which file to read?**  
Many scripts use **environment variables** set in **`package.json`**, for example:

- **FileName=…** → canonical env for **which test data file(s)** to use (basename, no path). One basename, or **two comma-separated basenames** when the script needs both (order is documented per script—e.g. playlist,user list, or users,badge data). **Exception:** `createAndShareContentToChildSites` ignores **FileName** for targeting — share PUT replaces the child list, so it always shares to every child org.
- **SITE_NAME=…** → which **child site(s)** to run on (comma-separated). **Exception:** `createAndShareContentToChildSites` ignores **SITE_NAME** for the same reason.

**Where exactly are the files?**  
Under **`testData/`**. Here is a simple map:

| testData folder / file                                                                        | Used for (examples)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **usersData/** (e.g. defaultUsers.json, presales1bUsers.json)                                 | User lists for creating users, playlists, badges, skill benchmark.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **AreaTestData/** (AreaTestData.json, etc.)                                                   | Areas, journeys, skill benchmark data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **AssignmentTestData/** (assignmentData.json, etc.)                                           | Assignments.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **badgesTestData/** (badgesOne.json, earnBadgesForSalesTeam.json)                             | Badges and journey/track data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **BannerData/** (bannerDataOne.json, bannerDataTwo.json)                                      | Banners (with Locale=French/German/Japanese/Mandarin for language).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **channelTestData/** (channelData.json, akaraLXChannel.json)                                  | Channels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **certificationPaths/** (certificationPathData.json)                                          | Certification path flows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **contentConfig/** (contentConfig.json)                                                       | Content config.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **customLandingPages/** (e.g. AIAcademy, AkaraLxpage.json)                                    | Custom landing pages: **FileName** = JSON basename; **AUDIENCE_NAME** env or **audienceName** on a row for root audience UUID lookup.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **DynamicContent/**                                                                           | Dynamic content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **LxStudios/** (PPT, Conversation, Assessment, CourseCreation, KnowledgeSource, MediaLibrary) | All LX Studios content (PPT, conversation, assessment, course, knowledge source, media).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **PlayListData/** (playListDataOne.json, etc.)                                                | Playlists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **learningPrograms/** (learningprogramData.json)                                              | Learning programs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **childSites/** (childSitesConfig.json, platformeval21-50.json, proservices46-48.json, etc.)  | Child sites (**FileName** = JSON basename under this folder).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **aiCoach/** (aiCoachDashboardData.json)                                                       | AI Coach dashboard mix (roles, assessments, chats).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **quesandAnswers/**                                                                           | Assessment/benchmark questions (used by Certitude and skill benchmark).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **terminationandnewHire/** (`hireAndTerminate.xlsx` or `.csv`)                                | Hire/termination data. Set **`FileName=<basename>`** (no extension); the run uses **`basename.xlsx`** if present, else **`basename.csv`**. Columns **Email ID** and **Business Process Name** or **Business Process**; header row may be below title rows. **Termination** or **End Contingent Worker Contract** → inactive-user flow; **Hire**, **Hire Employee**, or **Change Job** → same hire path (look up → active skip / inactive reactivate / missing create) when hostname matches percipiodemo/contenteval; same email on hire and terminate: later **Effective Date** wins (hire later → hire only, no deactivate; terminate later → terminate only); any other status → skipped (logged; no changes). Full sheet run is **serial**. npm: `ucmDeactivateTerminatedFromSheet`, `ucmHireFromSheet`, `ucmHireAndDeactivateFromSheet`. For **contenteval**, **`export NODE_ENV=contenteval`** then the same deactivate command (or override **`FileName`** on the **`npx playwright test …`** line). |
| **Deactivate active users except keep list**                                                  | No test data file. **`npm run ucmDeactivateAllExceptKeepListFromOrg`** — set **`NODE_ENV`** first (e.g. **`percipioeval`**). Deactivates all **active** users except keep list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Enable LX Studio accessor (Skillsoft users)**                                               | **`npm run enableLxStudioAccessorForSkillsoftUsers`** — set **`NODE_ENV`** (e.g. **`percipiodemo`**). Bulk-sets LX accessor on existing active `@skillsoft.com` users. For **newuser\_\*** pool accounts, LX is already set on the **Excel/CSV import** (`isLXStudioAccessor=true`). There is **no create script** for that pool — see **section 7a**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Inactivate external users by month**                                                        | **`npm run ucmInactivateExternalUsersFromSiteForMonth`** — **`USERS_EXPORT_MONTH`** required; export CSV, filter, inactivate. Multi-site monthly: **`npm run ucmInactivateExternalUsersMonthlyCron`** (sites in **`monthlyExternalUserSites.json`**, Jenkins 6th ~8:00 AM IST).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

**Example:**  
The command **createAssignment** uses **FileName=assignmentData**. So it reads from **`testData/AssignmentTestData/assignmentData.json`** (or the file that your project maps from "assignmentData"). If you add more assignments in that file, the next run will create more.

So: **To change what a script creates**, find **`FileName`** (and comma-separated pairs when documented) for that npm script in **`package.json`**, then edit the matching file(s) under **`testData/`**.

---

## 7a. Percipio Demo — commands after adding a `newuser_*` pool

There is **no Playwright create script** for `newuser_N@skillsoft.com`. Creation is done by **importing an Excel/CSV directly in the site** (User Management import). Do not keep a one-off import file in this repo.

**`enableLxStudioAccessorForSkillsoftUsers` is not a follow-on for this pool.** LX Design Studio access is set on that import (`isLXStudioAccessor=true` in the spreadsheet). Use the npm command only if you need to turn LX on for **existing** `@skillsoft.com` users that were not imported that way.

The three sales-team commands were wired in **`package.json`** to **`FileName=…presales1bUsers`**. They do **not** create accounts. They run **after** the users exist in the org.

**Before those three:** put the new emails in **`testData/usersData/presales1bUsers.json`** (or point **`FileName`** at another users JSON). If you skip that, playlists / benchmarks / badges still hit the old 101–200 list only.

**Run on Percipio Demo** (`export NODE_ENV=percipiodemo`), in this order:

| #   | Command                                          | Why                                                                |
| --- | ------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | **`npm run createPlaylistsForSalesTeam`**        | Playlists from `playListDataOne` for each email in the users JSON. |
| 2   | **`npm run completeSkillBenchmarkForSalesTeam`** | Completes the benchmarks listed in that same JSON.                 |
| 3   | **`npm run earnBadgesForSaleTeam`**              | Completes assignments/journeys from `earnBadgesForSalesTeam`.      |

Password those three assume: set locally in the spec or config.

**Do not run as part of this seed:**

- **`enableLxStudioAccessorForSkillsoftUsers`** — already done on the import spreadsheet.
- **`ucmHireFromSheet` / `ucmHireAndDeactivateFromSheet`** — **consumes** a placeholder (`newuser_N` → real hire). Not data population.
- **`createUsers` / `createDefaultUsers`** — different emails (`@noemail.com` / default roster).
- **`appendNamedLicencePoolsToAudience`** — org licence mapping (Region / Skillsoft), not per new user. Run only if pools are missing on the audience.
- Jenkins cron dashboard commands — they pick org users; they are not this pool’s follow-on list.

---

## 8. What is "parallel execution" (workers)? Does this script use it?

**In simple words:**  
Normally the computer runs **one task after another**. With **parallel execution**, it runs **several tasks at the same time** (like several workers working together). That makes the script **finish faster**.

**In this project we use Playwright's "workers."**  
You see it in **`package.json`** as **`--workers=2`** or **`--workers=10`** or **`--workers 20`** etc. The number = how many things can run at the same time.

**Which scripts use parallel execution (and with how many workers)?**  
Many do. Examples:

- **createArea** → workers=3
- **createChildSites** → workers=2
- **listChildSites** → default workers (single utility test; logs parent + child org IDs)
- **createBannersForChildSites** → workers=2
- **createCustomLandingPages** → workers=2; **AUDIENCE_NAME** + **FileName** (see package.json defaults)
- **CERT_PATH_1_createCertificationPathJourneys** → workers=10
- **createDataInSkillBenchmarkDashboardWithExistingData** → workers=10
- **createJustBanner**, **createFrenchBanner**, etc. → workers 20
- **createPlaylistsForSalesTeam** → workers 40
- **editUserInChildSite** → workers=5
- **uploadKnowledgeSource** → workers=5
- **increaseVisitorsAndUCAInExecutiveDashboard** → workers 5
- **populateDataInCaisyDashboard** → workers 10

**So:**

- **Yes, many scripts use parallel execution.**
- **To see for a specific script:** Open **`package.json`**, search for that script name, and look for **`--workers=`** or **`--workers `** in the same line.

**Why use it?**  
To finish faster when we create many items (e.g. many banners, many playlists, many certification paths). More workers = faster, but we don't set it too high so the server and machine can handle it.

---

## 9. What is cron? (Why do we run things on a schedule?)

**Cron** = a **timer** that tells Jenkins to start a job **automatically** at certain times, without a person clicking "Build."

**Why do we use it here?**  
We want **dashboards and demo data** on many orgs to stay **fresh** (new activity, new badges, new skill benchmark data, etc.). If we didn't run scripts on a schedule, someone would have to run them by hand every time. Cron does it for us so we don't forget and so every org gets updated.

---

## 10. When does cron run? (The schedule in plain English)

The Jenkins pipeline has a **cron trigger** defined in the **Jenkinsfile**:

**Schedule:**

- **Months:** April, June, August, October, December (5 months in a year).
- **Days of the month:** 1st, 2nd, 3rd, 4th (only these 4 days).
- **Hours:** From hour 0 (midnight) to hour 12 (noon) — so 13 runs per day (one per hour).

So in each of those 5 months, on each of the first 4 days, we get **13 runs per day** (one per hour). Each run targets **one org** (which org is decided by the **day + hour** using **`testData/jenkins/jenkins-config.json`** — the **orgMapping** and **hourMapping**). So we spread the work across many orgs over the month.

**Summary:**  
Cron runs **only in those 5 months**, on **days 1–4**, between **midnight and noon** (one run per hour). Each run executes **14 commands** (see section 11) for **one org**. That's why we say we have **many automated runs per month** in "cron months."

---

## 11. Why are these 14 commands in cron? What is "bimonthly data population"?

The **14 commands** that run on every cron trigger are listed in **`testData/jenkins/jenkins-config.json`** under **commandInfo**. They are:

1. createDataInActivityDashboard
2. earnJourneyAndTrackBadgesForExistingUsers
3. grantXpPointsForDefaultAndRandomUsers
4. completeAssignments (runs 2 times)
5. createDataInSkillBenchmarkDashboardWithAspiring
6. createDataInSkillsDiscoveryDashboardUsingCron
7. increaseViewcountInActivityDashboard
8. CERT_PATH_2_createDataInCertificationDashboard
9. skillGainFromNoviceAdvanced
10. skillGainFromAspiringDeveloping
11. createDataInSkillBenchmarkDashboardWithDevelopingForLB
12. createDataInSkillBenchmarkDashboardWithProficientForLB
13. increaseVisitorsAndUCAInExecutiveDashboard
14. mobileExecutiveDashboard

**What is this for?**  
This is **scheduled data population** so that:

- **Activity dashboard** has recent activity and view counts.
- **Learners** (existing users) earn **badges** and **complete assignments**.
- **Skill benchmark dashboard** has data for different levels (Aspiring, Developing, Proficient) and leaderboard.
- **Skills discovery dashboard** has search/usage data.
- **Certification dashboard** has certification path data.
- **Executive dashboard** has visitors, UCA, and mobile data.

So **"bimonthly data population"** (or more precisely, **scheduled data population in those 5 months**) means: **we automatically refill these dashboards and metrics every month (on the first 4 days, every hour) so demos and reports always look live and realistic**, without anyone doing it by hand.

**Why these 14?**  
They were chosen to cover the **main dashboards and demo data** that need to stay fresh. Each has a **timeout** (e.g. 10–40 minutes) in **jenkins-config.json** so one slow run doesn't block the rest.

---

## 12. What is "single org" vs "multiple orgs"? (singleOrMultipleOrgs)

When you run a command from Jenkins, you can choose:

- **TriggerInSingleOrg**  
  Run on **one org only**. You **must** pick the **url** (e.g. https://presales1.percipio.com). The script runs once for that org.

- **presalesParentSites**  
  Run the same command on **presales parent sites only** (`presales1`–`presales25`).

- **allParentSites**  
  Run on **all parent sites**: the 25 numbered presales parents plus these other parent orgs from `jenkins-config.json` `urlToOrgIdMap`: `akara`, `percipiocore`, `percipiodemo`, `platformtest`, `contenteval`, `federal`, `learnvantagedemo`, `smbsandbox`. (Not child, proservices, or platform eval.)

- **presalesChildSites**  
  Same idea, but for **presales child sites**.

- **presalesAseries**, **presalesBseries**  
  Same idea for **A-series** and **B-series** presales orgs.

- **TriggerInProservicesSites**  
  Run on **all proservices sites**.

- **TriggerInPlatformEval**  
  Run on **platform eval** sites.

- **TriggerInAllSites**  
  Run on **all sites** (the full list). Use with care; it can take a long time.

So: **"single org"** = one URL you chose. **"Multiple orgs"** = Jenkins runs the same command for many orgs, one by one (or in batches depending on the pipeline). You pick the **group** (presales parent, proservices, etc.) from **singleOrMultipleOrgs**.

---

## 13. What is "environment" (prod, dev, preval)?

**Environment** = **which "world" we are talking to**: production-like (**prod**), development (**dev**), or pre-validation (**preval**). Each has different **server URLs and settings** in the **`config/`** folder (e.g. prod.json, dev.json, preval.json). When you choose **environment** in Jenkins, the pipeline uses that config so the script hits the right servers. So **prod** = real-like data, **dev** = dev servers, **preval** = preval servers.

---

## 14. What is an "org" or "site"? What is the URL dropdown?

**Org** = **organization** = **site** = one learning-platform instance (e.g. one company's or one tenant's site). We have **230** such sites in the Jenkins org map (including **platformeval01–platformeval100**). Each has a **URL** (e.g. https://presales1.percipio.com). The **URL dropdown** in Jenkins lists **231** of these URLs so you can pick **which org** to run your command on when you use **TriggerInSingleOrg**. The run list is **`testData/jenkins/jenkins-config.json`** (`urlToOrgIdMap`).

---

## 15. What is Docker and why do we use it here?

**Docker** = a way to run the tests inside a **small, clean "box" (container)** that has everything needed (Node, npm, Playwright, etc.) and nothing else. So:

- Every run is **the same** (same versions, no "it works on my machine").
- We don't mess up your laptop (or the Jenkins agent) with extra installs.
- We can run many jobs without them interfering with each other.

In this project, Jenkins **builds a Docker image** and then **runs your command inside a new container** for each run. So when you click Build, Jenkins doesn't run the script directly on the server; it runs it **inside Docker**. The scripts in **`scripts/jenkins/`** (e.g. build-docker-image.sh, run-docker-tests.sh) do that.

---

## 16. What are "removal" or "cleanup" scripts?

Many scripts **create** things (users, areas, assignments, banners, etc.). **Removal** scripts **delete** those things so we can start fresh or clean up. Examples:

- **removeAllAssignments** — delete all assignments.
- **removeOnlyBanners**, **removeOnlyStrips**, **removeOnlyChannels**, **removeOnlyJourneys** — delete only those types.
- **removeAreas** — remove areas (and linked content) in the right order.
- **removeAllLearningPrograms**, **removeAllCustomLandingPages** — remove learning programs or custom landing pages.
- **deleteAllContainers**, **deleteAssessmentContainers**, **deleteCaisyContainers**, **deletePPTContainers** — delete LX Studios content containers.
- **CERT_PATH_REMOVE_removePublishedCertPaths** — remove published certification paths.

So: **if you want to "undo" or "clean up" what a create script did, there is usually a matching remove script.** For the full list of removal commands, see **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`) (sections on removal/cleanup and content containers).

---

## 17. What are "composite" scripts? (run-s)

Some **commands** don't run just one test file; they run **several commands one after another**. In **package.json** you see **`npx run-s`** for those. Examples:

- **initialSetup** = run-s listAttributeCreation, editOrgSettings, createDefaultUsers, editProfileForDefaultUsers, createRegionAudienceAndAddAdmin (5 steps).
- **cronJobCommand** = 19 steps (activity, badges, skill benchmark, executive dashboard, etc.).
- **fullCommandForEditingAssignments** = editAssignments, editAssignmentDashboard, increaseViewcountInActivityDashboard.
- **fullLearningProgramCommand** = createLearningPrograms, createDataInLearningProgramDashboard.
- **fullAiCoachCommand** = enableAiCoachSettings, createDataInAiCoachForDefaultUsers, createDataInAiCoachDashboard (default-user chats and pool chats included).
- **removeStripsAndBannersAndAreasAndAssignments** = removeOnlyStrips, removeOnlyBanners, removeAreas, removeAllAssignments (4 steps).

So **composite** = **one command that runs multiple other commands in order.** You run **one name** and the rest happen automatically.

---

## 18. Quick reference: "I want to do X — what do I do?"

| I want to…                                  | What to do                                                                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Run one script on one org**               | Jenkins → Build with Parameters → pick **url**, **command**, **environment**, admin credentials, **singleOrMultipleOrgs = TriggerInSingleOrg** → Build.                   |
| **Run one script on many orgs**             | Jenkins → pick **command**, **singleOrMultipleOrgs** (e.g. presalesParentSites or allParentSites), **environment**, admin credentials → Build. (URL can be empty.)        |
| **Find what a command does**                | See section 6 in this doc for examples; full list with descriptions is in **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`).        |
| **Change the data a script uses**           | Find the script in **package.json** → see **`FileName`** (comma-separated when the script uses two datasets) → edit the matching file in **`testData/`** (see section 7). |
| **See if a script uses parallel execution** | Open **package.json** → search for the script name → look for **`--workers=`** or **`--workers `** on that line.                                                          |
| **Understand cron**                         | Read sections 9, 10, 11 in this document. Config: **`testData/jenkins/jenkins-config.json`** (commandInfo, orgMapping, hourMapping).                                      |
| **Do a full first-time setup for an org**   | Run **initialSetup** for that org (one URL, TriggerInSingleOrg).                                                                                                          |
| **Clean up after creating things**          | Use the matching **remove** command (e.g. removeAllAssignments, removeOnlyBanners); see section 16 and the summary doc.                                                   |

---

## 19. Words you might not know (glossary)

| Word                         | Meaning in this project                                                                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API**                      | A way for the script to talk **directly to the server** (no browser). Fast and stable. Most of our tests are API.                                                                                          |
| **UI**                       | **User interface** = the browser. UI tests **click and type** like a real user. We use UI when we need to see the page (e.g. banners, some dashboards).                                                    |
| **Org**                      | **Organization** = one learning-platform **site** (one URL). We have 230 orgs in the Jenkins org map.                                                                                                      |
| **Site**                     | Same as **org**.                                                                                                                                                                                           |
| **Cron**                     | A **schedule** that starts the Jenkins job **automatically** at set times (no one clicks Build).                                                                                                           |
| **Command**                  | The **name** of one automation script we can run (e.g. createUsers, createArea). Same as in **package.json** and Jenkins dropdown.                                                                         |
| **Spec**                     | Short for **specification** = a **test file** (e.g. createArea.spec.js). One spec file can have many test cases.                                                                                           |
| **Worker**                   | In **parallel execution**, a **worker** is one "thread" doing work. **--workers=5** means up to 5 things run at the same time.                                                                             |
| **FTE**                      | **Full-time equivalent** = one person working full time. We say automation saves "1.5 FTE" meaning it does the work of 1.5 people.                                                                         |
| **Dashboard**                | A **screen in the product** that shows charts and numbers (e.g. activity dashboard, skill benchmark dashboard, executive dashboard). We have scripts that **fill** these with data so they look realistic. |
| **Test data**                | The **files** in **testData/** that scripts **read** to know what to create (user names, area names, assignment titles, etc.).                                                                             |
| **Environment**              | **Which set of servers** we use: **prod**, **dev**, or **preval** (see section 13).                                                                                                                        |
| **Docker**                   | A **container** that runs the tests in an isolated, repeatable way (see section 15).                                                                                                                       |
| **Jenkins**                  | The **tool** that runs our pipeline: build, run command, save reports. You open Jenkins in the browser and click "Build with Parameters."                                                                  |
| **Pipeline**                 | The **sequence of steps** in Jenkins (load config, build Docker, run tests, archive reports). Defined in **Jenkinsfile**.                                                                                  |
| **Composite script**         | A **command** that runs **several other commands** in order (e.g. initialSetup, cronJobCommand). See section 17.                                                                                           |
| **Removal / cleanup script** | A **command** that **deletes** data (assignments, banners, areas, etc.) so we can start fresh. See section 16.                                                                                             |

---

## 20. Summary: read this and you can explain it yourself

After reading this document you should be able to:

1. **Say what this project is** (automation that creates and manages test data on many orgs).
2. **Find where things are** (tests in `tests/`, data in `testData/`, commands in `package.json`, Jenkins flow in `Jenkinsfile`).
3. **Run a script** (Jenkins with the right parameters, or `npm run <command>` locally).
4. **Find which script does what** (section 6 in this doc; full list in **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`)).
5. **Know where test data comes from** (`testData/`; see **`FileName`** in `package.json` for each command).
6. **Know if a script uses parallel execution** (look for **`--workers=`** in `package.json` for that command).
7. **Explain why we have cron** (to keep dashboards and demo data fresh without manual work).
8. **Explain when cron runs** (5 months, first 4 days, midnight–noon, 13 runs/day; each run = one org, 14 commands).
9. **Explain what "bimonthly/scheduled data population" is for** (automatically refilling activity, badges, skill benchmark, certification, executive dashboards so demos look live).
10. **Explain single vs multiple orgs, environment, Docker, removal scripts, and composite scripts** (sections 12–17).

If something is still unclear, use the **Quick reference** (section 18) and the **Glossary** (section 19). For the full list of every command and what it does, open **`automated-features-summary`** (`.cursor/skills/automated-features-summary/SKILL.md`).
