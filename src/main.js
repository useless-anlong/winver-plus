import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-shell';

const appWindow = getCurrentWindow();
// appWindow.hide();

document
    .getElementById('done-button')
    ?.addEventListener('click', () => appWindow.close());

document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
}, false)

document.addEventListener('DOMContentLoaded', () => {
    const errorInfo = document.getElementById('error-info');
    const loader = document.getElementById('loader');
    const mainContent = document.querySelector('main');
    const w11logo = document.getElementById('w11_logo');
    const logofill0 = document.getElementById('linear_fill_0_9-0');
    const logofill1 = document.getElementById('linear_fill_0_9-1');
    // appWindow.show();

    // 初始状态：显示加载器，隐藏主内容
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    mainContent.style.opacity = '0';
    mainContent.style.display = 'flex';
    errorInfo.style.opacity = '0';
    // setTimeout(() => {
    //     mainContent.style.display = 'none';
    // }, 250);
    mainContent.style.opacity = '0';
    mainContent.style.display = 'flex';
    errorInfo.style.opacity = '0';
    // setTimeout(() => {
    //     mainContent.style.display = 'none';
    // }, 250);

    invoke('get_windows_info')
        .then(([windowsCaption, buildVersion, displayVersion, registeredOrg, registeredOwner, osLocale, pcSystemType, systemType]) => {
            const cleanWindowsName = windowsCaption.replace('Microsoft ', '');
            const editionName = cleanWindowsName.replace('Windows 11 ', '');

            const elements = {
                'windows-version': cleanWindowsName.replace(editionName, '').trim() || '读取错误',
                'windows-edition': editionName || 'N/A',
                'system-version': displayVersion || 'N/A',
                'bulid-version': buildVersion || 'N/A',
                'registered-org': registeredOrg || 'N/A',
                'registered-owner': registeredOwner || 'N/A',
                'system-locale': osLocale || 'N/A',
                'device-type': pcSystemType || 'N/A',
                'system-type': systemType || 'N/A'
            };

            const errorDescriptions = {
                'windows-version': '未成功读取指令 <code>Get-CimInstance Win32_OperatingSystem</code> 中的 <code>Caption</code> 值',
                'windows-edition': '',
                'system-version': '未成功读取注册表键值 <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\DisplayVersion</code>',
                'bulid-version': '未成功读取注册表键值 <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\LCUVer</code>',
                'registered-org': '未成功读取注册表键值 <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\</code>',
                'registered-owner': '未成功读取注册表键值 <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\</code>',
                'system-locale': '未成功读取指令 <code>Get-WinSystemLocale</code> 中的 <code>DisplayName</code> 值',
                'device-type': '未成功读取指令 <code>Get-CimInstance Win32_ComputerSystem</code> 中的 <code>PCSystemType</code> 值',
                'system-type': '未成功读取指令 <code>Get-CimInstance Win32_ComputerSystem</code> 中的 <code>SystemType</code> 值'
            };

            const errorValues = [];

            for (const [id, value] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    if (value === 'N/A') {
                        errorValues.push(id);
                    } else {
                        element.textContent = value;
                    }
                }
            }

            if (errorValues.length > 0) {
                const infoButtonInfo = document.querySelector('#info-button-row');
                const errorButton = document.createElement('button');
                errorButton.id = 'error-button';
                errorButton.onclick = function () { FlyoutTips(this); };
                errorButton.innerHTML = `
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.91 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.243a2.25 2.25 0 0 1-2.041-3.197l.072-.143L10.031 3.66a2.25 2.25 0 0 1 .878-.878Zm9.505 15.613-7.76-14.008a.75.75 0 0 0-1.254-.088l-.057.088-7.757 14.008a.75.75 0 0 0 .561 1.108l.095.006h15.516a.75.75 0 0 0 .696-1.028l-.04-.086-7.76-14.008 7.76 14.008ZM12 16.002a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997ZM11.995 8.5a.75.75 0 0 1 .744.647l.007.102.004 4.502a.75.75 0 0 1-1.494.103l-.006-.102-.004-4.502a.75.75 0 0 1 .75-.75Z" fill="#212121"/>
                    </svg>`;
                infoButtonInfo.appendChild(errorButton);

                const errorFlyout = document.createElement('div');
                errorFlyout.id = 'error-flyout';
                errorFlyout.className = 'flyout-tips';
                errorFlyout.innerHTML = `
                    <div class="flyout-tips-content">
                        <svg onclick="closeErrorFlyoutTips()" id="close-flyout-button" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="30" height="30" rx="3" />
                            <path d="M20 20.708L15.8545 24.8535C15.7568 24.9512 15.6396 25 15.5029 25C15.3597 25 15.2393 24.9528 15.1416 24.8584C15.0472 24.7607 15 24.6403 15 24.4971C15 24.3604 15.0488 24.2432 15.1465 24.1455L19.292 20L15.1465 15.8545C15.0488 15.7568 15 15.638 15 15.498C15 15.4297 15.013 15.3646 15.0391 15.3027C15.0651 15.2409 15.1009 15.1888 15.1465 15.1465C15.1921 15.1009 15.2458 15.0651 15.3076 15.0391C15.3695 15.013 15.4346 15 15.5029 15C15.6396 15 15.7568 15.0488 15.8545 15.1465L20 19.292L24.1455 15.1465C24.2432 15.0488 24.362 15 24.502 15C24.5703 15 24.6338 15.013 24.6924 15.0391C24.7542 15.0651 24.8079 15.1009 24.8535 15.1465C24.8991 15.1921 24.9349 15.2458 24.9609 15.3076C24.987 15.3662 25 15.4297 25 15.498C25 15.638 24.9512 15.7568 24.8535 15.8545L20.708 20L24.8535 24.1455C24.9512 24.2432 25 24.3604 25 24.4971C25 24.5654 24.987 24.6305 24.9609 24.6924C24.9349 24.7542 24.8991 24.8079 24.8535 24.8535C24.8112 24.8991 24.7591 24.9349 24.6973 24.9609C24.6354 24.987 24.5703 25 24.502 25C24.362 25 24.2432 24.9512 24.1455 24.8535L20 20.708Z" fill="black" fill-opacity="0.8956"/>
                        </svg>
                        <h2>读取以下值时遇到错误</h2>
                        <div id="error-container"></div>
                    </div>
                    <svg class="flyout-tips-pointer-container" width="39" height="9" viewBox="0 0 39 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="flyout-tips-pointer" d="M19.4141 7L26.4141 0H12.4141L19.4141 7Z"/>
                        <path class="flyout-tips-pointer-border" d="M19.4142 8.41421L12 1H13.4142L19.4142 7L25.4142 1H26.8284L19.4142 8.41421Z"/>
                    </svg>`;
                document.body.appendChild(errorFlyout);

                const errorContainer = document.getElementById('error-container');
                if (errorContainer) {
                    errorValues.forEach(errorId => {
                        // 添加 errorButton 和 errorFlyout
                        const errorListElement = document.createElement('div');
                        errorListElement.className = 'error-list';
                        errorContainer.innerHTML = `
            <span>
                <h3>
                <svg width="19" height="19" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm3.446 4.897.084.073a.75.75 0 0 1 .073.976l-.073.084L13.061 12l2.47 2.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-2.47 2.47a.75.75 0 0 1-.976.072l-.084-.073a.75.75 0 0 1-.073-.976l.073-.084L10.939 12l-2.47-2.47a.75.75 0 0 1-.072-.976l.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l2.47-2.47a.75.75 0 0 1 .976-.072Z" class="error-icon"/>
                </svg>
                ${errorId}</h3>
                <p>${errorDescriptions[errorId]}</p>
            </span>`;
                        errorContainer.appendChild(errorListElement);
                    });
                }
            }

            mainContent.style.opacity = '1';
            loader.style.opacity = '0';
            errorInfo.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                w11logo.style.animation = 'logo-scale-in-all 0.55s cubic-bezier(0, 0.5, 0.5, 1) forwards';
                logofill0.style.animation = 'logo-fade-in-0 0.45s ease-in forwards';
                logofill1.style.animation = 'logo-fade-in-1 0.75s ease-in forwards';
            }, 150);
        })
        .catch(error => {
            console.error('An error occurred when obtaining system information from the Rust backend:', error);
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
