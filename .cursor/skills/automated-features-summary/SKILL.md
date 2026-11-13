---
name: automated-features-summary
description: >-
  Full list of npm/Jenkins commands by feature with one-line descriptions (PPT-ready). Use when you need every script name or to sync docs with Jenkins.
---

# Automated Features & Scripts Summary (PPT-Ready)

**Role of this skill:** PPT / leadership one-liners by feature.  
**Canonical command catalog:** **`docs/Tracking-all-sites-commands.csv`**. Names must match **`package.json`** / Jenkins — never invent a script name here.  
**Agents coding the framework:** use **rules-md** + **framework-standards**, not this file as the folder map.

This document lists scripts that appear in the Jenkins `command` dropdown and what each does (env vars where useful).

---

## Executive summary — by the numbers (for higher management)

Use these on your first slides to set the scale and impact. All numbers are derived from the repo or estimated from script complexity and cron usage.

### Headline metrics

| #   | Metric                               | Value                                    | Why it matters                                                                                                                |
| --- | ------------------------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Sites / orgs supported**           | **230**                                  | One automation suite serves 200+ tenant sites (presales, proservices, platform eval, federal, etc.) without adding headcount. |
| 2   | **Automation scripts**               | **148+**                                 | Every major data-setup and dashboard task is a one-click (or scheduled) run instead of manual work.                           |
| 3   | **Test specs (automation coverage)** | **86**                                   | Underlying test coverage for API + UI flows that power those 140 scripts.                                                     |
| 4   | **Product areas fully automated**    | **19**                                   | From user management and assignments to certifications, LX Studios, Caisy, and executive dashboards.                          |
| 5   | **Scheduled runs per month (cron)**  | **420+**                                 | 14 commands × ~30 runs/month: activity, badges, skill benchmark, executive dashboard, and more run unattended.                |
| 6   | **Time saved**                       | **~250 hrs/month** · **~3,000 hrs/year** | Equivalent to 1.5 people working full time on data setup and site refreshes.                                                  |
| 7   | **Money saved**                      | **~$150,000/year**                       | At ~$50/hr blended rate; or stated as **~1.5 FTE** cost avoided.                                                              |
| 8   | **Manual steps replaced per year**   | **50,000+**                              | Conservative: 230 sites × multiple operations per script × runs per year. Real impact is “no manual data entry at scale.”     |

### One-liners for slides (pick and adapt)

- **Scale:** “We support **230 sites** with **148+ automation scripts** and **86 test specs**—no extra headcount.”
- **Efficiency:** “**~250 hours per month** saved—the equivalent of **1.5 FTEs** or **~$150k per year**.”
- **Reliability:** “**420+ automated runs per month** (cron) keep dashboards and demo data fresh across all sites—consistently, with zero manual errors.”
- **Coverage:** “**19 product areas** automated end-to-end: users, content, certifications, LX Studios, Caisy, and executive reporting.”
- **Before/after:** “What would take 2–3 people **weeks** to do manually now runs **unattended in hours**.”

### Risk and quality (why this matters to leadership)

- **Consistency:** Same data quality and structure across all 230 sites; no “one org was missed” or copy-paste mistakes.
- **Repeatability:** Any script can be re-run in minutes for a single org or all orgs; no dependency on tribal knowledge.
- **Scalability:** Adding more sites means adding config, not people; the same automation scales.

---

## 1. User & Profile Management

