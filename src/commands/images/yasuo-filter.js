/** @format
 *
 * Testing with APIS
 */
import uploadImage from '../../lib/uploadImage.js';

export default {
	name: 'yasuofilter',
	alias: ['yasuo'],
	desc: 'Yasuo face filter >//<',
	category: 'Images',
	async exec({ msg, sock, arg, prefix, command }) {
		sock.yasuo_filter = sock.yasuo_filter ? sock.yasuo_filter : {};
		if (msg.sender in sock.yasuo_filter)
			return msg.reply(
				'You have unfinish job before, please wait until finish, ok?'
			);
		sock.yasuo_filter[msg.sender] = true;
		let file = msg.quoted ? msg.quoted : msg,
			mime =
				(file.msg || file).message?.imageMessage?.mimetype ||
				file.mediaType ||
				'';
		if (!mime)
			return msg.reply(`Reply/Send the image with caption ${prefix + command}`);
		m.reply('Please Wait...');
		if (/image\/(jpe?g|png)/.test(mime)) {
			const img = await file.download();
			const upload = await uploadImage(img);
			try {
				await sock.sendMessage(
					msg.from,
					{
						image: {
							url: global.api('rose', '/image/comics', { url: upload }),
						},
						caption: 'Yasuo Filter >//<',
					},
					{
						quoted: msg,
					}
				);
			} catch (e) {
				msg.reply("*ERROR!*\nMake sure the picture you've send have a face!");
			} finally {
				delete sock.yasuo_filter[msg.sender];
			}
		} else if (/video/i.test(mime)) {
			return msg.reply('Video not supported!');
		}
	},
};
