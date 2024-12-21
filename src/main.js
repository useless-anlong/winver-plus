import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-shell';

const appWindow = getCurrentWindow();
appWindow.hide();

document
    .getElementById('done-button')
    ?.addEventListener('click', () => appWindow.close());

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.querySelector('main');
    appWindow.show();

    // 初始状态：显示加载器，隐藏主内容
    loader.style.display = 'flex';
    mainContent.style.display = 'none';

    invoke('get_windows_info')
        .then(([windowsCaption, buildVersion, displayVersion, registeredOrg, registeredOwner]) => {
            const cleanWindowsName = windowsCaption.replace('Microsoft ', '');
            const editionName = cleanWindowsName.replace('Windows 11 ', '');

            const elements = {
                'windows-version': cleanWindowsName.replace(editionName, '').trim(),
                'windows-edition': editionName,
                'system-version': displayVersion,
                'bulid-version': buildVersion,
                'registered-org': registeredOrg,
                'registered-owner': registeredOwner
            };

            for (const [id, value] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            }

            // 数据加载完成后：隐藏加载器，显示主内容
            loader.style.display = 'none';
            mainContent.style.display = 'flex';

            console.log('Windows Info:', elements);
        })
        .catch(error => {
            console.error('获取系统信息失败:', error);
            const errorElement = document.getElementById('error-message');
            if (errorElement) {
                errorElement.textContent = `错误: ${error}`;
            }
            loader.style.display = 'none';
            mainContent.style.display = 'flex';
            appWindow.show();
        });
});

const openGithubUrlButton = document.getElementById('gotoGithub');
openGithubUrlButton.addEventListener('click', async function () {
    console.log('已执行打开url');
    await open('https://github.com/useless-anlong/winver-plus');
});