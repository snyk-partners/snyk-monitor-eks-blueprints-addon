import * as blueprints from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOn } from '../dist';

const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION!;
const integrationId = process.env.INTEGRATION_ID;

const eksBuilder = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(new SnykMonitorAddOn({ integrationId: integrationId }));

export const pipeline = blueprints.CodePipelineStack.builder()
    .name("snyk-monitor-eks-blueprints-addon-pipeline")
    .owner("snyk-partners")
    .repository({
        repoUrl: 'ssp-eks-extension',
        credentialsSecretName: 'ssp-pipeline-github-token',
        targetRevision: 'develop'
    })
    .stage({
        id: 'us-east-1-snyk-monitor-eks-blueprints-addon-test',
        stackBuilder: eksBuilder.clone(region)
    });
