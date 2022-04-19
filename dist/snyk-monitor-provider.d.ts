import { ClusterInfo } from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOnProps } from '.';
import { KubernetesManifest } from 'aws-cdk-lib/aws-eks';
export declare class SnykMonitorProvider {
    private props;
    constructor(props: SnykMonitorAddOnProps);
    deploy(clusterInfo: ClusterInfo): KubernetesManifest;
}
