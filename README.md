# Snyk Monitor add-on for Amazon EKS Blueprints (CDK)
**_This project is currently in Beta._**

This is an add-on to the [Amazon EKS Blueprints for CDK](https://github.com/aws-quickstart/cdk-eks-blueprints) project. The [CDK](https://aws.amazon.com/cdk/) code in this repository can be used to quickly deploy an [Amazon EKS](https://aws.amazon.com/eks/) cluster with the [Snyk Monitor](https://github.com/snyk/kubernetes-monitor) (part of the [Snyk Container](https://snyk.io/product/container-vulnerability-management/) product) installed out of the box. Additionally, EKS Blueprints users can add this module as a dependency in their project. This allows them to install the Snyk Monitor using CDK code and manage its configuration using GitOps.

## Snyk Monitor
With the Snyk Monitor in your Amazon EKS cluster, you get automatic security scans when new container images are deployed. Snyk Monitor uses the Kubernetes API to watch deployment activity. When changes are detected, it pulls the container image from your [Elastic Container Registry (ECR)](), inspects its contents, and posts the results to your account on Snyk.io. The results provide actionable remediation advice. For example, many security vulnerabilities can be resolved by upgrading the base image to the version recommended by Snyk.

## Prerequisites
_Skip this section and go [here](#existing-amazon-eks-blueprints-project) if you want to use this addon in an existing EKS Blueprints project._

Instructions are provided for MacOS. For Linux and Windows please consult documentation how to install the required components (`make`, `nodejs`).

1. Install Make on Mac.
```
brew install make
```
2. Install Node.js.
```
brew install node
```

Make sure that the installed Node.js version is compatible with CDK. More information can be found [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#:~:text=All%20AWS%20CDK,a%20different%20recommendation.) (scroll to the "Prerequisites" section).

3. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and provide credentials by running `aws configure`. 

4. In order to avoid problems with CDK version potentially being different from the version used by EKS Blueprints, create a local alias for CDK (as opposed to system wide installation). For that include the following alias to your ~/.bashrc or ~/.zshrc file:

```
alias cdk="npx cdk"
```
Make sure you run `source ~/.bashrc` after editing the file. 

Example for mac/linux terminal:

```
$ echo 'alias cdk="npx cdk"' >> ~/.zshrc
$ source ~/.zshrc
```

5. Clone this git repository
```
git clone https://github.com/snyk-partners/snyk-monitor-eks-blueprints-addon.git
cd snyk-monitor-eks-blueprints-addon
```

## Installation
The CDK code in this repository can be used to deploy a new Amazon EKS cluster with the Snyk Monitor built-in. Alternatively, the node module released from this repository can be used as a dependency in existing EKS Blueprints projects to integrate the Snyk Monitor.

### New Amazon EKS Cluster
1. Run `npm install`.

2. Run `make build && make lint && make list` to build.

3. Run `aws configure`. This command makes the `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` environment variables available to subsequent steps.

4. Run `export INTEGRATION_ID=abcd1234-abcd-1234-abcd-1234abcd1234` with your actual integration ID. To get the integration ID, log in to your Snyk account and navigate to https://app.snyk.io/org/YOUR-ORGANIZATION-NAME/manage/integrations/kubernetes.

    **NOTE:** Refer to `<project>/bin/main.ts` for more details on environment variable usage.

5. Run `cdk deploy snyk-monitor-eks-blueprints-addon` to deploy to AWS.

### Existing Amazon EKS Blueprints Project
1. Add this module as a dependency:
```
npm install @snyk-partners/snyk-monitor-eks-blueprints-addon
```

2. Use it as follows:
```js
import * as cdk from 'aws-cdk-lib/core';
import * as ssp from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '@snyk-partners/snyk-monitor-eks-blueprints-addon';

const app = new cdk.App();

const addOns: Array<ssp.ClusterAddOn> = [
    new SnykMonitorAddOn({
        integrationId: '<integration ID>',
        values: {} // additional Helm chart values
    })
];

const account = '<aws account id>'
const region = '<aws region>'
const props = { env: { account, region } }

new ssp.EksBlueprint(app, { id: '<CFN stack ID>', addOns}, props)
```

## Testing the Snyk Monitor
1. Check the Snyk Monitor logs to ensure that it's running and able to connect to your container registry:
```
kubectl -n snyk-monitor logs <snyk-monitor-pod-ID>
```
2. Deploy a vulnerable application to your Amazon EKS cluster. The [java-goof](https://github.com/snyk-labs/java-goof) project is recommended because it includes multiple vulnerable applications as well as scripts and Kubernetes manifests to deploy them. **Do not expose vulnerable applications to the public internet.**

3. Follow the instructions [here](https://docs.snyk.io/products/snyk-container/image-scanning-library/kubernetes-workload-and-image-scanning/adding-kubernetes-workloads-for-security-scanning#manually-add-workloads) to set up monitoring for the vulnerable workload(s). Continue reading to learn how to interpret test results.

## AWS CodePipeline
This repository includes an AWS CodePipeline which is used to test the Snyk Monitor addon for EKS Blueprints. The pipeline is deployed using `cdk deploy snyk-monitor-eks-blueprints-addon-pipeline`.

Follow the instructions [here](https://aws-quickstart.github.io/cdk-eks-blueprints/pipelines/#creating-a-pipeline) to get familiarized with the code and requirements to deploy the pipeline. The pipeline depends on a GitHub personal access token, AWS Secrets Store, and environment variables which all need to be configured manually. AWS CodeBuild may need increased privileges to complete the "build" phase of the pipeline.
