variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1" # Change this to your preferred region
}


variable "bucket_name" {
  description = "The name of the S3 bucket for the website."
  type        = string 
}

variable "upload_role_arn" {
  description = "ARN of the IAM role allowed to upload objects to the S3 bucket. If empty, defaults to a specific user."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "The custom domain name for the CloudFront distribution (e.g., resume.alfieopo.com)."
  type        = string
  default     = "nrprinthk.com"
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for the custom domain. Ensure it's in us-east-1 for CloudFront."
  type        = string 
}


variable "tags" {
  description = "A map of tags to assign to resources."
  type        = map(string)
  
}

variable "region" {
  description = "AWS region for resources (S3 bucket)."
  type        = string
  default     = "ap-southeast-1" # Or your preferred region
}