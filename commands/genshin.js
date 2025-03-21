const fetch = require("node-fetch");

const commands = [
    {
        name: "genshin",
        description: "Cek UID Genshin Impact",
        async execute(message, args) {
            const base_url = "https://enka.network/api/uid/";
            const uid = args[0];

            if (!args.length) {
                return message.reply(
                    "❌ Tolong masukkan UID Genshin Impact! Contoh: `!$genshin 833446747`",
                );
            }

            try {
                const response = await fetch(`${base_url}${uid}/?info`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                        "Accept": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `❌ Error: ${response.status} - ${response.statusText}`,
                    );
                }

                const data = await response.json();

                if (!data.playerInfo) {
                    return message.reply(
                        `❌ Data UID **${uid}** tidak ditemukan atau private!`,
                    );
                }

                message.reply(
                    `🔹 Nama: ${data.playerInfo.nickname}\n` +
                    `🔹 Adventure Rank: ${data.playerInfo.level}\n` +
                    `🔹 Signature: ${data.playerInfo.signature || "Tidak ada"}`,
                );
            } catch (error) {
                message.reply("❌ Gagal mengambil data UID, coba lagi nanti!");
            }
        },
    },
];

module.exports = commands;
