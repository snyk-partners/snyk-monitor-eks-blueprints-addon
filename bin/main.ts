import { App } from '@aws-cdk/core';
import { EksBlueprint } from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '../dist';

const app = new App();

// AWS Properties
const account = '<account id>'
const region = '<region>'
const stackID = '<stack id>'
const stackProps = { env: { account, region } }

// Snyk Properties
const integrationId = '<integration ID>'
const dockerCfgJson = '{}' // for public registry, use {"credsStore":"ecr-login"} for ECR

EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({
        integrationId: Buffer.from(integrationId).toString('base64'),
        dockerCfgJson: Buffer.from(dockerCfgJson).toString('base64'),
        values: {} // additional Helm chart values
    }))
    .build(app, stackID, stackProps);
