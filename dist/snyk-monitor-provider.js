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
        const doc = yaml_utils_1.readYamlDocument(__dirname + '/snyk-monitor-secret.yaml');
        const docArray = doc
            .replace(/{{integrationId}}/g, Buffer.from(this.props.integrationId || "").toString('base64'))
            .replace(/{{dockerCfgJson}}/g, Buffer.from('{"credsStore":"ecr-login"}').toString('base64'));
        const manifest = docArray.split("---").map(e => yaml_utils_1.loadYaml(e));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic255ay1tb25pdG9yLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3NueWstbW9uaXRvci1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpREFBeUQ7QUFDekQscUZBQWtHO0FBRWxHLE1BQWEsbUJBQW1CO0lBRTVCLFlBQW9CLEtBQTRCO1FBQTVCLFVBQUssR0FBTCxLQUFLLENBQXVCO0lBQUksQ0FBQztJQUVyRCxNQUFNLENBQUMsV0FBd0I7UUFDM0IsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUVwQyxhQUFhO1FBQ2IsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUM5RCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNO1lBQ3hCLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVc7WUFDbEMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBVTtZQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtTQUM1QixDQUFDLENBQUM7UUFFSCxvQ0FBb0M7UUFDcEMsTUFBTSxHQUFHLEdBQUcsNkJBQWdCLENBQUMsU0FBUyxHQUFHLDJCQUEyQixDQUFDLENBQUM7UUFDdEUsTUFBTSxRQUFRLEdBQUcsR0FBRzthQUNmLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM3RixPQUFPLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sbUJBQW1CLEdBQXVCLElBQUksNEJBQWtCLENBQ2xFLE9BQU8sQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQ3BDO1lBQ0ksT0FBTztZQUNQLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQztRQUVQLHFDQUFxQztRQUNyQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFN0QsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0NBQ0o7QUFwQ0Qsa0RBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2x1c3RlckluZm8gfSBmcm9tICdAYXdzLXF1aWNrc3RhcnQvZWtzLWJsdWVwcmludHMnO1xuaW1wb3J0IHsgU255a01vbml0b3JBZGRPblByb3BzIH0gZnJvbSAnLic7XG5pbXBvcnQgeyBLdWJlcm5ldGVzTWFuaWZlc3QgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWtzJztcbmltcG9ydCB7IGxvYWRZYW1sLCByZWFkWWFtbERvY3VtZW50IH0gZnJvbSAnQGF3cy1xdWlja3N0YXJ0L2Vrcy1ibHVlcHJpbnRzL2Rpc3QvdXRpbHMveWFtbC11dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBTbnlrTW9uaXRvclByb3ZpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvcHM6IFNueWtNb25pdG9yQWRkT25Qcm9wcykgeyB9XG5cbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogS3ViZXJuZXRlc01hbmlmZXN0IHtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG5cbiAgICAgICAgLy8gaGVsbSBjaGFydFxuICAgICAgICBjb25zdCBzbnlrTW9uaXRvckhlbG1DaGFydCA9IGNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCdzbnlrLW1vbml0b3InLCB7XG4gICAgICAgICAgICBjaGFydDogdGhpcy5wcm9wcy5jaGFydCEsXG4gICAgICAgICAgICByZXBvc2l0b3J5OiB0aGlzLnByb3BzLnJlcG9zaXRvcnkhLFxuICAgICAgICAgICAgbmFtZXNwYWNlOiB0aGlzLnByb3BzLm5hbWVzcGFjZSEsXG4gICAgICAgICAgICByZWxlYXNlOiB0aGlzLnByb3BzLnJlbGVhc2UsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnByb3BzLnZlcnNpb24sXG4gICAgICAgICAgICB2YWx1ZXM6IHRoaXMucHJvcHMudmFsdWVzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG1hbmlmZXN0IGZvciBuYW1lc3BhY2UgYW5kIHNlY3JldFxuICAgICAgICBjb25zdCBkb2MgPSByZWFkWWFtbERvY3VtZW50KF9fZGlybmFtZSArICcvc255ay1tb25pdG9yLXNlY3JldC55YW1sJyk7XG4gICAgICAgIGNvbnN0IGRvY0FycmF5ID0gZG9jXG4gICAgICAgICAgICAucmVwbGFjZSgve3tpbnRlZ3JhdGlvbklkfX0vZywgQnVmZmVyLmZyb20odGhpcy5wcm9wcy5pbnRlZ3JhdGlvbklkIHx8IFwiXCIpLnRvU3RyaW5nKCdiYXNlNjQnKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e2RvY2tlckNmZ0pzb259fS9nLCBCdWZmZXIuZnJvbSgne1wiY3JlZHNTdG9yZVwiOlwiZWNyLWxvZ2luXCJ9JykudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcbiAgICAgICAgY29uc3QgbWFuaWZlc3QgPSBkb2NBcnJheS5zcGxpdChcIi0tLVwiKS5tYXAoZSA9PiBsb2FkWWFtbChlKSk7XG4gICAgICAgIGNvbnN0IHNueWtNb25pdG9yTWFuaWZlc3Q6IEt1YmVybmV0ZXNNYW5pZmVzdCA9IG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QoXG4gICAgICAgICAgICBjbHVzdGVyLnN0YWNrLCAnc255ay1tb25pdG9yLXNlY3JldCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgICAgICBtYW5pZmVzdDogbWFuaWZlc3QsXG4gICAgICAgICAgICAgICAgb3ZlcndyaXRlOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBoZWxtIGNoYXJ0IGRlcGVuZHMgb24gdGhlIG1hbmlmZXN0XG4gICAgICAgIHNueWtNb25pdG9ySGVsbUNoYXJ0Lm5vZGUuYWRkRGVwZW5kZW5jeShzbnlrTW9uaXRvck1hbmlmZXN0KTtcblxuICAgICAgICByZXR1cm4gc255a01vbml0b3JNYW5pZmVzdDtcbiAgICB9XG59XG4iXX0=