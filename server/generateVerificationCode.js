function generateVerificationCode() {
    var verificationCode = "";
    for (var i = 0; i < 6; i++) {
        verificationCode += Math.floor(Math.random() * 10);
    }
    return verificationCode;
}
module.exports = generateVerificationCode;


