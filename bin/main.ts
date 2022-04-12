import { App } from 'aws-cdk-lib';
import { EksBlueprint } from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOn } from '../dist';
import { pipeline } from '../ci/pipeline';

const app = new App();

// load required parameters from the environment and validate them
const account = process.env.CDK_DEFAULT_ACCOUNT!; // e.g. 492635582501
const region = process.env.CDK_DEFAULT_REGION!;
const stackID = process.env.STACK_ID || 'snyk-monitor-eks-blueprints-addon';
const integrationId = process.env.INTEGRATION_ID; // e.g. abcd1234-abcd-1234-abcd-1234abcd1234
if (!inputsAreValid()) {
    console.log("Inputs are invalid. Exiting...");
    process.exit(1);
}
const stackProps = { env: { account, region } };

// deploy EKS with the Snyk Monitor addon
EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({
        integrationId: integrationId,
        version: "1.87.2",
        values: {}
    }))
    .build(app, stackID, stackProps);

// check each input value for correctness
function inputsAreValid(): boolean {
    let valid = true;
    if (!account || account.length == 0) {
        console.log("CDK_DEFAULT_ACCOUNT environment variable is empty or unset. Try 'aws configure'.");
        valid = false;
    }
    if (!process.env.CDK_DEFAULT_REGION) {
        console.log("CDK_DEFAULT_REGION environment variable is unset. Try 'aws configure'.");
    }
    if (!process.env.STACK_ID) {
        console.log("STACK_ID environment variable is unset. Will default to 'snyk-monitor-eks-blueprints-addon'.");
    }
    if (!integrationId || integrationId.length == 0) {
        console.log("INTEGRATION_ID environment variable is empty or unset.");
        valid = false;
    }
    return valid;
}

// build an instance of the pipeline here because we have to pass the 'app'
pipeline.build(app, 'snyk-monitor-eks-blueprints-addon-pipeline', stackProps);
