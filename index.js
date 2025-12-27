require("dotenv").config();
const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, Events } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { BOT_NAME } = require("./config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ ${BOT_NAME} logged in as ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Check if MW-BOT is running"),

    new SlashCommandBuilder()
      .setName("status")
      .setDescription("Show MW-BOT system status")
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log("✅ Slash commands registered");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong! MW-BOT is online.");
  }

  if (interaction.commandName === "status") {
    await interaction.reply({
      content:
`🤖 **MW-BOT Status**
• Bot: Online
• Mode: Production
• Uptime: Stable
• Ready for onboarding & audit modules`,
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
