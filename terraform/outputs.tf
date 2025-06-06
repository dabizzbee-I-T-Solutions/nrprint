output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website_bucket.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website_bucket.arn
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution (e.g., d111111abcdef8.cloudfront.net). Use this for your CNAME record in Squarespace."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "website_url" {
  description = "URL of the website (will work after CNAME is set up in Squarespace and propagated)"
  value       = "https://${var.domain_name}"
}

output "oai_iam_arn" {
  description = "IAM ARN of the CloudFront Origin Access Identity"
  value       = aws_cloudfront_origin_access_identity.oai.iam_arn
}
 