| Script                                            | What It Does (High Level)                                                                                                                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **addRoleAndAspirationRole**                      | Adds role and aspiration role attributes to users via addRoleandAspirationRole.spec.js.                                                                                                      |
| **addUsStrategicContentCollectionsAttribute**     | ONE-TIME (`tests/oneTimeScripts/`): creates Content Collections list attribute on US Strategic child URLs from FileName JSON (default usStrategicSiteAdmins). Not from config.               |
| **addUsStrategicContentCollectionsAudiences**     | ONE-TIME (`tests/oneTimeScripts/`): one audience per Content Collections value (name = value). Default first site only; SITE_NAME=all for the rest.                                          |
| **addUsStrategicContentCollectionsLicencePools**  | ONE-TIME (`tests/oneTimeScripts/`): maps each same-named license pool to its Content Collections audience. Default first site; SITE_NAME=all for the rest.                                   |
| **addUsStrategicSiteAdmins**                      | ONE-TIME (`tests/oneTimeScripts/`): Site Admin + instructor + LX access/publish on US Strategic child URLs from FileName JSON (default usStrategicSiteAdmins). Not from config.              |
| **apiSafari**                                     | Creates one user (USERCOUNT=1) using Safari config; acreateUser.spec.js.                                                                                                                     |
| **createUserForAssignment**                       | Creates assignment assigner users (`Talent_Enablement_<random>`); USERCOUNT defaults to 1 in npm; acreateUserForAssignment.spec.js.                                                          |
| **createUsers**                                   | Creates users; set USERCOUNT (default 1); acreateUser.spec.js.                                                                                                                               |
| **createDefaultUsers**                            | Creates default users via createDefaultUsers.spec.js.                                                                                                                                        |
| **createLearningAdminAndCollectionLearners**      | ONE-TIME (`tests/oneTimeScripts/`): 1 Learning Admin + 17 collection learners (Created By = admin). NODE_ENV e.g. percipioeval.                                                              |
| **createUserThenPlaylist**                        | Creates USERCOUNT=3 users then playlists from FileName=playListDataOne (playListCreationAfterCreatingNewUsers.spec.js).                                                                      |
| **editContentevalMphasisUsers**                   | ONE-TIME (`tests/oneTimeScripts/`): Content Eval listed users → active, password from JSON, Date Created DATE attribute 9/11/26. Missing users logged as no user found. NODE_ENV=contenteval. |
| **editProfileForDefaultUsers**                    | Edits profile (e.g. picture) for default users (editUserProfilePicture).                                                                                                                     |
| **getPersonaUsersForCaisyDashboardTestData**      | Gets default users for Caisy dashboard test data (getUsers.spec.js, 'Get default users').                                                                                                    |
| **getUsersForCaisyDashboardFromAllOrgs**          | Caisy user export: all orgs in map; userCount=240; logs tab-separated rows (no Excel file).                                                                                                  |
| **getUsersForCaisyDashboardFromAllOrgsQuickTest** | Same flow; userCount=10, orgLimit=3.                                                                                                                                                         |
| **getUsersForCaisyDashboardFromConfigOrg**        | Active config org only; userCount=240; logs rows only (no Excel file).                                                                                                                       |

---

## 2. Licence Pools & Audiences

| Script                                               | What It Does (High Level)                                                                                                                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **appendAllOrgLicencePoolsToAudience**               | Fetches all licence pools returned for the org and maps each to the audience; no compare gate vs testData expected list; appendAllOrgLicencePoolsToAudience.spec.js; AUDIENCE_NAME (npm defaults to Region). |
| **appendNamedLicencePoolsToAudience**                | Named pools from testData/LicencePool JSON to audience; appendNamedLicencePoolsToAudience.spec.js; AUDIENCE_NAME (npm defaults to Region).                                                                   |
| **checkLicencepoolsAndAppendToAudience**             | Compares org pools to testData expected list, then appends to audience only when no pools are “missing”; appendLicencePoolToAudience.spec.js; AUDIENCE_NAME (npm defaults to Region).                        |
| **checkLicencepoolsAndAppendToAudienceForChildSite** | Same for child sites; appendLicencePoolToAudienceForChildSites.spec.js; AUDIENCE_NAME (npm defaults to Region).                                                                                              |
| **createRegionAudienceAndAddAdmin**                  | Creates region, audience, and adds admin (createAudienceandAddAdmin).                                                                                                                                        |

---

## 3. Assignments & Course Completion

| Script                                                 | What It Does (High Level)                                                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **completeAssignments**                                | Completes assignments; pass FileName (e.g. badgesOne) and numberOfTimesToRunScript (e.g. 8) to control data and runs.                                |
| **completeCoursesForExistingUsersAndEarnCourseBadges** | Marks courses complete for existing users and earns course badges; set FileName and DYNAMIC=false, courseCompletion.spec.js @cucc.                   |
| **completeCoursesForMultipleUsersAndEarnCourseBadges** | Creates USERCOUNT=2 users then course completion and earns badges (acreateUser + courseCompletion @cucc).                                            |
| **completeSkillBenchmarkForSalesTeam**                 | Completes skill benchmark for sales team; pass **FileName** (e.g. presales1bUsers). Percipio Demo post-import set: see how-to-use-automation **7a**. |
| **createAssignment**                                   | Creates assignments from FileName=assignmentData (createAssignment.spec.js).                                                                         |
| **editAssignments**                                    | Edits existing assignments from FileName=editAssignmentData (editExistingAssignment.spec.js).                                                        |
| **editAssignmentDashboard**                            | Edits assignment dashboard data (editAssignmentDashboars).                                                                                           |
| **fullCommandForEditingAssignments**                   | Runs editAssignments, editAssignmentDashboard, then increaseViewcountInActivityDashboard.                                                            |
| **removeAllAssignments**                               | Removes all assignments (removeallAssignments).                                                                                                      |

