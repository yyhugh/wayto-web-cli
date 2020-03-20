#!/usr/bin/env node
/**
 * @const fs
 * @const program 获取命令行传参
 * @const download 前往git仓库，下载模板和配置文件
 * @const inquirer 命令行交互的时候你需要填 project name 等一系列信息
 * @const handlebars 渲染仓库中的`package.json`模板
 * @const ora 下载过程中的动画效果
 * @const chalk 终端字体添加颜色
 * @const symbols 终端上显示 √ 或 × 图标
 */
const fs = require("fs");
const program = require("commander");
const download = require("download-git-repo");
const inquirer = require("inquirer");
const handlebars = require("handlebars");
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");

const version = "0.0.1";
const gitUrl = "github:yyhugh/wayto-web";

program
    .version(version, "-v, --version")
    .command("init <name>")
    .action(name =>
    {
        inquirer
            .prompt([
                {
                    name: "description",
                    message: "Input description:"
                },
                {
                    name: "author",
                    message: "Input author:"
                }
            ])
            .then(answers =>
            {
                const spinner = ora("download..."); // 下载动画实例
                spinner.start(); // 开始动画
                // 把目标项目下载到当前目录下的下 "./"
                download(gitUrl, "./", false, err =>
                {
                    if (err)
                    {
                        // console.log("download err..");
                        spinner.fail(); // 失败动画效果
                        console.log(symbols.error, chalk.red(err)); // × 错误信息样式为红色
                    }
                    else
                    {
                        // console.log("download success..");
                        spinner.succeed(); // 成功动画效果
                        const fileName = "./package.json"; // 模板文件路径
                        // 用于模板引擎渲染的数据
                        const meta =
                        {
                            name,
                            description: answers.description,
                            author: answers.author
                        };
                        // fs.existsSync 以同步的方法检测目录是否存在 返回boolean
                        if (fs.existsSync(fileName))
                        {
                            // fs.readFileSync 以同步的方法读取文件
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta); // 将数据渲染到模板上
                            fs.writeFileSync(fileName, result); // 以同步的方法创建文件
                            console.log(symbols.success, chalk.green("Init successfully."));
                            console.log("How do use?\n", chalk.blue("npm i \n npm run dev"));
                        }
                    }
                })
            });
    });

program.parse(process.argv);
