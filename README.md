# Snyk Monitor add-on for Amazon SSP
This is an add-on to the [Amazon Shared Services Platform (SSP)](https://aws-quickstart.github.io/ssp-amazon-eks/). The [CDK](https://aws.amazon.com/cdk/) code in this repository can be used to quickly deploy an [Amazon EKS](https://aws.amazon.com/eks/) cluster with the [Snyk Monitor](https://github.com/snyk/kubernetes-monitor) (part of the [Snyk Container](https://snyk.io/product/container-vulnerability-management/) product) installed out of the box. Additionally, SSP users can add this module as a dependency in their SSP project. This allows them to install the Snyk Monitor using CDK code and manage its configuration using GitOps.

## Snyk Monitor
With the Snyk Monitor in your Amazon EKS cluster, you get automatic security scans when new container images are deployed. Snyk Monitor uses the Kubernetes API to watch deployment activity. When changes are detected, it pulls the container image from your [Elastic Container Registry (ECR)](), runs a security scan, and posts the results to your account on Snyk.io. The results provide actionable remediation advice. For example, many security vulnerabilities can be resolved by upgrading the base image to the version recommended by Snyk.

## Prerequisites
_Skip this section and go [here](#existing-amazon-ssp-project) if you want to use this addon in an existing SSP project._

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

4. In order to avoid problems with CDK version potentially being different from the version used by the AWS SSP for EKS create a local alias for CDK (as opposed to system wide installation). For that include the following alias to your ~/.bashrc or ~/.zshrc file:

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
git clone https://github.com/TODO/TODO.git
cd ssp-eks-extension
```

## Installation
The CDK code in this repository can be used to deploy a new Amazon EKS cluster with the Snyk Monitor built-in. Alternatively, the node module released from this repository can be used as a dependency in existing SSP projects to integrate the Snyk Monitor.

### New Amazon EKS Cluster
1. Run `npm install`.

2. Edit the `bin/main.ts` file so that all placholders contain actual values. To get the `integrationId`, log in to your Snyk account and navigate to https://app.snyk.io/org/YOUR-ORGANIZATION-NAME/manage/integrations/kubernetes.

2. Run `make build && make lint && make list` to build.

3. Run `cdk deploy` to deploy to AWS.

### Existing Amazon SSP Project
1. Add this module as a dependency:
```
npm install @snyk/ssp-addon-snyk-monitor
```

2. Use it as follows:
```js
import * as cdk from '@aws-cdk/core';
import * as ssp from '@aws-quickstart/ssp-amazon-eks';
import { SnykMonitorAddOn } from '@snyk/ssp-addon-snyk-monitor';

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

## Testing
1. Check the Snyk Monitor logs to ensure that it's running and able to connect to your container registry:
```
kubectl -n snyk-monitor logs <snyk-monitor-pod-ID>
```
2. Deploy a vulnerable application to your Amazon EKS cluster. The [java-goof](https://github.com/snyk-labs/java-goof) project is recommended because it includes multiple vulnerable applications as well as scripts and Kubernetes manifests to deploy them. **Do not expose vulnerable applications to the public internet.**

3. Follow the instructions [here](https://docs.snyk.io/products/snyk-container/image-scanning-library/kubernetes-workload-and-image-scanning/adding-kubernetes-workloads-for-security-scanning#manually-add-workloads) to set up monitoring for the vulnerable workload(s). Continue reading to learn how to interpret test results.
