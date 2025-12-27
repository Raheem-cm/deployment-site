# deployment-site
 # RAHEEM-XMD-3 DEPLOY PANEL

A web-based panel to easily deploy RAHEEM-XMD-3 WhatsApp bot without manual configuration.

## Features:
- Upload session file (creds.json)
- Configure environment variables via form
- Generate ready-to-deploy ZIP package
- Support for multiple platforms (Render, Heroku, Koyeb, etc.)

## How to Use:
1. Open `index.html` in browser
2. Upload your WhatsApp session file
3. Fill in env variables (SESSION_ID is required)
4. Click "Generate Deployment Package"
5. Download ZIP and deploy to your preferred platform

## Requirements:
- Modern web browser with JavaScript enabled
- Session ID from WhatsApp pairing
- Basic knowledge of deployment platforms

## Deployment Platforms:
- **Render**: Upload ZIP, connect repo, deploy
- **Heroku**: Use Heroku CLI or connect GitHub
- **Koyeb**: Deploy via Git/Docker
- **Manual**: Extract, run `npm install`, then `npm start`

## Credits:
Developed by RAHEEM-CM | Tanzania 🇹🇿
