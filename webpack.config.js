const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Add fallback for crypto module
    config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks (if any)
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve("stream-browserify")
    };

    // Add loader for HTML files
    config.module.rules.push({
        test: /\.html$/,
        use: 'html-loader'
    });

    // Add devtool configuration
    config.devtool = 'inline-source-map';

    return config;
};