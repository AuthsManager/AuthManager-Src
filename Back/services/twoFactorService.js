const { authenticator } = require('authenticator');
const crypto = require('crypto');

class TwoFactorService {
    generateSecret() {
        return authenticator.generateSecret();
    }

    generateQRCodeURL(secret, username, issuer = 'AuthManager') {
        return authenticator.generateTotpUri(secret, username, issuer, 'SHA1', 6, 30);
    }

    verifyToken(token, secret, window = 1) {
        return authenticator.verifyToken(secret, token, window);
    }

    generateBackupCodes(count = 10) {
        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase();
            codes.push(code);
        }
        return codes;
    }

    verifyBackupCode(code, backupCodes) {
        return backupCodes.includes(code.toUpperCase());
    }

    removeUsedBackupCode(code, backupCodes) {
        return backupCodes.filter(c => c !== code.toUpperCase());
    }
}

module.exports = new TwoFactorService();