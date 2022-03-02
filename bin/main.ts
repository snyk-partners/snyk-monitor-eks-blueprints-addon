import { App } from '@aws-cdk/core';
import { EksBlueprint } from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '../dist';

const app = new App();
const account = '478468688580'
const region = 'us-east-1'
const stackID = 'ssp-snyk-monitor'
const stackProps = { env: { account, region } }

EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({}))
    .build(app, stackID, stackProps);
