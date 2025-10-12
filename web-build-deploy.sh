#!/bin/bash

###############################################################################
# VENUSA Frontend Web Build and Deploy Script
#
# This script builds the Expo web project and deploys to S3
# Usage: ./web-build-deploy.sh
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   VENUSA Frontend Build & Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}[1/6] Cleaning previous builds...${NC}"
rm -rf dist/ web-build/ .expo/
echo -e "${GREEN}✓ Cleaned previous builds${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/6] Installing/updating dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 3: Build for web
echo -e "${YELLOW}[3/6] Building Expo web app...${NC}"
npx expo export --platform web
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Web build completed${NC}"
else
    echo -e "${RED}✗ Failed to build web app${NC}"
    exit 1
fi
echo ""

# Step 4: Check dist folder
echo -e "${YELLOW}[4/6] Preparing distribution folder...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✓ Distribution folder ready${NC}"
elif [ -d "web-build" ]; then
    mv web-build dist
    echo -e "${GREEN}✓ Distribution folder renamed${NC}"
else
    echo -e "${RED}✗ Build folder not found${NC}"
    exit 1
fi
echo ""

# Step 5: Create zip file
echo -e "${YELLOW}[5/6] Creating deployment package...${NC}"
cd dist
zip -r ../dist.zip . -q
cd ..
echo -e "${GREEN}✓ Deployment package created: dist.zip${NC}"
echo ""

# Step 6: Upload to S3 (if AWS CLI is configured)
echo -e "${YELLOW}[6/6] Uploading to S3...${NC}"
if command -v aws &> /dev/null; then
    aws s3 cp dist.zip s3://venusa/venusa/frontend/dist.zip --acl public-read
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Uploaded to S3${NC}"
    else
        echo -e "${YELLOW}⚠ S3 upload failed (manual upload may be required)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ AWS CLI not found. Please upload dist.zip manually to:${NC}"
    echo -e "${YELLOW}  https://venusa.s3.ap-south-1.amazonaws.com/venusa/frontend/dist.zip${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Build Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. If S3 upload failed, manually upload dist.zip to S3"
echo -e "  2. SSH to production server:"
echo -e "     ${YELLOW}ssh ubuntu@3.110.46.10${NC}"
echo -e "  3. Run frontend deployment:"
echo -e "     ${YELLOW}cd /home/ubuntu/Webservices && ./deploy-frontend.sh${NC}"
echo -e "  4. Verify at: ${GREEN}http://3.110.46.10/${NC}"
echo ""
