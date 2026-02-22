const { EmbedBuilder } = require('discord.js');

const AutoResponseRules = [
    function (Message) {
        const normalizedContent = Message.toLowerCase()
            .replace(/'/g, '')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/0/g, 'o')
            .replace(/5/g, 's')
            .replace(/7/g, 't');

        const keywords = [
            'skins not showing', 'skins not in game', 'skins not appearing', 'where are my skins',
            'no skins', 'default skin', 'skins missing', 'character missing', 'missing cosmetics',
            'skins gone', 'why am i a default', 'no locker', 'locker empty', 'locker not working',
            'locker missing', 'skins dont work', 'skins wont work', 'skins arent showing',
            'no mcp', 'skins loading', 'cosmetics missing', 'outfits not showing',
            'skins are not showing', 'skin not showing', 'cant see my skins', 'cant see my skin',
            'see my skins', 'see my skin', 'where are my cosmetics', 'where is my skin',
            'where are my skins', 'missing my skins', 'missing my skin'
        ];

        const hasMatch = keywords.some(k => normalizedContent.includes(k)) || 
                         (normalizedContent.includes('skin') && (normalizedContent.includes('not showing') || normalizedContent.includes('isnt showing') || normalizedContent.includes('isnt appearing') || normalizedContent.includes('cant see') || normalizedContent.includes('dont see') || normalizedContent.includes('where is') || normalizedContent.includes('where are')));

        if (hasMatch) {
            return new EmbedBuilder()
                .setColor('#89CFF0')
                .setTitle('Skins Not Showing?')
                .setDescription('**If you cannot see your skins in-game, follow this fix:**')
                .addFields(
                    { name: 'Solution', value: 'Turn off No MCP before you load into the game on the Reboot gameserver.' }
                )
        }
    },
    function (Message) {
        const normalizedContent = Message.toLowerCase()
            .replace(/'/g, '')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/0/g, 'o')
            .replace(/5/g, 's')
            .replace(/7/g, 't');

        const keywords = [
            'game is crashing', 'game crash', 'crashing on startup', 'game keeps crashing',
            'game wont load', 'crash on load', 'game closes', 'game closing', 'crash when open',
            'application crash', 'application has crashed', 'crash detected', 'aplication crash',
            'build is crashing', 'build crashing', 'crashing when i start', 'failed to open descriptor file',
            'fortnitegame.uproject', 'uproject'
        ];

        const hasMatch = keywords.some(k => normalizedContent.includes(k)) || 
                         (normalizedContent.includes('crash') && (normalizedContent.includes('detected') || normalizedContent.includes('fix') || normalizedContent.includes('how to'))) ||
                         (normalizedContent.includes('build') && (normalizedContent.includes('crash') || normalizedContent.includes('crashing'))) ||
                         (normalizedContent.includes('failed') && normalizedContent.includes('descriptor'));

        if (hasMatch) {
            return new EmbedBuilder()
                .setColor('#89CFF0')
                .setTitle('Game Crashing?')
                .setDescription('**If your game is crashing, try the following fix:**')
                .addFields(
                    { name: 'Solution', value: 'Reinstall the build you’re trying to play on.' }
                )
        }
    },
    function (Message) {
        const normalizedContent = Message.toLowerCase()
            .replace(/'/g, '')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/0/g, 'o')
            .replace(/5/g, 's')
            .replace(/7/g, 't');

        const keywords = [
            'cant play with controller', 'controller not working', 'how to use controller',
            'controller help', 'fix controller', 'gamepad not working', 'ps4 controller',
            'xbox controller', 'ps5 controller', 'controller support'
        ];

        const hasMatch = keywords.some(k => normalizedContent.includes(k)) || 
                         (normalizedContent.includes('controller') && (normalizedContent.includes('cant') || normalizedContent.includes('fix') || normalizedContent.includes('work') || normalizedContent.includes('how to') || normalizedContent.includes('tutorial')));

        if (hasMatch) {
            return new EmbedBuilder()
                .setColor('#89CFF0')
                .setTitle('Controller Not Working?')
                .setDescription('**If you cannot play with your controller, follow this tutorial:**')
                .addFields(
                    { name: 'Tutorial', value: 'https://www.youtube.com/watch?v=zwVJ-l8MGIk&t=37s' }
                )
        }
    },
    function (Message) {
        const normalizedContent = Message.toLowerCase()
            .replace(/'/g, '')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/0/g, 'o')
            .replace(/5/g, 's')
            .replace(/7/g, 't');

        const keywords = [
            'login screen', 'getting a login screen', 'stuck on login', 'asking to login',
            'login page', 'why do i need to login', 'i see a login screen', 'login issue',
            'epic games', 'zaloguj sie', 'e-mail', 'haslo do konta'
        ];

        const hasMatch = keywords.some(k => normalizedContent.includes(k)) || 
                         (normalizedContent.includes('login') && (normalizedContent.includes('screen') || normalizedContent.includes('stuck') || normalizedContent.includes('play') || normalizedContent.includes('start') || normalizedContent.includes('fortnite'))) ||
                         (normalizedContent.includes('showing') && normalizedContent.includes('login')) ||
                         (normalizedContent.includes('zaloguj') && normalizedContent.includes('sie'));

        if (hasMatch) {
            return new EmbedBuilder()
                .setColor('#89CFF0')
                .setTitle('Stuck on Login Screen?')
                .setDescription('**If you are seeing a login screen when trying to play, follow this fix:**')
                .addFields(
                    { name: 'Solution', value: 'Disable Real Time Protection' }
                )
        }
    }
];

module.exports = AutoResponseRules;
