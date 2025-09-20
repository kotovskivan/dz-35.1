import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProd = process.env.NODE_ENV === "production"

export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    assetModuleFilename: "assets/[name].[contenthash:8][ext]",
    clean: true,
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
        parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
        generator: { filename: "images/[name].[contenthash:8][ext]" }
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: "asset/resource",
        generator: { filename: "fonts/[name].[contenthash:8][ext]" }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      scriptLoading: "defer"
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css"
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminGenerate,
        options: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["mozjpeg", { quality: 78, progressive: true }],
            ["pngquant", { quality: [0.6, 0.8] }],
            ["svgo", { multipass: true }]
          ]
        }
      }
    })
  ],
  resolve: { extensions: [".js"] },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
      }
    },
    minimize: isProd,
    minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()]
  },
  externals: { lodash: "_" },
  devServer: {
    static: { directory: path.resolve(__dirname, "dist") },
    client: { overlay: true },
    port: 8080,
    open: false,
    hot: true,
    historyApiFallback: true
  },
  mode: isProd ? "production" : "development",
  devtool: isProd ? "source-map" : "eval-cheap-module-source-map"
}
