import { App } from 'aws-cdk-lib';
import { EksBlueprint } from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOn } from '../dist';
import { pipeline } from '../ci/pipeline';
import config, { defaultStackId } from '../lib/config';

const app = new App();

if (!inputsAreValid()) {
    console.log("Inputs are invalid. Exiting...");
    process.exit(1);
}
const stackProps = { env: { account: config.account, region: config.region } };

// deploy EKS with the Snyk Monitor addon
EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({
        integrationId: config.integrationId,
        version: "1.87.2",
        values: {}
    }))
    .build(app, config.stackId, stackProps);

// check each input value for correctness
function inputsAreValid(): boolean {
    let valid = true;
    if (!config.account || config.account.length == 0) {
        console.log("CDK_DEFAULT_ACCOUNT environment variable is empty or unset. Try 'aws configure'.");
        valid = false;
    }
    if (!config.region || config.region.length == 0) {
        console.log("CDK_DEFAULT_REGION environment variable is empty or unset. Try 'aws configure'.");
    }
    if (!config.stackId || config.stackId === defaultStackId) {
        console.log(`STACK_ID environment variable is unset or matches the default value. Using ${defaultStackId}.`);
    }
    if (!config.integrationId || config.integrationId.length == 0) {
        console.log("INTEGRATION_ID environment variable is empty or unset.");
        valid = false;
    }
    return valid;
}

// build an instance of the pipeline here because we have to pass the 'app'
pipeline.build(app, 'snyk-monitor-eks-blueprints-addon-pipeline', stackProps);
