# Deployment Guide

## Fixed Issues

1. **Vite Command Not Found Error**: 
   - Moved `vite` and `@vitejs/plugin-react` from devDependencies to dependencies in `frontend/package.json`
   - This ensures build tools are available during production builds

2. **Build Configuration**:
   - Updated root `package.json` build script to install dependencies before building
   - Added `heroku-postbuild` script for Heroku deployments
   - Created `vercel.json` for Vercel-specific configuration

## For Vercel Deployment

### Option 1: Deploy Frontend Only
- Set build command: `cd frontend && npm install && npm run build`
- Set output directory: `frontend/dist`
- Set install command: `cd frontend && npm install`

### Option 2: Use Root Package.json
- Set build command: `npm run build`
- Set output directory: `frontend/dist`
- Set install command: `npm install`

## Environment Variables for Vercel
Make sure to set these in your Vercel dashboard:
- `VITE_API_URL` (your backend API URL)
- Any other environment variables your app needs

## Local Testing
```bash
# Test build locally
npm run build

# Or test frontend build directly
cd frontend && npm run build
```

## Files Created/Modified
- `vercel.json` - Vercel deployment configuration
- `.npmrc` (root and frontend) - NPM configuration
- `package.json` (root) - Updated build scripts and added engines
- `frontend/package.json` - Moved build tools to dependencies
