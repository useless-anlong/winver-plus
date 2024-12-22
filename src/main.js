import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-shell';

const appWindow = getCurrentWindow();
appWindow.hide();

document
    .getElementById('done-button')
    ?.addEventListener('click', () => appWindow.close());

document.addEventListener('DOMContentLoaded', () => {
    const errorInfo = document.getElementById('error-info');
    const loader = document.getElementById('loader');
    const mainContent = document.querySelector('main');
    appWindow.show();

    // 初始状态：显示加载器，隐藏主内容
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    mainContent.style.opacity = '0';
    errorInfo.style.opacity = '0';
    setTimeout(() => {
        mainContent.style.display = 'none';
    }, 250);

    invoke('get_windows_info')
        .then(([windowsCaption, buildVersion, displayVersion, registeredOrg, registeredOwner, osLocale, pcSystemType, systemType]) => {
            const cleanWindowsName = windowsCaption.replace('Microsoft ', '');
            const editionName = cleanWindowsName.replace('Windows 11 ', '');

            const elements = {
                'windows-version': cleanWindowsName.replace(editionName, '').trim(),
                'windows-edition': editionName,
                'system-version': displayVersion,
                'bulid-version': buildVersion,
                'registered-org': registeredOrg,
                'registered-owner': registeredOwner,
                'system-locale': osLocale,
                'device-type': pcSystemType,
                'system-type': systemType
            };

            for (const [id, value] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            }

            mainContent.style.display = 'flex';
            mainContent.style.opacity = '1';
            loader.style.opacity = '0';
            errorInfo.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 250);

            console.log('Windows Info:', elements);
        })
        .catch(error => {
            console.error('获取系统信息失败:', error);
            const errorElement = document.getElementById('error-message');
            if (errorElement) {
                errorElement.innerHTML = `error: ${error}`;
            }
            loader.style.display = 'none';
            mainContent.style.display = 'flex';
            errorInfo.style.opacity = '1';
            errorInfo.style.pointerEvents = 'all';
        });
});

const openGithubUrlButton = document.getElementById('gotoGithub');
openGithubUrlButton.addEventListener('click', async function () {
    console.log('已执行打开url');
    await open('https://github.com/useless-anlong/winver-plus');
});

const openSettingsButton = document.getElementById('gotoSettings');
openSettingsButton.addEventListener('click', async function () {
    await invoke('open_system_info');
});
