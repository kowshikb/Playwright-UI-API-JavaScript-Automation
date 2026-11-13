import {
  headerData,
  urlData,
  userKgFocusSkillsPayload,
  expect,
  logger,
} from "../../../path.js";

// Read the focus skills the role page shows for this role. Does not save anything.
export async function userKgFocusSkillsApi(request, jwt, jobRoleId, roleName) {
  try {
    const response = await request.post(urlData.userKgFocusSkillsUrl, {
      data: userKgFocusSkillsPayload(jobRoleId),
      headers: headerData.userFocusSkillsHeaders(jwt, "application/json"),
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const errors = body?.[0]?.errors || body?.errors || [];
    if (errors.length) {
      throw new Error(errors.map((error) => error.message).join("; "));
    }
    const focusSkills = body?.[0]?.data?.skilzUserFocusSkills || [];
    logger.info(`Loaded ${focusSkills.length} focus skills for ${roleName}`);
    return focusSkills;
  } catch (error) {
    logger.error(`Could not load focus skills for ${roleName}: ${error.message}`);
    throw error;
  }
}
