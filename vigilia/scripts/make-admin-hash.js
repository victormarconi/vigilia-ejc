const bcrypt = require("bcryptjs");
const readline = require("readline");

const directPassword = process.argv[2] || process.env.ADMIN_PASSWORD;

if (directPassword) {
  bcrypt.hash(directPassword, 12).then((hash) => {
    console.log(hash);
  });
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Senha do admin: ", async (password) => {
    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
    rl.close();
  });
}
