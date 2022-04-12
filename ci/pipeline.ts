import * as blueprints from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOn } from '../dist';
import config from '../lib/config';

const eksBuilder = blueprints.EksBlueprint.builder()
    .account(config.account)
    .region(config.region)
    .addOns(new SnykMonitorAddOn({ integrationId: config.integrationId }));

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
        stackBuilder: eksBuilder.clone(config.region)
    });
