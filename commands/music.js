const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const play = require("play-dl");

module.exports = [
    {
        name: "play",
        description: "Play musik dari YouTube",
        async execute(message, args) {
            if (!message.member.voice.channel) {
                return message.reply("❌ Masuk voice channel dulu!");
            }
            if (!args.length) {
                return message.reply("❌ Kasih link YouTube atau judul lagu!");
            }

            const channel = message.member.voice.channel;
            let connection = getVoiceConnection(message.guild.id);
            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
            }

            try {
                let videoUrl = args[0];
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                if (!youtubeRegex.test(videoUrl)) {
                    const searchResult = await play.search(args.join(" "), { limit: 1 });
                    if (!searchResult.length) return message.reply("❌ Gak nemu lagu!");
                    videoUrl = searchResult[0].url;
                }

                const stream = await play.stream(videoUrl, { quality: 2, fmt: "pcm" });
                const resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
                resource.volume.setVolume(1.0);

                const player = createAudioPlayer();
                player.play(resource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Playing, () => console.log("🎵 Now Playing"));
                player.on(AudioPlayerStatus.Idle, () => console.log("⏹️ Player Stopped"));
                player.on("error", (error) => console.error("❌ Player Error:", error));

                message.reply(`🎵 Now Playing: **${videoUrl}**`);
            } catch (error) {
                console.error("❌ Error:", error);
                message.reply("❌ Gagal mutar lagu!");
            }
        },
    },
    {
        name: "leave",
        description: "Bot keluar dari voice channel",
        execute(message) {
            const connection = getVoiceConnection(message.guild.id);
            if (!connection) return message.reply("❌ Gue lagi ga di voice channel!");

            connection.destroy();
            message.reply("👋 Keluar dari voice channel!");
        },
    },
];
