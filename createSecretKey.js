const crypto = require("crypto");

// Tạo một chuỗi ngẫu nhiên 64 bytes và chuyển thành hex (sẽ dài 128 ký tự hex)
const secretKey = crypto.randomBytes(64).toString("hex");
console.log(secretKey);

// Hoặc một chuỗi ngẫu nhiên 32 bytes (sẽ dài 64 ký tự hex)
// const secretKey32 = crypto.randomBytes(32).toString('hex');
// console.log(secretKey32);
