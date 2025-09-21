#!/bin/bash

# Google Cloud Artifact Registry Deployment Script
# Project: springz-nutriation
# Artifact Registry: springz-website
# Image Name: springz-nutriation

set -e

# Configuration
PROJECT_ID="springz-nutriation"
REGION="asia-south1"  # Mumbai region
REPOSITORY="springz-website"
IMAGE_NAME="springz-nutriation"
TAG="cloudrun"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Google Cloud Artifact Registry Deployment ===${NC}"
echo -e "${BLUE}Project: ${PROJECT_ID}${NC}"
echo -e "${BLUE}Repository: ${REPOSITORY}${NC}"
echo -e "${BLUE}Image: ${IMAGE_NAME}${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Please install Google Cloud CLI from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

echo -e "${YELLOW}Step 1: Authenticating with Google Cloud...${NC}"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

echo -e "${YELLOW}Step 2: Setting project...${NC}"
gcloud config set project ${PROJECT_ID}

echo -e "${YELLOW}Step 3: Enabling required APIs...${NC}"
gcloud services enable artifactregistry.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet

echo -e "${YELLOW}Step 4: Creating Artifact Registry repository (if not exists)...${NC}"
gcloud artifacts repositories create ${REPOSITORY} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for Springz Nutrition website" \
    --quiet || echo "Repository already exists"

echo -e "${YELLOW}Step 5: Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${TAG} .

echo -e "${YELLOW}Step 6: Tagging image for Artifact Registry...${NC}"
FULL_IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:${TAG}"
# Also tag the existing us-central1 image for mumbai region
docker tag us-central1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:${TAG} ${FULL_IMAGE_NAME}

echo -e "${YELLOW}Step 7: Pushing image to Artifact Registry...${NC}"
docker push ${FULL_IMAGE_NAME}

echo -e "${YELLOW}Step 8: Enabling Cloud Run API...${NC}"
gcloud services enable run.googleapis.com --quiet

echo -e "${YELLOW}Step 9: Deploying to Cloud Run...${NC}"
gcloud run deploy springz-nutriation \
    --image=${FULL_IMAGE_NAME} \
    --platform=managed \
    --region=${REGION} \
    --allow-unauthenticated \
    --port=3000 \
    --memory=2Gi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --quiet

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Image pushed to:${NC}"
echo -e "${GREEN}${FULL_IMAGE_NAME}${NC}"
echo ""
echo -e "${BLUE}Cloud Run service deployed!${NC}"
echo -e "${YELLOW}Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe springz-nutriation --region=${REGION} --format="value(status.url)" 2>/dev/null || echo "Unable to retrieve URL")
echo -e "${GREEN}Service URL: ${SERVICE_URL}${NC}"
echo ""
echo -e "${BLUE}To view your images in Artifact Registry:${NC}"
echo -e "${GREEN}gcloud artifacts docker images list ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}${NC}"
echo ""
echo -e "${BLUE}To manage your Cloud Run service:${NC}"
echo -e "${GREEN}gcloud run services list --region=${REGION}${NC}"
