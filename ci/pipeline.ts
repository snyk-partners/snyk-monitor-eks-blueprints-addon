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
        repoUrl: 'snyk-monitor-eks-blueprints-addon',
        credentialsSecretName: 'snyk-monitor-addon-github-token',
        targetRevision: 'main'
    })
    .stage({
        id: 'snyk-monitor-addon-test',
        stackBuilder: eksBuilder.clone(config.region)
    });
