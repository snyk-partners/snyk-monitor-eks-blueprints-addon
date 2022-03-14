import { App } from '@aws-cdk/core';
import { EksBlueprint } from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '../dist';

const app = new App();

// load required parameters from the environment and validate them
const account = process.env.ACCOUNT;
const region = process.env.REGION || 'us-east-1';
const stackID = process.env.STACK_ID || 'ssp-amazon-eks-snyk';
const integrationId = process.env.INTEGRATION_ID;
const dockerCfgJson = process.env.DOCKER_CFG_JSON;
if (!inputsAreValid()) {
    console.log("Exiting...");
    process.exit(1);
}
const stackProps = { env: { account, region } }

// deploy EKS with the Snyk Monitor addon
EksBlueprint.builder()
    .addOns(new SnykMonitorAddOn({
        integrationId: integrationId,
        dockerCfgJson: dockerCfgJson,
        version: "1.85.2"
    }))
    .build(app, stackID, stackProps);

function inputsAreValid(): boolean {
    let valid = true;
    if (!account || account.length == 0) {
        console.log("ACCOUNT environment variable is empty or unset.");
        valid = false;
    }
    if (!process.env.REGION || region.length == 0) {
        console.log("REGION environment variable is empty or unset. Will default to 'us-east-1'.");
    }
    if (!process.env.STACK_ID || stackID.length == 0) {
        console.log("STACK_ID environment variable is empty or unset. Will default to 'ssp-amazon-eks-snyk'.");
    }
    if (!integrationId || integrationId.length == 0) {
        console.log("INTEGRATION_ID environment variable is empty or unset.");
        valid = false;
    } else {
        try {
            atob(integrationId);
        } catch (e) {
            console.log("INTEGRATION_ID is not in base64 format.");
            valid = false;
        }
    }
    if (!dockerCfgJson || dockerCfgJson.length == 0) {
        console.log("DOCKER_CFG_JSON environment variable is empty or unset.");
        valid = false;
    } else {
        try {
            atob(dockerCfgJson);
        } catch (e) {
            console.log("DOCKER_CFG_JSON is not in base64 format.")
            valid = false;
        }
    }
    return valid;
}
