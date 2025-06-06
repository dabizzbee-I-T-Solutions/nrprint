data "aws_caller_identity" "current" {}

# ------------------------------------------------------------------------------
# S3 Bucket for Website Content (Private Origin)
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "website_bucket" {
  bucket        = var.bucket_name
  force_destroy = true # Be careful with this in production
  tags          = merge(var.tags, { Name = var.bucket_name })
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket                  = aws_s3_bucket.website_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true # ACLs are disabled by BucketOwnerEnforced
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "website_bucket_ownership" {
  bucket = aws_s3_bucket.website_bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced" # ACLs disabled, bucket owner owns all objects
  }
  depends_on = [aws_s3_bucket_public_access_block.block_public]
}

# ------------------------------------------------------------------------------
# CloudFront Origin Access Identity (OAI)
# ------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.bucket_name}"
}

# ------------------------------------------------------------------------------
# S3 Bucket Policy for Website Bucket
# ------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "cloudfront_access_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
      },
      {
        Sid    = "AllowUploadsFromRoleOrUser"
        Effect = "Allow"
        Principal = {
          AWS = var.upload_role_arn != "" ? var.upload_role_arn : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/alfie.opo"
        }
        Action   = ["s3:PutObject"] # s3:PutObjectAcl not strictly needed with BucketOwnerEnforced if uploader doesn't try to set ACLs
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
  depends_on = [
    aws_cloudfront_origin_access_identity.oai,
    aws_s3_bucket_ownership_controls.website_bucket_ownership
  ]
}

