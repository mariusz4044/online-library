const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(epub)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
  },
};

// module.exports = {
//   devServer: {
//     port: 8080, // CHANGE YOUR PORT HERE!
//     https: true,
//   },
// }
