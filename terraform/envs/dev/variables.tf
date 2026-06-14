variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
  default     = "java-observability"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}

variable "db_username" {
  description = "RDS application username."
  type        = string
  default     = "appuser"
}

variable "db_password" {
  description = "RDS application password."
  type        = string
  sensitive   = true
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to reach public endpoints such as EKS API."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