---

## 4. Areas, Channels & Subjects (Content Structure)

| Script                                                        | What It Does (High Level)                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **createArea**                                                | Creates areas from test data; pass FileName (e.g. AreaTestData); 3 workers.      |
| **createAreaWithSingleWorker**                                | Same as createArea with single worker (FileName=AreaTestData).                   |
| **createAreaWithSingleWorkerThenChannelsAndAppendToSubjects** | Runs createAreaWithSingleWorker then createChannelsAndAppendToSubjects.          |
| **createChannelsAndAppendToSubjects**                         | Creates channels from FileName=channelData and appends to subjects.              |
| **createAkaraLXChannel**                                      | Creates Akara LX channel from FileName=akaraLXChannel.                           |
| **removeOnlyChannels**                                        | Removes all channels (removeallChannels).                                        |
| **removeOnlyJourneys**                                        | Removes all journeys (removeallJourneys).                                        |
| **removeAreas**                                               | Runs removeOnlyJourneys then removeAreasWithExistingContentLinked.               |
| **removeAreasWithExistingContentLinked**                      | Clears areas that have existing content linked (clearAreasWithExisitingContent). |

---

## 5. Child Sites & Multi-Tenant

| Script                                         | What It Does (High Level)                                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **createChildSites**                           | Creates child sites via Admin API; createChildSites.spec.js, 2 workers.                                                                |
| **createChildSitesOnlyNew**                    | Creates only child sites that don’t exist yet (ONLY_NEW=true); same spec as createChildSites.                                          |
| **createChildSitesFromFile**                   | Creates child sites from file; set **FileName** (e.g. proservices46-48; JSON under testData/childSites).                               |
| **createAndShareContentToChildSites**          | Creates/reuses published linked content on the parent and shares it to **every** child org. Share PUT replaces the site list — never a FileName/SITE_NAME subset. |
| **createAndShareContentToChildSitesByDomains** | Same as **createAndShareContentToChildSites** (always every child; `SITE_NAME` is ignored).                                                                        |
| **createAndShareContentToChildSitesFromFile**  | Same as **createAndShareContentToChildSites** (always every child; **FileName** is ignored).                                                                       |
| **createAreaForChildSites**                    | Creates areas for child sites via Admin API.                                                                                           |
| **createBannersForChildSites**                 | Creates banners for child sites via UI; bannerCreationForChildSites.spec.js, 2 workers.                                                |
| **editUserInChildSite**                        | Edits users in child sites via UI; runs across child sites, 5 workers.                                                                 |
| **editUserInChildSiteSpecific**                | Edits users in one child site; set SITE_NAME (e.g. proservices041).                                                                    |
| **editUserInChildSiteFromFile**                | Edits users in child sites from file; set **FileName**, 3 workers.                                                                     |
| **prevalChildSitesSetup**                      | Preval (pre-validation) setup for child sites; prevalChildSitesSetup.spec.js.                                                          |

---

## 6. Certification Paths

| Script                                                                | What It Does (High Level)                                                                                           |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **CERT_PATH_1_createCertificationPathJourneys**                       | Creates cert path journeys from FileName=certificationPathData; @onetimescript, 10 workers.                         |
| **CERT_PATH_2_createDataInCertificationDashboard**                    | Creates data in certification dashboard from same file; @datascript, 3 workers.                                     |
| **CERT_PATH_3_createStartedDataInCertificationDashboard**             | Creates 'started' state data in certification dashboard; @started, 2 workers.                                       |
| **CERT_PATH_4_createPracticingObtainingDataInCertificationDashboard** | Creates practicing/obtaining data in certification dashboard; @practicingobtaining.                                 |
| **CERT_PATH_5_createDefaultCertDataInCertificationDashboard**         | Creates default cert path data; @defaultcertpathsdata.                                                              |
| **CERT_PATH_REMOVE_removePublishedCertPaths**                         | Removes published certification paths; FileName=certificationPathData; retireCertificationPaths.spec.js, 5 workers. |

---

## 7. Content & Configuration

| Script                                        | What It Does (High Level)                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| **createContentConfig**                       | Creates content config from FileName=contentConfig (createContentConfig.spec.js). |
| **createCustomContent**                       | Creates custom/link content via createLinkContent.spec.js.                        |
| **createDynamicContent**                      | Creates dynamic content from FileName=dynamicContent.                             |
| **createDynamicAndContentConfigAndCertitude** | Runs createDynamicContent, createContentConfig, createCertitudeCourses.           |
| **createCertitudeCourses**                    | Creates Certitude courses via certitude.spec.js.                                  |

---

## 8. Landing Pages

