"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnykMonitorProvider = void 0;
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const yaml_utils_1 = require("@aws-quickstart/eks-blueprints/dist/utils/yaml-utils");
class SnykMonitorProvider {
    constructor(props) {
        this.props = props;
    }
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        // helm chart
        const snykMonitorHelmChart = cluster.addHelmChart('snyk-monitor', {
            chart: this.props.chart,
            repository: this.props.repository,
            namespace: this.props.namespace,
            release: this.props.release,
            version: this.props.version,
            values: this.props.values
        });
        // manifest for namespace and secret
        const doc = (0, yaml_utils_1.readYamlDocument)(__dirname + '/snyk-monitor-secret.yaml');
        const docArray = doc
            .replace(/{{integrationId}}/g, Buffer.from(this.props.integrationId || "").toString('base64'))
            .replace(/{{dockerCfgJson}}/g, Buffer.from('{"credsStore":"ecr-login"}').toString('base64'));
        const manifest = docArray.split("---").map(e => (0, yaml_utils_1.loadYaml)(e));
        const snykMonitorManifest = new aws_eks_1.KubernetesManifest(cluster.stack, 'snyk-monitor-secret', {
            cluster,
            manifest: manifest,
            overwrite: true
        });
        // helm chart depends on the manifest
        snykMonitorHelmChart.node.addDependency(snykMonitorManifest);
        return snykMonitorManifest;
    }
}
exports.SnykMonitorProvider = SnykMonitorProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic255ay1tb25pdG9yLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3NueWstbW9uaXRvci1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpREFBeUQ7QUFDekQscUZBQWtHO0FBRWxHLE1BQWEsbUJBQW1CO0lBRTVCLFlBQW9CLEtBQTRCO1FBQTVCLFVBQUssR0FBTCxLQUFLLENBQXVCO0lBQUksQ0FBQztJQUVyRCxNQUFNLENBQUMsV0FBd0I7UUFDM0IsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUVwQyxhQUFhO1FBQ2IsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUM5RCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNO1lBQ3hCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVc7WUFDbEMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBVTtZQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtTQUM1QixDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBQSw2QkFBZ0IsRUFBQyxTQUFTLEdBQUcsMkJBQTJCLENBQUMsQ0FBQztRQUN0RSxNQUFNLFFBQVEsR0FBRyxHQUFHO2FBQ2YsT0FBTyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzdGLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakcsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFBLHFCQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxNQUFNLG1CQUFtQixHQUF1QixJQUFJLDRCQUFrQixDQUNsRSxPQUFPLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUNwQztZQUNJLE9BQU87WUFDUCxRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFUCxxQ0FBcUM7UUFDckMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRTdELE9BQU8sbUJBQW1CLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBcENELGtEQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSAnQGF3cy1xdWlja3N0YXJ0L2Vrcy1ibHVlcHJpbnRzJztcbmltcG9ydCB7IFNueWtNb25pdG9yQWRkT25Qcm9wcyB9IGZyb20gJy4nO1xuaW1wb3J0IHsgS3ViZXJuZXRlc01hbmlmZXN0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5pbXBvcnQgeyBsb2FkWWFtbCwgcmVhZFlhbWxEb2N1bWVudCB9IGZyb20gJ0Bhd3MtcXVpY2tzdGFydC9la3MtYmx1ZXByaW50cy9kaXN0L3V0aWxzL3lhbWwtdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgU255a01vbml0b3JQcm92aWRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb3BzOiBTbnlrTW9uaXRvckFkZE9uUHJvcHMpIHsgfVxuXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IEt1YmVybmV0ZXNNYW5pZmVzdCB7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuXG4gICAgICAgIC8vIGhlbG0gY2hhcnRcbiAgICAgICAgY29uc3Qgc255a01vbml0b3JIZWxtQ2hhcnQgPSBjbHVzdGVyLmFkZEhlbG1DaGFydCgnc255ay1tb25pdG9yJywge1xuICAgICAgICAgICAgY2hhcnQ6IHRoaXMucHJvcHMuY2hhcnQhLFxuICAgICAgICAgICAgcmVwb3NpdG9yeTogdGhpcy5wcm9wcy5yZXBvc2l0b3J5ISxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogdGhpcy5wcm9wcy5uYW1lc3BhY2UhLFxuICAgICAgICAgICAgcmVsZWFzZTogdGhpcy5wcm9wcy5yZWxlYXNlLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5wcm9wcy52ZXJzaW9uLFxuICAgICAgICAgICAgdmFsdWVzOiB0aGlzLnByb3BzLnZhbHVlc1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBtYW5pZmVzdCBmb3IgbmFtZXNwYWNlIGFuZCBzZWNyZXRcbiAgICAgICAgY29uc3QgZG9jID0gcmVhZFlhbWxEb2N1bWVudChfX2Rpcm5hbWUgKyAnL3NueWstbW9uaXRvci1zZWNyZXQueWFtbCcpO1xuICAgICAgICBjb25zdCBkb2NBcnJheSA9IGRvY1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t7aW50ZWdyYXRpb25JZH19L2csIEJ1ZmZlci5mcm9tKHRoaXMucHJvcHMuaW50ZWdyYXRpb25JZCB8fCBcIlwiKS50b1N0cmluZygnYmFzZTY0JykpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tkb2NrZXJDZmdKc29ufX0vZywgQnVmZmVyLmZyb20oJ3tcImNyZWRzU3RvcmVcIjpcImVjci1sb2dpblwifScpLnRvU3RyaW5nKCdiYXNlNjQnKSk7XG4gICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gZG9jQXJyYXkuc3BsaXQoXCItLS1cIikubWFwKGUgPT4gbG9hZFlhbWwoZSkpO1xuICAgICAgICBjb25zdCBzbnlrTW9uaXRvck1hbmlmZXN0OiBLdWJlcm5ldGVzTWFuaWZlc3QgPSBuZXcgS3ViZXJuZXRlc01hbmlmZXN0KFxuICAgICAgICAgICAgY2x1c3Rlci5zdGFjaywgJ3NueWstbW9uaXRvci1zZWNyZXQnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICAgICAgbWFuaWZlc3Q6IG1hbmlmZXN0LFxuICAgICAgICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGVsbSBjaGFydCBkZXBlbmRzIG9uIHRoZSBtYW5pZmVzdFxuICAgICAgICBzbnlrTW9uaXRvckhlbG1DaGFydC5ub2RlLmFkZERlcGVuZGVuY3koc255a01vbml0b3JNYW5pZmVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHNueWtNb25pdG9yTWFuaWZlc3Q7XG4gICAgfVxufVxuIl19