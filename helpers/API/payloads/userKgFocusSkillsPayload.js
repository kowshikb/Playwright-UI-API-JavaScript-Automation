// This is the focus-skill list the Career Center role page shows.
// The older userFocusSkills call returns a different list.
export function userKgFocusSkillsPayload(jobRoleId) {
  return [
    {
      operationName: "userKGFocusSkills",
      variables: {
        locale: "en-US",
        jobRoleId,
      },
      query:
        "query userKGFocusSkills($jobRoleId: ID!, $locale: String = \"en-US\") {\n  skilzUserFocusSkills: skilzUserKGFocusSkills(jobRoleId: $jobRoleId, locale: $locale) {\n    skillId\n    skillName\n    skillDesc\n    selfRating: rating\n    targetRating\n    __typename\n  }\n}\n",
    },
  ];
}
