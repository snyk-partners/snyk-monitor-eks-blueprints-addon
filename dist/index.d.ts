import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
export interface SnykMonitorAddOnProps extends blueprints.HelmAddOnUserProps {
    /**
     * Snyk Integration ID from https://app.snyk.io/org/YOUR-ORGANIZATION-NAME/manage/integrations/kubernetes
     */
    integrationId?: string;
}
export declare const defaultProps: blueprints.HelmAddOnProps & SnykMonitorAddOnProps;
export declare class SnykMonitorAddOn extends blueprints.HelmAddOn {
    readonly options: SnykMonitorAddOnProps;
    constructor(props: SnykMonitorAddOnProps);
    deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct>;
}
