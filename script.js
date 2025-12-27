 document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const toggleAdvanced = document.getElementById('toggleAdvanced');
    const advancedSection = document.getElementById('advancedSection');
    const generateBtn = document.getElementById('generateBtn');
    const downloadSection = document.getElementById('downloadSection');
    const downloadLink = document.getElementById('downloadLink');
    const output = document.getElementById('output');

    let uploadedFile = null;

    // Toggle advanced settings
    toggleAdvanced.addEventListener('click', function() {
        const isHidden = advancedSection.classList.toggle('hidden');
        toggleAdvanced.className = isHidden ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    });

    // Upload area interactions
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#00a8ff';
        uploadArea.style.background = 'rgba(0, 168, 255, 0.1)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#555';
        uploadArea.style.background = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#555';
        uploadArea.style.background = '';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit');
            return;
        }
        uploadedFile = file;
        fileInfo.innerHTML = `
            <strong><i class="fas fa-file"></i> Uploaded:</strong> ${file.name}<br>
            <strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
            <strong>Type:</strong> ${file.type || 'Unknown'}
        `;
    }

    // Generate deployment package
    generateBtn.addEventListener('click', async function() {
        const sessionId = document.getElementById('sessionId').value.trim();
        if (!sessionId) {
            alert('Please enter SESSION_ID');
            return;
        }

        output.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating deployment package...';

        // Collect env variables
        const env = {
            SESSION_ID: sessionId,
            PREFIX: document.getElementById('prefix').value,
            MODE: document.getElementById('mode').value,
            OWNER_NUMBER: document.getElementById('ownerNumber').value,
            BOT_NAME: document.getElementById('botName').value,
            STICKER_NAME: document.getElementById('stickerName').value,
            ALWAYS_ONLINE: document.getElementById('alwaysOnline').checked ? 'true' : 'false',
            WELCOME: document.getElementById('welcome').checked ? 'true' : 'false',
            ANTI_LINK: document.getElementById('antiLink').checked ? 'true' : 'false',
            MENU_IMAGE_URL: document.getElementById('menuImage').value,
            DESCRIPTION: document.getElementById('description').value,
            ALIVE_IMG: document.getElementById('aliveImg').value,
            LIVE_MSG: document.getElementById('liveMsg').value,
            AUTO_STATUS_SEEN: "true",
            AUTO_STATUS_REACT: "true",
            AUTO_STATUS_REPLY: "false",
            AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY RAHEEM-XMD-3 🐺*",
            ANTI_LINK_KICK: "false",
            MENTION_REPLY: "false",
            AUTO_REACT: "false",
            CUSTOM_REACT: "false",
            CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
            DELETE_LINKS: "true",
            OWNER_NAME: "RAHEEM-CM",
            READ_MESSAGE: "false",
            AUTO_VOICE: "false",
            AUTO_STICKER: "false",
            AUTO_REPLY: "false",
            PUBLIC_MODE: "false",
            AUTO_TYPING: "false",
            READ_CMD: "true",
            DEV: "255763111390",
            ANTI_VV: "true",
            ANTI_DEL_PATH: "log",
            AUTO_RECORDING: "false"
        };

        // Create config.js content
        let configContent = `const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {`;

        for (const [key, value] of Object.entries(env)) {
            configContent += `
    ${key}: process.env.${key} || "${value}",`;
        }

        configContent += `
};`;

        // Create .env content
        let envContent = '';
        for (const [key, value] of Object.entries(env)) {
            envContent += `${key}=${value}\n`;
        }

        // Create app.json content (for Heroku/Render)
        const appJson = {
            name: env.BOT_NAME,
            description: "Javascript WhatsApp bot made ʙʏ RAHEEM-CM",
            logo: env.ALIVE_IMG,
            keywords: [env.BOT_NAME],
            success_url: "/",
            stack: "container",
            env: {},
            buildpacks: [{ url: "https://github.com/heroku/heroku-buildpack-nodejs.git" }],
            stack: "heroku-24"
        };

        for (const [key, value] of Object.entries(env)) {
            appJson.env[key] = {
                description: `Set ${key} for bot`,
                required: key === 'SESSION_ID',
                value: value
            };
        }

        // Create package.json content
        const packageJson = {
            name: env.BOT_NAME.replace(/\s+/g, '-'),
            version: "2.0.0",
            description: "A WhatsApp Bot Created By Dev Raheem-cm",
            main: "index.js",
            scripts: {
                start: "pm2 start index.js --deep-monitoring --attach --name " + env.BOT_NAME.replace(/\s+/g, '-'),
                stop: "pm2 stop " + env.BOT_NAME.replace(/\s+/g, '-'),
                restart: "pm2 restart " + env.BOT_NAME.replace(/\s+/g, '-')
            },
            dependencies: {
                "@whiskeysockets/baileys": "npm:baileys-pro@0.0.5",
                "@adiwajshing/keyed-db": "^0.2.4",
                "pino": "^7.0.5",
                "pm2": "^6.0.5",
                "util": "^0.12.4",
                "express": "latest",
                "moment-timezone": "^0.5.45",
                "axios": "^1.2.5",
                "fs-extra": "^11.1.0",
                "fs": "^0.0.1-security",
                "ffmpeg": "^0.0.4",
                "file-type": "^16.5.3",
                "fluent-ffmpeg": "^2.1.2",
                "form-data": "^4.0.0",
                "path": "^0.12.7",
                "node-fetch": "^2.6.1",
                "megajs": "^1.1.0",
                "wa-sticker-formatter": "^4.4.4",
                "vm": "^0.1.0",
                "adm-zip": "^0.5.16",
                "cheerio": "^1.0.0-rc.12",
                "qrcode-terminal": "^0.12.0",
                "sequelize": "^6.37.5",
                "sqlite3": "^5.1.7"
            }
        };

        // Create README.md
        const readmeContent = `# ${env.BOT_NAME}

## Deployment Ready Package

This package was generated by RAHEEM-XMD-3 Deploy Panel.

### Files included:
- \`index.js\` - Main bot file
- \`config.js\` - Configuration file
- \`app.json\` - For platform deployment
- \`package.json\` - Dependencies
- \`.env\` - Environment variables
- \`sessions/\` - Your WhatsApp session

### Quick Start:
1. Extract this ZIP
2. Run \`npm install\`
3. Run \`npm start\`

### Env Variables:
${Object.entries(env).map(([k, v]) => `- ${k}=${v}`).join('\n')}

---
**Powered by RAHEEM-CM | Tanzania 🇹🇿**`;

        // Create a ZIP file using JSZip
        const JSZip = window.JSZip || (await import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')).default;
        const zip = new JSZip();

        // Add config.js
        zip.file("config.js", configContent);

        // Add .env
        zip.file(".env", envContent);

        // Add app.json
        zip.file("app.json", JSON.stringify(appJson, null, 2));

        // Add package.json
        zip.file("package.json", JSON.stringify(packageJson, null, 2));

        // Add README.md
        zip.file("README.md", readmeContent);

        // Add command.js (basic version)
        const commandJs = `var commands = [];

function cmd(info, func) {
    var data = info;
    data.function = func;
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!info.desc) info.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!info.category) data.category = 'misc';
    if(!info.filename) data.filename = "Not Provided";
    commands.push(data);
    return data;
}
module.exports = {
    cmd,
    AddCommand:cmd,
    Function:cmd,
    Module:cmd,
    commands,
};`;
        zip.file("command.js", commandJs);

        // Add index.js (simplified version)
        const indexJs = `const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const config = require('./config');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            console.log('Connection closed, reconnecting...');
            startBot();
        } else if (connection === 'open') {
            console.log('${env.BOT_NAME} connected successfully!');
            conn.sendMessage(conn.user.id, { text: '${env.BOT_NAME} is now online!' });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const from = msg.key.remoteJid;
        
        if (text === '${env.PREFIX}ping') {
            await conn.sendMessage(from, { text: 'Pong! ${env.BOT_NAME} is alive.' });
        }
        
        if (text === '${env.PREFIX}menu') {
            await conn.sendMessage(from, { 
                image: { url: '${env.MENU_IMAGE_URL}' },
                caption: \`*${env.BOT_NAME} Menu*\\n\\nPrefix: ${env.PREFIX}\\nMode: ${env.MODE}\\n\\n${env.DESCRIPTION}\`
            });
        }
    });
}

// Create sessions directory if not exists
if (!fs.existsSync('./sessions')) fs.mkdirSync('./sessions');

// If session file uploaded, move it
if (fs.existsSync('./temp_creds.json')) {
    fs.renameSync('./temp_creds.json', './sessions/creds.json');
}

app.get('/', (req, res) => {
    res.send(\`<h1>${env.BOT_NAME} is running!</h1>\`);
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
    startBot();
});`;
        zip.file("index.js", indexJs);

        // Add sessions folder with uploaded file
        if (uploadedFile) {
            const fileData = await readFileAsArrayBuffer(uploadedFile);
            zip.file("sessions/creds.json", fileData);
        } else {
            zip.file("sessions/.gitkeep", "");
        }

        // Generate ZIP
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);

        downloadLink.href = url;
        downloadLink.download = `${env.BOT_NAME.replace(/\s+/g, '-')}-Deploy.zip`;
        downloadSection.classList.remove('hidden');
        output.innerHTML = `<span style="color:#00ff88"><i class="fas fa-check-circle"></i> Package generated successfully!</span><br>
        <small>Contains all necessary files for deployment.</small>`;

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Platform buttons
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            alert(`Selected ${platform.toUpperCase()} deployment. Generate package first, then follow platform-specific instructions.`);
        });
    });
});
