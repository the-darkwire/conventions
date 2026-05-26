import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "./src/config";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(env.DISCORD_TOKEN);
