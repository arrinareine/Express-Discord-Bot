const commands = [
  {
    name: "ping",
    description: "Cek latency bot",
    execute(message) {
      message.reply(`🏓 Pong! Latency: ${message.client.ws.ping}ms`);
    },
  },
];

module.exports = commands;