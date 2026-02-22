const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType, Events } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');
const AutoResponseRules = require('./Response.js');
const chalk = require('chalk');
const boxen = require('boxen');
const gradient = require('gradient-string');
const Table = require('cli-table3');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const LOCK_FILE = path.join(__dirname, 'bot.lock');

function checkInstances() {
    let instances = [];
    if (fs.existsSync(LOCK_FILE)) {
        try {
            instances = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
        } catch (e) {
            instances = [];
        }
    }

    instances = instances.filter(pid => {
        try {
            process.kill(pid, 0);
            return true;
        } catch (e) {
            return false;
        }
    });

    if (instances.length >= 1) {
        console.clear();
        console.log(chalk.red(boxen('FATAL ERROR: BOT ALREADY RUNNING', { padding: 1, borderStyle: 'double' })));
        console.log(chalk.yellow(`\nAn instance of the bot is already running (PID: ${instances[0]}).`));
        console.log(chalk.cyan('Please close the existing window before starting a new one.\n'));
        process.exit(1);
    }

    instances.push(process.pid);
    fs.writeFileSync(LOCK_FILE, JSON.stringify(instances));

    process.on('exit', () => {
        try {
            let current = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
            current = current.filter(pid => pid !== process.pid);
            if (current.length === 0) {
                fs.unlinkSync(LOCK_FILE);
            } else {
                fs.writeFileSync(LOCK_FILE, JSON.stringify(current));
            }
        } catch (e) {}
    });

    process.on('SIGINT', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
}

checkInstances();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

const IgnoredRoles = process.env.IGNORED_ROLES ? process.env.IGNORED_ROLES.split(',') : [];
const themeGradient = gradient(['#00F260', '#0575E6']);

function logStatus(type, message) {
    const time = chalk.gray(new Date().toLocaleTimeString());
    let prefix = '';
    
    switch(type) {
        case 'success': prefix = chalk.green('[SUCCESS]'); break;
        case 'info': prefix = chalk.blue('[INFO]'); break;
        case 'warn': prefix = chalk.yellow('[WARN]'); break;
        case 'error': prefix = chalk.red('[ERROR]'); break;
        case 'ocr': prefix = chalk.magenta('[OCR]'); break;
    }
    
    console.log(`${time} ${prefix} ${message}`);
}

client.once(Events.ClientReady, () => {
    const banner = themeGradient.multiline([
        "  █████╗ ██╗    ██████╗  ██████╗ ████████╗",
        " ██╔══██╗██║    ██╔══██╗██╔═══██╗╚══██╔══╝",
        " ███████║██║    ██████╔╝██║   ██║   ██║   ",
        " ██╔══██║██║    ██╔══██╗██║   ██║   ██║   ",
        " ██║  ██║██║    ██████╔╝╚██████╔╝   ██║   ",
        " ╚═╝  ╚═╝╚═╝    ╚═════╝  ╚═════╝    ╚═╝   "
    ].join('\n'));

    console.clear();
    console.log(banner);
    
    const statsTable = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });

    statsTable.push(
        [chalk.cyan('Bot Name'), chalk.white(client.user.tag)],
        [chalk.cyan('Servers'), chalk.white(client.guilds.cache.size)],
        [chalk.cyan('Status'), chalk.green('Online (Free Mode)')]
    );

    console.log(boxen(statsTable.toString(), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        title: 'System Overview',
        titleAlignment: 'center'
    }));

    console.log(chalk.gray('  Press ') + chalk.yellow('R') + chalk.gray(' to Restart | ') + chalk.yellow('Q') + chalk.gray(' to Quit') + '\n');

    client.user.setPresence({
        activities: [{ name: 'Made with ❤️ by Benzi', type: ActivityType.Custom }],
        status: 'online',
    });
    logStatus('success', 'Bot initialized in Free Mode (Using OCR for Images).');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
        if (key === 'r' || key === 'R') {
            logStatus('warn', 'Restarting bot...');
            process.exit(42);
        }
        if (key === 'q' || key === 'Q' || key === '\u0003') {
            logStatus('warn', 'Shutting down...');
            process.exit(0);
        }
    });
});

async function processImage(url) {
    try {
        const { data: { text } } = await Tesseract.recognize(url, 'eng');
        return text;
    } catch (error) {
        logStatus('error', `OCR failed: ${error.message}`);
        return '';
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.member && message.member.roles.cache.some(role => IgnoredRoles.includes(role.id))) {
        return;
    }

    let combinedText = message.content.toLowerCase();

    if (message.attachments.size > 0) {
        logStatus('ocr', `Analyzing ${message.attachments.size} image(s) from ${message.author.tag}...`);
        for (const attachment of message.attachments.values()) {
            if (attachment.contentType && attachment.contentType.startsWith('image/')) {
                const extractedText = await processImage(attachment.url);
                combinedText += ' ' + extractedText.toLowerCase();
            }
        }
    }

    for (const rule of AutoResponseRules) {
        try {
            const response = rule(combinedText);
            if (response) {
                logStatus('info', `${chalk.yellow(message.author.tag)} triggered Auto-Response in ${chalk.blue('#' + message.channel.name)}`);
                await message.reply({ embeds: [response] }).catch(console.error);
                return;
            }
        } catch (error) {
            logStatus('error', `Auto-Response error: ${error.message}`);
        }
    }
});

client.on('error', (error) => {
    logStatus('error', `Discord client error: ${error.message}`);
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    logStatus('error', `Login failed: ${error.message}`);
});
