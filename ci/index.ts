#!/usr/bin/env node
import * as ssp from '@aws-quickstart/ssp-amazon-eks'
import { SnykMonitorAddOn } from '../dist'

const account = process.env.ACCOUNT
const region = process.env.REGION
const integrationId = process.env.INTEGRATION_ID

export const blueprintCd = ssp.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(new SnykMonitorAddOn({ integrationId: integrationId }))

ssp.CodePipelineStack.builder()
    .name("ssp-addon-snyk-monitor-pipeline")
    .owner("snyk-partners")
    .repository({
        repoUrl: 'ssp-eks-extension',
        credentialsSecretName: 'ssp-pipeline-github-token',
        targetRevision: 'develop'
    })
    .stage({
        id: 'us-east-1-snyk-monitor-ssp-addon-test',
        stackBuilder: blueprintCd.clone(region)
    });
