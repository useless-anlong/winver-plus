### WINVER-PLUS
# 一个支持 Mica 且拥有仿 WinUI 3 精美界面的三方 Winver 实用程序

<picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/b1946028-8dff-4428-954a-27e25265ece2">
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/24c6e8e9-3b07-48a1-8d3f-c941f7f22286">
</picture>

基于 Tauri 2.0 & Vite 6.0.5 构建  
Copyright © 2024 AlanYan, Open source with Apache License at Here.  
### 构建
#### 安装所需库
1. 安装所需的 NPM 包
``` shell
yarn install
```

2. 安装所需的 Cargo 依赖
``` shell
cd src-tauri | cargo build
```

3. 启动调试
``` shell
cd ../ | yarn tauri dev
```
### 进度
已全面实现 Winver 功能，正在完善细节。  
- [X] Windows版本 读取  
- [X] 系统版本 读取  
- [X] 版本号 读取  
- [X] OS 内部版本 读取  
- [X] 注册用户名 读取  
- [X] 注册组织 读取  
- [ ] 仿 Win UI 3 界面完全体
#### 免责声明
> [!IMPORTANT]
> 这不是一个 Microsoft 官方应用程序，任何内容均不代表 Microsoft。

> 本程序仅用于学习交流。  
> 有关您的操作系统的信息均为通过读取注册表得来，均在本地处理，不会上传至云端。  
> 数据可能出现不准确的情况。  
