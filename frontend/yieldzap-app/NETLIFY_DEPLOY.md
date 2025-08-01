# YieldZap Netlify Deployment Guide

## Quick Deploy to Netlify

### Method 1: Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from the frontend directory**
   ```bash
   cd frontend/yieldzap-app
   netlify deploy --build
   ```

4. **For production deployment**
   ```bash
   netlify deploy --build --prod
   ```

### Method 2: Git-based Deployment

1. **Push your code to GitHub/GitLab**

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Set build settings:
     - **Build command**: `npm run netlify-build`
     - **Publish directory**: `out`
     - **Base directory**: `frontend/yieldzap-app`

3. **Configure Environment Variables**
   In Netlify dashboard → Site settings → Environment variables, add:
   ```
   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   NEXT_PUBLIC_STELLAR_PASSPHRASE=Test SDF Network ; September 2015
   ```

### Method 3: Drag & Drop

1. **Build locally**
   ```bash
   cd frontend/yieldzap-app
   npm run netlify-build
   ```

2. **Drag the `out` folder to Netlify's deploy area**

## Environment Variables Setup

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

Update the contract addresses after deployment:
- `NEXT_PUBLIC_ZAP_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_SOROSWAP_ROUTER_ADDRESS`
- `NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS`

## Custom Domain Setup

1. In Netlify dashboard → Domain settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run type-check`
- Verify environment variables are set correctly

### Runtime Errors
- Check browser console for errors
- Verify Stellar network connectivity
- Ensure Freighter wallet is installed and connected

### Performance Optimization
- Images are automatically optimized for static export
- Consider enabling Netlify's asset optimization
- Use Netlify Analytics for performance monitoring
