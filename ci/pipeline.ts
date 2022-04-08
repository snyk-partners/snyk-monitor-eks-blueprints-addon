#!/usr/bin/env node
import * as ssp from '@aws-quickstart/ssp-amazon-eks'
import { SnykMonitorAddOn } from '../dist'

const account = process.env.CDK_DEFAULT_ACCOUNT!
const region = process.env.CDK_DEFAULT_REGION!
const integrationId = process.env.INTEGRATION_ID

const eksBuilder = ssp.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(new SnykMonitorAddOn({ integrationId: integrationId }));

export const pipeline = ssp.CodePipelineStack.builder()
    .name("ssp-addon-snyk-monitor-pipeline")
    .owner("snyk-partners")
    .repository({
        repoUrl: 'ssp-eks-extension',
        credentialsSecretName: 'ssp-pipeline-github-token',
        targetRevision: 'develop'
    })
    .stage({
        id: 'us-east-1-snyk-monitor-ssp-addon-test',
        stackBuilder: eksBuilder.clone(region)
    });
