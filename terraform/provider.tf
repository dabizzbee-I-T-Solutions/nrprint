provider "aws" {
  region = "ap-southeast-1" # Change to your desired region
}
terraform {
  backend "s3" {
    bucket = "dabizzbee-terraform-state"
    key    = "nrprint/terraform.tfstate"
    region = "us-east-1" # or your actual AWS region
  }
}
