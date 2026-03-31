module.exports = {
  apps: [
    {
      name: "sitecreator",
      cwd: __dirname,
      script: "npm",
      args: "start -- --hostname 127.0.0.1 --port 3001",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
