import { ClusterInfo } from '@aws-quickstart/eks-blueprints';
import { SnykMonitorAddOnProps } from '.';
import { KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import { loadYaml, readYamlDocument } from '@aws-quickstart/eks-blueprints/dist/utils/yaml-utils';

export class SnykMonitorProvider {

    constructor(private props: SnykMonitorAddOnProps) { }

    deploy(clusterInfo: ClusterInfo): KubernetesManifest {
        const cluster = clusterInfo.cluster;

        // helm chart
        const snykMonitorHelmChart = cluster.addHelmChart('snyk-monitor', {
            chart: this.props.chart!,
            repository: this.props.repository!,
            namespace: this.props.namespace!,
            release: this.props.release,
            version: this.props.version,
            values: this.props.values
        });

        // manifest for namespace and secret
        const doc = readYamlDocument(__dirname + '/snyk-monitor-secret.yaml');
        const docArray = doc
            .replace(/{{integrationId}}/g, Buffer.from(this.props.integrationId || "").toString('base64'))
            .replace(/{{dockerCfgJson}}/g, Buffer.from('{"credsStore":"ecr-login"}').toString('base64'));
        const manifest = docArray.split("---").map(e => loadYaml(e));
        const snykMonitorManifest: KubernetesManifest = new KubernetesManifest(
            cluster.stack, 'snyk-monitor-secret',
            {
                cluster,
                manifest: manifest,
                overwrite: true
            });

        // helm chart depends on the manifest
        snykMonitorHelmChart.node.addDependency(snykMonitorManifest);

        return snykMonitorManifest;
    }
}
