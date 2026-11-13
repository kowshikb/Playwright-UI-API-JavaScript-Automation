// Optional check. Run this when you want to see if the focus skills on the org still match the sheet.
// It does not save roles, skills, or ratings. It is not part of the persona run.
//
// For each learner in the file:
// 1. Sign in as that login. If the login is not in this org, that person is skipped.
// 2. Find the current role and the next role by name.
// 3. Read the focus skills the org has on that role.
// 4. Compare those names with the sheet. A name that is missing or extra is logged. The run still finishes.

import {
  test,
  logger,
  config,
  generateToken,
  generateTokenLearner,
  reusableFunctions,
  getAllUserApi,
  searchCustomJobRolesApi,
  userKgFocusSkillsApi,
} from "../../../path.js";

const fileName = (process.env.FileName || "skillsIntelligencePersonasTestsi")
  .replace(/\.json$/i, "")
  .trim();

const personas = reusableFunctions.readDatafromJsonFilenotasync(
  reusableFunctions.getPath("testData/skillIntelligence", `${fileName}.json`),
);

test.describe.configure({ mode: "parallel" });

for (const persona of personas) {
  test(`${persona.loginName}`, async ({ request }) => {
    test.setTimeout(500000);
    await comparePersona(request, persona);
  });
}

// Sign in, then check both roles. A mismatch is written in the log. This does not stop the run.
async function comparePersona(request, persona) {
  const adminJwt = await generateToken(request);
  const orgUsers = (await getAllUserApi(request, adminJwt))?.users || [];
  const learner = orgUsers.find(
    (user) =>
      (user.loginName || "").toLowerCase() === persona.loginName.toLowerCase(),
  );
  if (!learner) {
    logger.info(`${persona.loginName} is not in this org — skipped`);
    return [];
  }

  const learnerToken = await generateTokenLearner(
    request,
    persona.loginName,
    config.get("Admindata").password,
  );
  const roleChecks = [
    {
      roleName: persona.currentRoleName,
      sheetSkills: persona.currentFocusSkills,
    },
    {
      roleName: persona.aspirationalRoleName,
      sheetSkills: persona.aspirationalFocusSkills,
    },
  ];
  for (const roleCheck of roleChecks) {
    await compareOneRole(
      request,
      learnerToken,
      persona.loginName,
      roleCheck.roleName,
      roleCheck.sheetSkills,
    );
  }
}

// Look up the role, read the org list, and say what matches the sheet.
async function compareOneRole(
  request,
  learnerToken,
  loginName,
  roleName,
  sheetSkills,
) {
  const roles = await searchCustomJobRolesApi(request, learnerToken, roleName);
  const match = roles.find((role) =>
    reusableFunctions.sameName(role.jobRoleName, roleName),
  );
  if (!match?.jobRoleUuid) {
    logger.error(`${loginName} | ${roleName} was not found in this org`);
    return;
  }

  const orgSkills = await userKgFocusSkillsApi(
    request,
    learnerToken,
    match.jobRoleUuid,
    roleName,
  );
  const sheetNames = (sheetSkills || []).map((skill) => skill.skillName);
  const matchedNames = [];
  const missingNames = [];
  for (const sheetSkill of sheetSkills || []) {
    const orgSkill = orgSkills.find((skill) =>
      reusableFunctions.sameName(skill.skillName, sheetSkill.skillName),
    );
    if (!orgSkill) {
      missingNames.push(sheetSkill.skillName);
      continue;
    }
    matchedNames.push(
      `${sheetSkill.skillName} (sheet ${sheetSkill.selfRating}, org ${orgSkill.selfRating ?? "none"})`,
    );
  }
  const extraNames = orgSkills
    .filter(
      (skill) =>
        !sheetNames.some((sheetName) =>
          reusableFunctions.sameName(sheetName, skill.skillName),
        ),
    )
    .map((skill) => skill.skillName);

  logger.info(
    `${loginName} | ${roleName} | matched ${matchedNames.length}: ${matchedNames.join(", ") || "none"}`,
  );
  if (!missingNames.length && !extraNames.length) {
    logger.info(`${loginName} | ${roleName} | focus skills match the sheet`);
    return;
  }
  if (missingNames.length) {
    logger.error(
      `${loginName} | ${roleName} | these focus skills from the sheet are not selected:`,
    );
    for (const skillName of missingNames) {
      logger.error(`${loginName} | ${roleName} | ${skillName}`);
    }
  }
  if (extraNames.length) {
    logger.error(
      `${loginName} | ${roleName} | these focus skills are selected, and they are not on the sheet:`,
    );
    for (const skillName of extraNames) {
      logger.error(`${loginName} | ${roleName} | ${skillName}`);
    }
  }
}