| Script                            | What It Does (High Level)                                                                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **createCustomLandingPages**      | Custom landing pages; **FileName** + optional **AUDIENCE_NAME** (root audience; else first **audienceName** in JSON). Defaults in npm: Region, AIAcademy. 2 workers. |
| **convertLandingPageApiResponse** | Converts sample API response to test data; scripts/runners/convertSampleToTestData.js.                                                                               |
| **removeAllCustomLandingPages**   | Removes all custom landing pages via removalApis/removeallCustomLandingPages.spec.js.                                                                                |

---

## 9. Dashboards – Activity, Skills & Discovery

| Script                                                     | What It Does (High Level)                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **createDataInActivityDashboard**                          | Populates activity dashboard; set numberOfTimesToRunScript (e.g. 4) to control runs.                                                                                                                                                                                                                                           |
| **createDataInLearningProgramDashboard**                   | Creates data in learning program dashboard from FileName=learningprogramData.                                                                                                                                                                                                                                                  |
| **createDataInManagerDashboard**                           | Fetches all org users (paginated), splits `@skillsoft.com` + TeamManager roleUuid vs `@noemail.com` + role=learner, then sets `direct_manager` — 10 unique learners per manager, no overlap.                                                                                                                                   |
| **editComplianceSettings**                                 | One-time org completion criteria: minimumTestScore 70 and viewAllCourses false (content-player-settings APIs; FileName=riskAndReadinessTimelinessData).                                                                                                                                                                        |
| **createRiskAndReadinessTimelinessAssignments**            | Creates 16 compliance assignments (today startDate, 30 Region learners via userUuids; cohort = learner role + allowed email, shuffled; logs loginName/id; FileName=riskAndReadinessTimelinessData).                                                                                                                            |
| **createDataInRiskAndReadinessAssessmentsSection**         | Populates Assessments tab via learner course-test API; shared 30-learner cohort; 7 courses in parallel inside one test; grant completion in batches of 15; FileName=riskAndReadinessTimelinessData.                                                                                                                            |
| **createDataInRiskAndReadinessTimelinessSection**          | Grants on-time/late/overdue completions for 30-user cohort; logs which users are in each bucket per assignment; run after due date (minimumDaysAfterCreateBeforeComplete in test data).                                                                                                                                        |
| **fullRiskAndReadinessInsightsSetupCommand**               | Runs editComplianceSettings, createRiskAndReadinessTimelinessAssignments, then createDataInRiskAndReadinessAssessmentsSection (Timeliness complete is a separate run after wait).                                                                                                                                              |
| **createDataInSkillBenchmarkDashboard**                    | Skill benchmark dashboard data; set USERCOUNT and CATEGORYTYPE (e.g. Aspiring), acreateUser + skillBenchMark @benchmarkData.                                                                                                                                                                                                   |
| **createDataInSkillBenchmarkDashboardGraph**               | Runs Aspiring, Developing, and Proficient skill benchmark dashboard data in sequence for full graph.                                                                                                                                                                                                                           |
| **createDataInSkillBenchmarkDashboardWithAspiring**        | Skill benchmark data for “Aspiring” category only.                                                                                                                                                                                                                                                                             |
| **createDataInSkillBenchmarkDashboardWithDeveloping**      | Skill benchmark data for “Developing” category only.                                                                                                                                                                                                                                                                           |
| **createDataInSkillBenchmarkDashboardWithDevelopingForLB** | Skill benchmark for Learning Board: Developing, 1 bench per subject, USERCOUNT=40.                                                                                                                                                                                                                                             |
| **createDataInSkillBenchmarkDashboardWithExistingData**    | Skill benchmark using existing user file; set FileName (timestamp), DYNAMIC=false, CATEGORYTYPE=Developing, 10 workers.                                                                                                                                                                                                        |
| **createDataInSkillBenchmarkDashboardWithNovice**          | Skill benchmark data for “Novice” category.                                                                                                                                                                                                                                                                                    |
| **createDataInSkillBenchmarkDashboardWithProficient**      | Skill benchmark data for “Proficient” category.                                                                                                                                                                                                                                                                                |
| **createDataInSkillBenchmarkDashboardWithProficientForLB** | Skill benchmark for Learning Board: Proficient, 1 bench per subject, USERCOUNT=40.                                                                                                                                                                                                                                             |
| **createDataInSkillsDiscoveryDashboard**                   | Creates users (USERCOUNT=180) and top-searched-words data for Skills Discovery (@topwords).                                                                                                                                                                                                                                    |
| **createDataInSkillsDiscoveryDashboardUsingCron**          | Same as above with USERCOUNT=50 for cron/scheduled runs.                                                                                                                                                                                                                                                                       |
| **createFixedSkillBenchmarkDataForDefaultUsers**           | Creates fixed skill benchmark data for default users (skillBenchMarkDataForDefaultUsers).                                                                                                                                                                                                                                      |
| **createRandomSkillBenchmarkDataForDefaultUsers**          | Creates random skill benchmark for default users; FileName=AreaTestData, NUMBEROFBENCHFROMEACHSUB=1, DYNAMIC=false, CATEGORYTYPE='Developing Advanced'.                                                                                                                                                                        |
| **grantXpPointsForDefaultAndRandomUsers**                  | Grants XP points to default and random users via RAS xpPointsForDefaultAndRandomUsers.spec.js.                                                                                                                                                                                                                                 |
| **increaseViewcountInActivityDashboard**                   | Increases view counts in activity dashboard (increaseViewsInActivityDashBd).                                                                                                                                                                                                                                                   |
| **increaseVisitorsAndUCAInExecutiveDashboard**             | executiveDashboard.spec.js: config `fullyParallel: false`; spec uses `test.describe.configure({ mode: 'parallel' })` so visitor + API tests share workers (`--workers`); 11 API launches per learner run in parallel inside the API test.                                                                                      |
| **mobileExecutiveDashboard**                               | Same spec with `mobiledevice.js` (`fullyParallel: false`); parallel group + workers as above; 11 content launches per learner in parallel inside the API test.                                                                                                                                                                 |
| **skillGainFromAspiringDeveloping**                        | Skill gain data Aspiring to Developing; USERCOUNT=12, CATEGORYTYPE='Aspiring Developing', 3 bench per subj.                                                                                                                                                                                                                    |
| **skillGainFromNoviceAdvanced**                            | Skill gain data Novice to Advanced; USERCOUNT=12, CATEGORYTYPE='Novice Advanced', 3 bench per subj.                                                                                                                                                                                                                            |
| **ucmDeactivateTerminatedFromSheet**                       | `deactivateOrAddUsers.spec.js --grep @ucmDeactivateFromSheet`: **Termination** → inactive; non–Hire/Change Job/Termination statuses → skipped (logged). Default **`FileName=contentevalDeactivateInfogainApr23`** in npm script (sheet basename under **testData/terminationandnewHire/**).                                    |
| **ucmDeactivateAllExceptKeepListFromOrg**                  | `ucmDeactivateAllExceptKeepListFromOrg.spec.js`: config org via **`NODE_ENV`**; get all users, deactivate every active except Kowshik.Bikkina@skillsoft.com and Clayton.Crouch@skillsoft.com. Before/after summary in logs.                                                                                                    |
| **ucmHireFromSheet**                                       | Same spec `--grep @ucmHireFromSheet`: **Hire** / **Change Job** rows for percipiodemo + contenteval (site-gated skips). **`FileName`** basename for sheet file.                                                                                                                                                                |
| **ucmHireAndDeactivateFromSheet**                          | Same spec, no grep: deactivate + hire. Same-email hire+terminate: later Effective Date wins. **`FileName=<basename>`** → `.xlsx` or `.csv`; see `readTerminationList.js`.                                                                                                                                                      |
| **ucmInactivateExternalUsersFromSiteForMonth**             | `ucmInactivateExternalUsersFromSiteForMonth.spec.js`: export CSV, filter by month/year, inactivate external learners via UCM search + PUT. **`USERS_EXPORT_MONTH`** required.                                                                                                                                                  |
| **ucmInactivateExternalUsersMonthlyCron**                  | Multi-site monthly runner: sites from `monthlyExternalUserSites.json`, generates `config/runtimeOrg.json`, IST month−2, then runs inactivate per site. Jenkins: 6th ~8:00 AM IST.                                                                                                                                              |
| **enableLxStudioAccessorForSkillsoftUsers**                | `enableLxStudioAccessorForSkillsoftUsers.spec.js`: active users with loginName/externalId `@skillsoft.com`; PUT `is_lx_studio_accessor: true`. Set **`NODE_ENV`** (e.g. percipiodemo). For `newuser_*` pool users, LX is set on Excel/CSV import in the site (no create script). Backfill only — how-to-use-automation **7a**. |

---

## 10. Goals, Playlists & Live Learning

| Script                             | What It Does (High Level)                                                                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **createGoals**                    | Creates goals and streak data via goalsCreationandStreak.spec.js.                                                                                          |
| **createPlaylistForExistingUsers** | Creates playlists for existing users; **`FileName=playlistBasename,userBasename`** (e.g. playListDataOne,defaultUsers).                                    |
| **createPlaylistsForSalesTeam**    | Creates playlists for sales team; **`FileName=playListDataOne,presales1bUsers`**, 40 workers. Percipio Demo post-import set: how-to-use-automation **7a**. |
| **createPlaylistAndLiveCourses**   | Runs createPlaylistForExistingUsers then createILTLiveCourses.                                                                                             |
| **createILTLiveCourses**           | Creates instructor-led live courses via Admin createLiveCourse.spec.js.                                                                                    |
| **removePlaylistForDefaultUsers**  | Removes playlists for default users (playlistdeletion).                                                                                                    |

---

## 11. Badges & Recognition

| Script                                          | What It Does (High Level)                                                                                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **earnBadgesForDefaultUsers**                   | Earns course badges for default users; earnCourseBadges.spec.js, 7 workers.                                                                                                       |
| **earnBadgesForSaleTeam**                       | Earns badges for sales team; **`FileName=presales1bUsers,earnBadgesForSalesTeam`** (users then badge JSON basename). Percipio Demo post-import set: how-to-use-automation **7a**. |
| **earnJourneyAndTrackBadgesAfterCreatingUsers** | Creates USERCOUNT=10 users then earns journey/track badges from FileName=badgesOne.                                                                                               |
| **earnJourneyAndTrackBadgesForDefaultUsers**    | Earns journey and track badges for default users; set FileName (e.g. badgesOne), earnBadgesForDefUsers.                                                                           |
| **earnJourneyAndTrackBadgesForExistingUsers**   | Earns journey/track badges for existing users; set FileName and numberOfTimesToRunScript (e.g. 4).                                                                                |
| **getAllBadgesForCurrentUsers**                 | Runs createDataInActivityDashboard then earnJourneyAndTrackBadgesForExistingUsers.                                                                                                |

---

## 12. Banners & Strips (UI / Promo)

| Script                                           | What It Does (High Level)                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **createFrenchBanner**                           | Creates banners in French; DYNAMIC=false, FileName=bannerDataTwo, Locale=French, 20 workers. |
| **createGermanBanner**                           | Creates banners in German locale; same vars, Locale=German.                                  |
| **createJapaneseBanner**                         | Creates banners in Japanese; FileName=bannerDataTwo, Locale=Japanese, 20 workers.            |
| **createMandarinChineseBanner**                  | Creates banners in Mandarin Chinese; Locale='Mandarin Chinese', 20 workers.                  |
| **createJustBanner**                             | Creates banners only; DYNAMIC=false, FileName=bannerDataOne, 20 workers, headed.             |
| **createLocaleBannerWithWorkers**                | Creates locale banners; DYNAMIC=false, FileName=bannerDataTwo, 20 workers, headed.           |
| **createStrips**                                 | Creates strips; DYNAMIC=false, FileName=stripDataOne (createStrip.spec.js).                  |
| **removeOnlyBanners**                            | Removes all banners (removeallBanners).                                                      |
| **removeOnlyStrips**                             | Removes all strips (removeallStrips).                                                        |
| **removeStripsAndBannersAndAreasAndAssignments** | Runs removeOnlyStrips, removeOnlyBanners, removeAreas, removeAllAssignments.                 |

---

## 13. LX Studios – Courses, PPT, Conversations, Assessments

| Script                                                   | What It Does (High Level)                                                                                                                                |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **createPPTInLXStudios**                                 | Creates PPT content in LX Studios from test data; all entries; npm `--workers=2`.                                                                        |
| **createPPTInLXStudiosSpecific**                         | Creates one specific PPT by name in LX Studios; npm `--workers=1`.                                                                                       |
| **createPPTInLXStudiosMultiple**                         | Creates multiple PPTs in LX Studios in one run; npm `--workers=2`.                                                                                       |
| **createConversationInLXStudios**                        | Creates conversation (AI/sim) content in LX Studios; npm `--workers=2`.                                                                                  |
| **createConversationInLXStudiosSpecific**                | Creates one specific conversation by title; npm `--workers=1`.                                                                                           |
| **createConversationInLXStudiosMultiple**                | Creates multiple conversations in one run; npm `--workers=2`.                                                                                            |
| **createAssessmentInLXStudios**                          | Creates assessments in LX Studios; npm `--workers=2`.                                                                                                    |
| **createAssessmentInLXStudiosSpecific**                  | Creates one specific assessment by name; npm `--workers=1`.                                                                                              |
| **createAssessmentInLXStudiosMultiple**                  | Creates multiple assessments in one run; npm `--workers=2`.                                                                                              |
| **createCourseInLXStudios**                              | Creates courses in LX Studios in all sites; siteType=TriggerInAllSites, lxCourseCreationTestData.json; optional courseCreationTestName filters by title. |
| **createCourseInLXStudiosAllOrgs**                       | Same as **createCourseInLXStudios** (explicit all-org alias).                                                                                            |
| **createCourseInLXStudiosInConfigOrg**                   | Same spec; siteType=TriggerInConfigOrg — only **Environment.baseURL** / **orgId** from active config (`NODE_ENV`).                                       |
| **createCourseInLXStudiosInParentSites**                 | Creates LX Studios courses in parent sites only.                                                                                                         |
| **createCourseInLXStudiosInAllChildSites**               | Creates LX Studios courses in all child sites.                                                                                                           |
| **createCourseInLXStudiosInEUParentSites**               | Creates courses in EU parent sites only.                                                                                                                 |
| **createCourseInLXStudiosInEUAllSites**                  | Creates courses in all EU sites (parent + child).                                                                                                        |
| **createCourseInLXStudiosInEUChildSites**                | Creates courses in EU child sites only.                                                                                                                  |
| **createCourseInLXStudiosInUSParentSites**               | Creates courses in US parent sites only.                                                                                                                 |
| **createCourseInLXStudiosInUSAllSites**                  | Creates courses in all US sites.                                                                                                                         |
| **createCourseInLXStudiosInUSChildSites**                | Creates courses in US child sites only.                                                                                                                  |
| **updateCourseThumbnailAndKnowledgeSource**              | Updates course thumbnails and knowledge sources (all sites).                                                                                             |
| **updateCourseThumbnailAndKnowledgeSourceInParentSites** | Same for parent sites only.                                                                                                                              |
| **updateCourseThumbnailAndKnowledgeSourceInChildSites**  | Same for child sites only.                                                                                                                               |
| **updateCourseThumbnailAndKnowledgeSourceInConfigOrg**   | Same spec; siteType=TriggerInConfigOrg — thumbnail/knowledge source/publish for **Environment.baseURL** / **orgId** only (active config).                |
| **uploadKnowledgeSource**                                | Uploads knowledge sources to LX Studios from test data; all projects; npm `--workers=5`.                                                                 |
| **uploadKnowledgeSourceSpecific**                        | Uploads knowledge source for one project; set PROJECT_NAME (e.g. 'Akara Digital Customer Experience Launch'); npm `--workers=1`.                         |
| **uploadMediaLibrary**                                   | Uploads media library in LX Studios; all from test data; npm `--workers=2`.                                                                              |
| **uploadMediaLibrarySpecific**                           | Uploads media for one project; set PROJECT_NAME (e.g. 'Media Library'); npm `--workers=1`.                                                               |

**Recommended run order** for a full LX refresh (assets → PPT → conversation → assessment → course → metadata): **`uploadKnowledgeSource`** → **`uploadMediaLibrary`** → **`createPPTInLXStudios`** → **`createConversationInLXStudios`** → **`createAssessmentInLXStudios`** → **`createCourseInLXStudios`** → **`updateCourseThumbnailAndKnowledgeSource`**. Details and cleanup options: **README.md** (TestData commands, step 46 — LX Studios) and **high-level-scripts-and-features** skill.

_Operational (not npm):_ Replicating one prod **course/container** into multiple test orgs via **`content-intelligence`** PostgreSQL is done by **DBA** (EU **EUDC** vs US **USDC**). JIRA: **[DBA-15336](https://skillsoftdev.atlassian.net/browse/DBA-15336)** (EU) · **[DBA-15338](https://skillsoftdev.atlassian.net/browse/DBA-15338)** (US). Same note under **README** § LX Studios.

---

## 14. Caisy & AI / Feedback Dashboards

| Script                                     | What It Does (High Level)                                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **populateDataInCaisyDashboard**           | Populates Caisy dashboard with AI simulation data; aISimulation.spec.js, 10 workers.                                  |
| **populateDataInFeatureUsageReport**       | Populates feature usage report; set numberOfTimesToRunScript and FileName=aiAssistantTestData (FeatureUsage.spec.js). |
| **populateDataInLearnerFeedbackDashboard** | Populates learner feedback dashboard (LearningFeedbackDashBoard).                                                     |

---

## 14b. AI Coach (Percipio, not CAISY)

| Script                                 | What It Does (High Level)                                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **enableAiCoachSettings**              | Turns on AI Coach org settings (all learners, pulse 60 days).                                                                                                         |
| **createDataInAiCoachForDefaultUsers** | Seeds default demo logins with matched role, skill, and goal. Untouched hit GET data only (Not started). Full users also get 2–3 chats and a weekly session per chat. |
| **createDataInAiCoachDashboard**       | Seeds USERCOUNT other learners (must be a multiple of 50, npm default 100) with mixed roles, skills, assessments, and one 2–3 turn chat per assessed person (same N). |
| **fullAiCoachCommand**                 | Runs enableAiCoachSettings, createDataInAiCoachForDefaultUsers, then createDataInAiCoachDashboard (default-user chats and pool chats included).                       |

---

## 15. Content Containers (LX Studios Cleanup)

| Script                         | What It Does (High Level)                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **deleteAllContainers**        | Deletes all LX Studio content containers in workspace; set WorkspaceName (e.g. Kowshik).           |
| **deleteAssessmentContainers** | Deletes only assessment containers; set WorkspaceName, grep 'assessments'.                         |
| **deleteCaisyContainers**      | Deletes only Caisy (conversation) containers; set WorkspaceName, grep 'caisyForYou'.               |
| **deletePPTContainers**        | Deletes only PPT/presentation practice containers; set WorkspaceName, grep 'presentationPractice'. |

---

## 16. Organization & Initial Setup

| Script                    | What It Does (High Level)                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **initialSetup**          | Full initial setup: listAttributeCreation, editOrgSettings, createDefaultUsers, editProfileForDefaultUsers, createRegionAudienceAndAddAdmin. |
| **listAttributeCreation** | Creates list attributes via listAttributeCreation.spec.js.                                                                                   |
| **listChildSites**        | Logs parent orgId and all child site orgIds/domains (Admin APIs).                                                                            |
| **editOrgSettings**       | Edits org settings via editOrgSettings.spec.js.                                                                                              |

---

## 17. Learning Programs

| Script                         | What It Does (High Level)                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **createLearningPrograms**     | Creates learning programs from FileName=learningprogramData via Admin createLearningProgram.spec.js. |
| **fullLearningProgramCommand** | Runs createLearningPrograms then createDataInLearningProgramDashboard.                               |
| **removeAllLearningPrograms**  | Removes all learning programs via removalApis/removeallLearningPrograms.spec.js.                     |

---

## 18. Journeys & Tracks

| Script                            | What It Does (High Level)                                                |
| --------------------------------- | ------------------------------------------------------------------------ |
| **createNewLabJourneys**          | Creates new lab journeys from FileName=NewLabJourney (areaCreationTemp). |
| **updateTracksForCustomJourneys** | Updates tracks for custom journeys via Admin editCustomJourney.spec.js.  |

---

## 19. Scheduled / Master Commands

| Script             | What It Does (High Level)                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **cronJobCommand** | Full cron pipeline: earnJourneyAndTrackBadgesForExistingUsers, createDataInActivityDashboard, createDataInSkillsDiscoveryDashboard, skill benchmark (Novice/Aspiring/Developing/Proficient), skill gains, LB dashboards, executive dashboard, mobile exec, increaseViewcountInActivityDashboard. Used for scheduled Jenkins runs to keep demo data fresh. |

---

## Summary: Feature Areas Automated

1. **User & profile management** – Create users, roles, profiles, and persona data.
2. **Licence & audience** – Licence pools, audiences, regions, admins.
3. **Assignments & completion** – Create, edit, complete assignments; course and badge completion.
4. **Content structure** – Areas, channels, subjects, journeys.
5. **Child sites & multi-tenant** – Child site creation, content sharing, user editing per site.
6. **Certification paths** – Paths, dashboard data, started/practicing/obtaining, cleanup.
7. **Content & config** – Content config, custom/dynamic content, Certitude courses.
8. **Landing pages** – Custom landing pages, test data conversion, removal.
9. **Dashboards** – Activity, learning program, skill benchmark, skills discovery, executive (desktop & mobile), XP, view counts, visitors/UCA.
10. **Goals, playlists & ILT** – Goals, playlists, live courses.
11. **Badges** – Course, journey, and track badges for default/sales/existing users.
12. **Banners & strips** – Multi-locale banners and strips, cleanup.
13. **LX Studios** – PPT, conversations, assessments, courses (all/parent/child/EU/US), thumbnails, knowledge source, media library, publish, container cleanup.
14. **Caisy & AI** – Caisy dashboard, feature usage, learner feedback.
15. **Org & setup** – List attributes, org settings, initial full setup.
16. **Learning programs** – Create, dashboard population, removal.
17. **Journeys & tracks** – Lab journeys, custom journey track updates.
18. **Cron / master** – Single command to refresh many dashboards and data on a schedule.

All of the above scripts are the ones available in the Jenkins **command** dropdown and are the ones you can use for your PPT as “automated features” and “what each script is for.”
