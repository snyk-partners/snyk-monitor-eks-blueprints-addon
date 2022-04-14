import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { SnykMonitorProvider } from './snyk-monitor-provider';

export interface SnykMonitorAddOnProps extends blueprints.HelmAddOnUserProps {
    /**
     * Snyk Integration ID from https://app.snyk.io/org/YOUR-ORGANIZATION-NAME/manage/integrations/kubernetes
     */
    integrationId?: string;
}

export const defaultProps: blueprints.HelmAddOnProps & SnykMonitorAddOnProps = {
    chart: 'snyk-monitor',
    name: 'snyk-monitor',
    namespace: 'snyk-monitor',
    release: 'snyk-monitor',
    version: '1.83.6',
    repository: 'https://snyk.github.io/kubernetes-monitor/',
    values: {}
}

export class SnykMonitorAddOn extends blueprints.HelmAddOn {

    readonly options: SnykMonitorAddOnProps;

    constructor(props: SnykMonitorAddOnProps) {
        super({...defaultProps, ...props});
        this.options = this.props as SnykMonitorAddOnProps;
    }

    deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
        const snykMonitorProvider = new SnykMonitorProvider(this.options);
        return Promise.resolve(snykMonitorProvider.deploy(clusterInfo));
    }
}
