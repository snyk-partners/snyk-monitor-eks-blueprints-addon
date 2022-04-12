let config: {
    account: string;
    region: string;
    stackId: string;
    integrationId: string;
}

export const defaultStackId = 'snyk-monitor-eks-blueprints-addon';

config = {
    account: process.env.CDK_DEFAULT_ACCOUNT!, // e.g. 492635582501
    region: process.env.CDK_DEFAULT_REGION!,
    stackId: process.env.STACK_ID || defaultStackId,
    integrationId: process.env.INTEGRATION_ID!, // e.g. abcd1234-abcd-1234-abcd-1234abcd1234
}

export default config;
