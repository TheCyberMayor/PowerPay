# Outputs
output "web_app_url" {
  description = "PowerPay Web App URL"
  value       = "https://${aws_cloudfront_distribution.web_app.domain_name}"
}

output "admin_app_url" {
  description = "PowerPay Admin Dashboard URL"
  value       = "https://${aws_cloudfront_distribution.admin_app.domain_name}"
}

output "database_endpoint" {
  description = "RDS PostgreSQL Endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis Endpoint"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public Subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private Subnet IDs"
  value       = aws_subnet.private[*].id
}