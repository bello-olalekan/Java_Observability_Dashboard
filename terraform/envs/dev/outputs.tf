output "cluster_name" {
  value = module.eks.cluster_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "frontend_ecr_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "memcached_endpoint" {
  value = aws_elasticache_cluster.memcached.cluster_address
}

output "grafana_port_forward_command" {
  value = "kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000:80"
}
