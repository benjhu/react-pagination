const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["env", "react"]
                        }
                    }
                ]
            }
        ]
    }
};