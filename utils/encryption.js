const crypto = require('crypto');
const SECRET_KEY = 'hufsdfhbsdf5gfdklnmnpizs';
const KEY = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);

// 加密函数
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), Buffer.from(KEY.slice(0, 16)));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return 'sk-' + encrypted;
}

// 解密函数
function decrypt(encryptedText) {
  encryptedText = encryptedText.slice(3); // 去掉 "sk-"
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY), Buffer.from(KEY.slice(0, 16)));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
    encrypt,decrypt
}


