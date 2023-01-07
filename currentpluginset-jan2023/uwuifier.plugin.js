/**
 * @name uwuifier
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.0
 * @invite SgKSKyh9gY
 * @description Adds a slash command to uwuify the text you send.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/uwuifier.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
	const config = {
		info: {
			name: "uwuifier",
			authors: [
				{
					name: "Ahlawat",
					discord_id: "1025214794766221384",
					github_username: "Tharki-God",
				},
			],
			version: "1.2.0",
			description: "Adds a slash command to uwuify the text you send.",
			github: "https://github.com/Tharki-God/BetterDiscordPlugins",
			github_raw:
				"https://tharki-god.github.io/BetterDiscordPlugins/uwuifier.plugin.js",
		},
		changelog: [
			{
				title: "v0.0.1",
				items: ["Idea in mind"],
			},
			{
				title: "v0.0.5",
				items: ["Base Model"],
			},
			{
				title: "Initial Release v1.0.0",
				items: [
					"This is the initial release of the plugin :)",
					"I :3 wannya *looks at you* cuddwe w-w-with my fiancee :3 (p≧w≦q)",
				],
			},
			{
				title: "v1.1.1",
				items: ["Cowwected text. ^-^"],
			},
		],
		main: "uwuifier.plugin.js",
	};
	const RequiredLibs = [{
		window: "ZeresPluginLibrary",
		filename: "0PluginLibrary.plugin.js",
		external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
		downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
	},
	{
		window: "BunnyLib",
		filename: "1BunnyLib.plugin.js",
		external: "https://github.com/Tharki-God/BetterDiscordPlugins",
		downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
	},
	];
	class handleMissingLibrarys {
		load() {
			for (const Lib of RequiredLibs.filter(lib => !window.hasOwnProperty(lib.window)))
				BdApi.showConfirmationModal(
					"Library Missing",
					`The library plugin (${Lib.window}) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
					{
						confirmText: "Download Now",
						cancelText: "Cancel",
						onConfirm: () => this.downloadLib(Lib),
					}
				);
		}
		async downloadLib(Lib) {
			const fs = require("fs");
			const path = require("path");
			const { Plugins } = BdApi;
			const LibFetch = await fetch(
				Lib.downloadUrl
			);
			if (!LibFetch.ok) return this.errorDownloadLib(Lib);
			const LibContent = await LibFetch.text();
			try {
				await fs.writeFile(
					path.join(Plugins.folder, Lib.filename),
					LibContent,
					(err) => {
						if (err) return this.errorDownloadLib(Lib);
					}
				);
			} catch (err) {
				return this.errorDownloadLib(Lib);
			}
		}
		errorDownloadZLib(Lib) {
			const { shell } = require("electron");
			BdApi.showConfirmationModal(
				"Error Downloading",
				[
					`${Lib.window} download failed. Manually install plugin library from the link below.`,
				],
				{
					confirmText: "Download",
					cancelText: "Cancel",
					onConfirm: () => {
						shell.openExternal(
							Lib.external
						);
					},
				}
			);
		}
		start() { }
		stop() { }
	}
	return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
		? handleMissingLibrarys
		: (([Plugin, ZLibrary]) => {
			const {
				PluginUpdater,
				Logger,
				DiscordModules: { MessageActions },
			} = ZLibrary;
			const { 
				LibraryUtils,
				ApplicationCommandAPI,
				LibraryRequires: { request },
			} = BunnyLib.build(config);
			return class uwuifier extends Plugin {
				checkForUpdates() {
					try {
						PluginUpdater.checkForUpdate(
							config.info.name,
							config.info.version,
							config.info.github_raw
						);
					} catch (err) {
						Logger.err("Plugin Updater could not be reached.", err);
					}
				}
				start() {
					this.checkForUpdates();
					this.addCommand();
				}
				addCommand() {
					ApplicationCommandAPI.register(config.info.name, {
						name: "uwuify",
						displayName: "uwuify",
						displayDescription: "uwuify your text.",
						description: "uwuify your text.",
						type: 1,
						target: 1,
						execute: async ([send, text], { channel }) => {
							try {
								const uwufied = await this.uwuify(text.value);
								send.value
									? MessageActions.sendMessage(
										channel.id,
										{
											content: uwufied,
											tts: false,
											invalidEmojis: [],
											validNonShortcutEmojis: [],
										},
										undefined,
										{}
									)
									: MessageActions.receiveMessage(
										channel.id,
										LibraryUtils.FakeMessage(channel.id, "uwufied")
									);
							} catch (err) {
								Logger.err(err);
								MessageActions.receiveMessage(
									channel.id,
									LibraryUtils.FakeMessage(
										channel.id,
										"Couwdn't ^-^ uwuify OwO youw message. P-P-Pwease twy UwU again watew"
									)
								);
							}
						},
						options: [
							{
								description: "Whether you want to send this or not.",
								displayDescription: "Whether you want to send this or not.",
								displayName: "Send",
								name: "Send",
								required: true,
								type: 5,
							},
							{
								description: "The text you want uwuify. uwu <3",
								displayDescription: "The text you want uwuify. uwu <3",
								displayName: "Text",
								name: "Text",
								required: true,
								type: 3,
							},
						],
					});
				}
				uwuify(text) {
					return new Promise((resolve, reject) => {
						const options = [
							`https://uwuifier-nattexd.vercel.app/api/uwuify/${encodeURI(
								text
							)}`,
							{ json: true },
						];
						request.get(...options, (err, res, body) => {
							if (err || (res.statusCode < 200 && res.statusCode > 400))
								return reject("Unwown ewwow occuwwed.");
							resolve(JSON.parse(body).message);
						});
					});
				}
				onStop() {
					ApplicationCommandAPI.unregister(config.info.name);
				}
			};
		})(ZLibrary.buildPlugin(config));
})();
  /*@end@*/