# ------------------------------------------------------------------------------
# Website Files
# ------------------------------------------------------------------------------
locals {
  website_files = {
    "style.css"                                         = { path = "${path.module}/../site/style.css", type = "text/css" },
    "responsive.css"                                         = { path = "${path.module}/../site/responsive.css", type = "text/css" },
    "sketch.js"                                         = { path = "${path.module}/../site/sketch.js", type = "text/javascript" },
    "slides.js"                                         = { path = "${path.module}/../site/slides.js", type = "text/javascript" },
    "app.js"                                            = { path = "${path.module}/../site/app.js", type = "text/javascript" },
    "index.html"                                        = { path = "${path.module}/../site/index.html", type = "text/html" },
    "error.html"                                        = { path = "${path.module}/../site/error.html", type = "text/html" },
    "favicon/android-chrome-192x192.png"                = { path = "${path.module}/../site/favicon/android-chrome-192x192.png", type = "image/png" },
    "favicon/android-chrome-512x512.png"                = { path = "${path.module}/../site/favicon/android-chrome-512x512.png", type = "image/png" },
    "favicon/favicon.ico"                               = { path = "${path.module}/../site/favicon/favicon.ico", type = "image/x-icon" },
    "favicon/apple-touch-icon.png"                      = { path = "${path.module}/../site/favicon/apple-touch-icon.png", type = "image/png" },
    "site.webmanifest"                                  = { path = "${path.module}/../site/site.webmanifest", type = "application/manifest+json" },
    "images/logo.png"                                   = { path = "${path.module}/../site/images/logo.png", type = "image/png" },
    "images/tshirt-sample1.jpg"                         = { path = "${path.module}/../site/images/tshirt-sample1.jpg", type = "image/jpeg" },
    "images/mug-sample1.jpg"                            = { path = "${path.module}/../site/images/mug-sample1.jpg", type = "image/jpeg" },
    "images/cap-sample1.jpg"                            = { path = "${path.module}/../site/images/cap-sample1.jpg", type = "image/jpeg" },
    "images/tshirt-sample2.jpg"                         = { path = "${path.module}/../site/images/tshirt-sample2.jpg", type = "image/jpeg" },
    "images/mug-sample2.jpg"                            = { path = "${path.module}/../site/images/mug-sample2.jpg", type = "image/jpeg" },
    "images/cap-sample2.jpg"                            = { path = "${path.module}/../site/images/cap-sample2.jpg", type = "image/jpeg" },
    "images/accomplishment-event-detail.jpg"            = { path = "${path.module}/../site/images/accomplishment-event-detail.jpg", type = "image/jpeg" },
    "images/accomplishment-business-collab.jpg"         = { path = "${path.module}/../site/images/accomplishment-business-collab.jpg", type = "image/jpeg" },
    "images/accomplishment-volume.jpg"                  = { path = "${path.module}/../site/images/accomplishment-volume.jpg", type = "image/jpeg" },
    "images/accomplishment-mug-tech.jpg"                = { path = "${path.module}/../site/images/accomplishment-mug-tech.jpg", type = "image/jpeg" },
    "images/nrprint-home-slideshow/slide1.jpg"          = { path = "${path.module}/../site/images/nrprint-home-slideshow/slide1.jpg", type = "image/jpeg" },
    "images/nrprint-home-slideshow/slide2.png"          = { path = "${path.module}/../site/images/nrprint-home-slideshow/slide2.png", type = "image/png" },
    "images/nrprint-home-slideshow/product-memory1.jpg" = { path = "${path.module}/../site/images/nrprint-home-slideshow/product-memory1.jpg", type = "image/jpeg" },
    "images/nrprint-home-slideshow/product-memory2.jpg" = { path = "${path.module}/../site/images/nrprint-home-slideshow/product-memory2.jpg", type = "image/jpeg" },
    "images/nrprint-home-slideshow/another-one.png"     = { path = "${path.module}/../site/images/nrprint-home-slideshow/another-one.png", type = "image/png" },
    "images/nrprint-home-slideshow/tshirt-sample1.jpg"  = { path = "${path.module}/../site/images/nrprint-home-slideshow/tshirt-sample1.jpg", type = "image/png" }
    # T-Shirts
    "images/portfolio/tshirt-1.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-1.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-2.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-2.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-3.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-3.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-4.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-4.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-5.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-5.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-6.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-6.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-7.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-7.jpg", type = "image/jpeg" }
    "images/portfolio/tshirt-8.jpg" = { path = "${path.module}/../site/images/portfolio/tshirt-8.jpg", type = "image/jpeg" }

    # Hoodies
    "images/portfolio/hoodie-1.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-1.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-2.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-2.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-3.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-3.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-4.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-4.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-5.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-5.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-6.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-6.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-7.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-7.jpg", type = "image/jpeg" }
    "images/portfolio/hoodie-8.jpg" = { path = "${path.module}/../site/images/portfolio/hoodie-8.jpg", type = "image/jpeg" }

    # Hats
    "images/portfolio/hat-1.jpg" = { path = "${path.module}/../site/images/portfolio/hat-1.jpg", type = "image/jpeg" }
    "images/portfolio/hat-2.jpg" = { path = "${path.module}/../site/images/portfolio/hat-2.jpg", type = "image/jpeg" }
    "images/portfolio/hat-3.jpg" = { path = "${path.module}/../site/images/portfolio/hat-3.jpg", type = "image/jpeg" }
    "images/portfolio/hat-4.jpg" = { path = "${path.module}/../site/images/portfolio/hat-4.jpg", type = "image/jpeg" }
    "images/portfolio/hat-5.jpg" = { path = "${path.module}/../site/images/portfolio/hat-5.jpg", type = "image/jpeg" }
    "images/portfolio/hat-6.jpg" = { path = "${path.module}/../site/images/portfolio/hat-6.jpg", type = "image/jpeg" }
    # "images/portfolio/hat-7.jpg" = { path = "${path.module}/../site/images/portfolio/hat-7.jpg", type = "image/jpeg" }
    # "images/portfolio/hat-8.jpg" = { path = "${path.module}/../site/images/portfolio/hat-8.jpg", type = "image/jpeg" }

    # Mugs
    "images/portfolio/mug-1.jpg" = { path = "${path.module}/../site/images/portfolio/mug-1.jpg", type = "image/jpeg" }
    "images/portfolio/mug-2.jpg" = { path = "${path.module}/../site/images/portfolio/mug-2.jpg", type = "image/jpeg" }
    "images/portfolio/mug-3.jpg" = { path = "${path.module}/../site/images/portfolio/mug-3.jpg", type = "image/jpeg" }
    "images/portfolio/mug-4.jpg" = { path = "${path.module}/../site/images/portfolio/mug-4.jpg", type = "image/jpeg" }
    "images/portfolio/mug-5.jpg" = { path = "${path.module}/../site/images/portfolio/mug-5.jpg", type = "image/jpeg" }
    "images/portfolio/mug-6.jpg" = { path = "${path.module}/../site/images/portfolio/mug-6.jpg", type = "image/jpeg" }
    "images/portfolio/mug-7.jpg" = { path = "${path.module}/../site/images/portfolio/mug-7.jpg", type = "image/jpeg" }
    "images/portfolio/mug-8.jpg" = { path = "${path.module}/../site/images/portfolio/mug-8.jpg", type = "image/jpeg" }

    # Tumblers
    "images/portfolio/tumbler-1.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-1.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-2.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-2.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-3.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-3.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-4.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-4.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-5.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-5.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-6.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-6.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-7.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-7.jpg", type = "image/jpeg" }
    "images/portfolio/tumbler-8.jpg" = { path = "${path.module}/../site/images/portfolio/tumbler-8.jpg", type = "image/jpeg" }

    # Tote Bags
    "images/portfolio/tote-1.jpg" = { path = "${path.module}/../site/images/portfolio/tote-1.jpg", type = "image/jpeg" }
    "images/portfolio/tote-2.jpg" = { path = "${path.module}/../site/images/portfolio/tote-2.jpg", type = "image/jpeg" }
    "images/portfolio/tote-3.jpg" = { path = "${path.module}/../site/images/portfolio/tote-3.jpg", type = "image/jpeg" }
    "images/portfolio/tote-4.jpg" = { path = "${path.module}/../site/images/portfolio/tote-4.jpg", type = "image/jpeg" }
    "images/portfolio/tote-5.jpg" = { path = "${path.module}/../site/images/portfolio/tote-5.jpg", type = "image/jpeg" }
    "images/portfolio/tote-6.jpg" = { path = "${path.module}/../site/images/portfolio/tote-6.jpg", type = "image/jpeg" }
    "images/portfolio/tote-7.jpg" = { path = "${path.module}/../site/images/portfolio/tote-7.jpg", type = "image/jpeg" }
    "images/portfolio/tote-8.jpg" = { path = "${path.module}/../site/images/portfolio/tote-8.jpg", type = "image/jpeg" }
  }
}

resource "aws_s3_object" "site_objects" {
  for_each     = local.website_files
  bucket       = aws_s3_bucket.website_bucket.id
  key          = each.key
  source       = each.value.path
  content_type = each.value.type
  etag         = filemd5(each.value.path)

  depends_on = [
    aws_s3_bucket_policy.cloudfront_access_policy
  ]
}


# ------------------------------------------------------------------------------
# CloudFront Distribution
# ------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "S3-${var.bucket_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.bucket_name}"
  default_root_object = "index.html"

  aliases = [var.domain_name]

  # logging_config {} # REMOVED: Logging configuration block

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/error.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/error.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = merge(var.tags, { Name = "${var.domain_name}-cloudfront" })

  depends_on = [
    # aws_s3_bucket.cloudfront_logs, # No longer needed
    aws_cloudfront_origin_access_identity.oai,
    aws_s3_bucket_ownership_controls.website_bucket_ownership
  ]
}