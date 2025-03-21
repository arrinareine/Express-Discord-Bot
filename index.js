require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const keepAlive = require("./server");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commandMap = new Map();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

commandFiles.forEach((file) => {
  const commands = require(`./commands/${file}`);
  if (Array.isArray(commands)) {
    commands.forEach((cmd) => commandMap.set(cmd.name, cmd));
  }
});

client.once("ready", () => {
  console.log(`✅ Bot ${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!$") || message.author.bot) return;

  const args = message.content.slice(2).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commandMap.get(commandName);

  if (command) {
    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`❌ Error saat eksekusi command ${commandName}:`, error);
      message.reply("❌ Ada error saat menjalankan perintah!");
    }
  } else {
    message.reply("❌ Command tidak ditemukan!");
  }
});

keepAlive();
client.login(process.env.TOKEN);