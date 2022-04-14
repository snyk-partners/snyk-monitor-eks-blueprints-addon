export const defaultStackId = 'snyk-monitor-eks-blueprints-addon';
const config = {
  account : process.env.CDK_DEFAULT_ACCOUNT!, // e.g. 492635582501
  region : process.env.CDK_DEFAULT_REGION!,
  stackId : process.env.STACK_ID || defaultStackId,
  integrationId : process.env.INTEGRATION_ID, // e.g. abcd1234-abcd-1234-abcd-1234abcd1234
};

export default config;
