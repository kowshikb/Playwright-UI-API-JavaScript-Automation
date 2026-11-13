// One-time fix for the four learners whose focus skills did not reach 5 on the org.
// Priority 1: keep every sheet skill that is mapped to that role on the org.
// Priority 2: if a sheet skill is not mapped to that role on the org, pick the closest nearby skill mapped to that role.
// Roles that already have 5 focus skills are left alone.
//
// Run: NODE_ENV=testsi npx playwright test tests/oneTimeScripts/fixUnmatchedFocusSkills.spec.js

import {
  test,
  logger,
  config,
  generateToken,
  generateTokenLearner,
  reusableFunctions,
  getAllUserApi,
  searchCustomJobRolesApi,
  roleSkillsKgApi,
  saveFocusSkillsKgApi,
  rateFocusSkillKgApi,
  userKgFocusSkillsApi,
} from "../../path.js";

const personas = reusableFunctions.readDatafromJsonFilenotasync(
  reusableFunctions.getPath(
    "testData/skillIntelligence",
    "skillsIntelligencePersonasTestsi.json",
  ),
);

// Only the 4 users and 5 roles that do not have 5 focus skills on the org.
const rolesToFix = [
  { loginName: "Savion_Rau_1", fixCurrent: true, fixNext: false },
  { loginName: "Okey_Kohler_2", fixCurrent: false, fixNext: true },
  { loginName: "Susan_Yost_3", fixCurrent: true, fixNext: false },
  { loginName: "Kyleigh_Ullrich_4", fixCurrent: true, fixNext: true },
];

// Explicit preferred nearby candidates per missing sheet skill name (in priority order).
const preferredNearbyBySheetSkill = {
  "consumer research and insights": [
    "Consumer Insights",
    "Market and Customer Insight Analysis",
    "Market Research",
  ],
  "change management and transformation": [
    "Organizational Change Management",
    "Change Management (PPM)",
    "Change Management",
  ],
  "critical thinking and logical reasoning": [
    "Critical Reasoning",
    "Critical Thinking",
    "Analytical Thinking",
    "Decision-Making and Judgment",
    "Problem Analysis",
  ],
  "data collection and information gathering": [
    "Data Collection",
    "Data Literacy",
    "Data Management",
    "Data Governance",
    "Data Analysis",
    "Quantitative Data Analysis",
    "Qualitative Data Analysis",
    "Research and Information Gathering",
  ],
  "data interpretation and insight generation": [
    "Insight Generation",
    "Data-Driven Business Analysis",
    "Data Analysis",
    "Data Visualization and Communication",
    "Data Visualization",
    "Business Intelligence (BI)",
    "Quantitative Data Analysis",
  ],
  "onboarding and employee integration": [
    "Employee Onboarding",
    "Employee Engagement",
    "Employee Experience",
    "Employee Relations",
    "Organizational Change Management",
    "Learning and Development",
  ],
  "talent acquisition and recruitment": [
    "Talent Acquisition",
    "Recruiting",
    "Workforce Planning",
    "Employer Branding",
  ],
};

test("Bring the 5 roles on the 4 users up to 5 focus skills using sheet skills first and nearby role skills second", async ({
  request,
}) => {
  test.setTimeout(300000);
  const adminJwt = await generateToken(request);
  const orgUsers = (await getAllUserApi(request, adminJwt))?.users || [];

  for (const fix of rolesToFix) {
    const persona = personas.find(
      (row) => row.loginName.toLowerCase() === fix.loginName.toLowerCase(),
    );
    const learner = orgUsers.find(
      (user) =>
        (user.loginName || "").toLowerCase() === fix.loginName.toLowerCase(),
    );
    if (!persona || !learner) {
      logger.info(`${fix.loginName} is not in the sheet or this org — skipped`);
      continue;
    }
    const learnerToken = await generateTokenLearner(
      request,
      persona.loginName,
      config.get("Admindata").password,
    );
    if (fix.fixCurrent) {
      await replaceRoleFocusSkills(
        request,
        learnerToken,
        persona.loginName,
        persona.currentRoleName,
        persona.currentFocusSkills,
      );
    }
    if (fix.fixNext) {
      await replaceRoleFocusSkills(
        request,
        learnerToken,
        persona.loginName,
        persona.aspirationalRoleName,
        persona.aspirationalFocusSkills,
      );
    }
  }
});

