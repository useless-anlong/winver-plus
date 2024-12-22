<picture align="center">
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/8ad9a4c9-a8b3-41ca-91cc-6678e1a4f3ca">
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/b3963dd3-1502-4dab-8f44-f06e590255f0">
 <img src="https://github.com/user-attachments/assets/b3963dd3-1502-4dab-8f44-f06e590255f0">
</picture>
<h3 align="center">WINVER-PLUS</h3>
<h1 align="center">一个支持 Mica 且拥有仿 WinUI 3 精美界面的<br>第三方 Winver 实用程序</h1>

<p align="center">基于 Tauri 2.0 & Vite 6.0.5 构建<br>
Copyright © 2024 AlanYan, Open source with Apache License at Here.</p>

### 构建
> [!TIP]
> 除了执行`cargo build`命令，在执行其他命令时务必注意你的终端当前运行目录是否为项目根目录。

<details open>
<summary><h4>安装所需依赖</h4></summary>
 
1. 安装所需的 NPM 包
``` shell
yarn install
```
2. 安装所需的 Cargo 依赖
``` shell
cd src-tauri | cargo build
```

</details>
<details open>
<summary><h4>进行调试或构建</h4></summary>

+ 调试
``` shell
yarn tauri dev
```
+ 构建
``` shell
yarn tauri build
```
默认情况下，构建将被生成至`./src-tauri/target/release`中

</details>

### 进度
已全面实现 Winver 功能，正在完善细节。  
- [X] Windows版本 读取  
- [X] 系统版本 读取  
- [X] 版本号 读取  
- [X] OS 内部版本 读取  
- [X] 注册用户名 读取  
- [X] 注册组织 读取  
- [ ] 仿 Win UI 3 界面完全体
- [ ] 解决 Powershell 窗口闪一下的问题
- [ ] 优化最终构建大小
#### 免责声明
> [!IMPORTANT]
> 这不是一个 Microsoft 官方应用程序，任何内容均不代表 Microsoft。

> 本程序仅用于学习交流。  
> 有关您的操作系统的信息均为通过读取注册表得来，均在本地处理，不会上传至云端。  
> 数据可能出现不准确的情况。  
