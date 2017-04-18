/**
 * exports 'eroad.dataParser'
 * author Robin
 */

define('eroad.dataParser', ['crypt.CryptoJS', 'crypt.MD5', 'crypt.sha256', 'crypt.base64'],
	function (CryptoJS, MD5, sha256, base64) {

		'use strict';
		function dataParse(config) {
			this.linkid = config.linkid || this.createLinkid();
			this.summarySalt = config.summarySalt;
			this.sha256Salt = config.sha256Salt;
		}

		dataParse.prototype = {
			createLinkid: function () {
				var s = [];
				var hexDigits = "0123456789abcdef";
				for (var i = 0; i < 36; i++) {
					s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
				}
				s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
				s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
				s[8] = s[13] = s[18] = s[23] = "-";

				var uuid = s.join("");
				return uuid;
			},
			getLinkId: function () {
				return this.linkid;
			},
			setLinkId: function (linkid) {
				this.linkid = linkid;
			},
			getUtf8Len: function (str) {
				var cnt = 0;
				for (var i = 0; i < str.length; i++) {
					var value = str.charCodeAt(i);
					if (value < 0x080) {
						cnt += 1;
					} else if (value < 0x0800) {
						cnt += 2;
					} else {
						cnt += 3;
					}
				}
				return cnt;
			},
			/***
			 * 加密
			 * @param word
			 * @param skey
			 */
			encrypt: function (word, skey) {
				if (!word) word = '';
				var length = this.getUtf8Len(word),
					padLength = (16 - length % 16) % 16;

				for (var i = 0; i < padLength; i++) word += ' ';

				var key = CryptoJS.enc.Utf8.parse(skey);
				var srcs = CryptoJS.enc.Utf8.parse(word);
				var encrypted = CryptoJS.AES.encrypt(srcs, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.ZeroPadding
				});
				return encrypted.toString();
			},
			/**
			 * 解密
			 * @param word
			 * @param skey
			 */
			decrypt: function (word, skey) {
				var key = CryptoJS.enc.Utf8.parse(skey);
				var decrypt = CryptoJS.AES.decrypt(word, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.ZeroPadding
				});
				return CryptoJS.enc.Utf8.stringify(decrypt).toString();
			},
			/**
			 * 获取key
			 * @param token
			 * @returns {string}
			 */
			getKey: function (token) {
				var key = sha256(token + this.sha256Salt);
				var index = Number(this.linkid.match(/[0-9]/g).pop());
				key = key.substring(index, index + 16);
				return key;
			},
			/**
			 * 加密Data
			 * @param data
			 * @param key
			 * @returns {*}
			 */
			getEncryptData: function (data, key) {
				return this.encrypt(JSON.stringify(data || {}), key)
			},
			/**
			 * 获取Summary
			 * @param dataStr
			 * @param key
			 * @returns {*}
			 */
			getSummary: function (data, key) {
				var encryptData;
				if (typeof data !== 'string') { //未加密
					encryptData = this.getEncryptData(data, key);
				} else { //已经加密
					encryptData = data;
				}
				var md5Data = MD5.hex_md5(encryptData);
				var summary = MD5.hex_md5(md5Data + key + this.summarySalt);
				return summary
			},
			/**
			 * 解密Data
			 * @param data
			 * @param key
			 * @param summary
			 * @returns {*}
			 */
			getDecryptData: function (res, key) {
				if (res.summary === this.getSummary(res.data, key)) {
					return JSON.parse(this.decrypt(res.data, key));
				} else {
					return res;
				}
			},
			getBase64Data: function (data) {
				if (typeof data == 'object') {
					data = JSON.stringify(data);
				}
				return base64.encode(data);
			}
		};

		return dataParse;

	});