// Score word overlap between a missing sheet skill and an available org skill on the role.
function wordOverlapScore(sheetSkillName, roleSkillName) {
  const stopWords = new Set(["and", "for", "the", "in", "of", "to", "with"]);
  const tokenize = (text) =>
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));
  const sheetWords = tokenize(sheetSkillName);
  const roleWords = tokenize(roleSkillName);
  let score = 0;
  for (const sWord of sheetWords) {
    for (const rWord of roleWords) {
      if (sWord === rWord) {
        score += 3;
      } else if (
        (sWord.length >= 4 && rWord.startsWith(sWord.slice(0, 4))) ||
        (rWord.length >= 4 && sWord.startsWith(rWord.slice(0, 4)))
      ) {
        score += 1;
      }
    }
  }
  return score;
}

// Pick the best nearby skill from the role's mapped skills that has not been picked yet.
function pickNearbyRoleSkill(sheetSkillName, skillsOnRole, usedIds) {
  const available = skillsOnRole.filter((skill) => !usedIds.has(skill.id));
  const preferredList =
    preferredNearbyBySheetSkill[(sheetSkillName || "").trim().toLowerCase()] ||
    [];
  for (const preferredName of preferredList) {
    const match = available.find((skill) =>
      reusableFunctions.sameName(skill.name, preferredName),
    );
    if (match) return match;
  }
  let bestSkill = null;
  let bestScore = -1;
  for (const candidate of available) {
    const score = wordOverlapScore(sheetSkillName, candidate.name);
    if (score > bestScore) {
      bestScore = score;
      bestSkill = candidate;
    }
  }
  return bestSkill || available[0] || null;
}

// Find the role, map every sheet skill to an exact or nearby role skill, save all 5, and rate each skill.
async function replaceRoleFocusSkills(
  request,
  learnerToken,
  loginName,
  roleName,
  sheetSkills,
) {
  const roles = await searchCustomJobRolesApi(request, learnerToken, roleName);
  const role = roles.find((item) =>
    reusableFunctions.sameName(item.jobRoleName, roleName),
  );
  if (!role?.jobRoleUuid) {
    logger.info(`${loginName} | ${roleName} was not found in this org — skipped`);
    return;
  }
  const skillsOnRole = await roleSkillsKgApi(
    request,
    learnerToken,
    role.jobRoleUuid,
    roleName,
  );
  logger.info(
    `${loginName} | ${roleName} | mapped role skills (${skillsOnRole.length}): ${skillsOnRole.map((s) => s.name).join(", ")}`,
  );

  const usedIds = new Set();
  const chosen = [];

  // Pass 1: reserve exact sheet skill matches so a nearby fallback never steals an exact skill.
  for (const sheetSkill of sheetSkills || []) {
    const exactOnRole = skillsOnRole.find((skill) =>
      reusableFunctions.sameName(skill.name, sheetSkill.skillName),
    );
    if (exactOnRole?.id) {
      usedIds.add(exactOnRole.id);
    }
  }

  // Pass 2: build the 5 skills in sheet order using exact match first, nearby role skill second.
  for (const sheetSkill of sheetSkills || []) {
    const exactOnRole = skillsOnRole.find((skill) =>
      reusableFunctions.sameName(skill.name, sheetSkill.skillName),
    );
    if (exactOnRole?.id) {
      chosen.push({
        skillId: exactOnRole.id,
        skillName: exactOnRole.name,
        sheetSkillName: sheetSkill.skillName,
        selfRating: sheetSkill.selfRating,
        isNearby: false,
      });
      continue;
    }
    const nearby = pickNearbyRoleSkill(
      sheetSkill.skillName,
      skillsOnRole,
      usedIds,
    );
    if (!nearby?.id) {
      logger.info(
        `${loginName} | ${roleName} | no available skill on role for ${sheetSkill.skillName}`,
      );
      continue;
    }
    usedIds.add(nearby.id);
    logger.info(
      `${loginName} | ${roleName} | replaced missing sheet skill "${sheetSkill.skillName}" with nearby role skill "${nearby.name}" (rating ${sheetSkill.selfRating})`,
    );
    chosen.push({
      skillId: nearby.id,
      skillName: nearby.name,
      sheetSkillName: sheetSkill.skillName,
      selfRating: sheetSkill.selfRating,
      isNearby: true,
    });
  }

  await saveFocusSkillsKgApi(
    request,
    learnerToken,
    role.jobRoleUuid,
    chosen.map((skill) => skill.skillId),
    roleName,
    loginName,
  );
  for (const skill of chosen) {
    await rateFocusSkillKgApi(
      request,
      learnerToken,
      skill.skillId,
      skill.selfRating,
      skill.skillName,
      loginName,
    );
  }
  const savedOnOrg = await userKgFocusSkillsApi(
    request,
    learnerToken,
    role.jobRoleUuid,
    roleName,
  );
  logger.info(
    `${loginName} | ${roleName} | verified org focus skills count: ${savedOnOrg.length} -> ${savedOnOrg.map((s) => `${s.skillName} (${s.selfRating ?? "none"})`).join(", ")}`,
  );
}
