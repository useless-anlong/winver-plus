// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::Manager;
use window_vibrancy::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "windows")]
            apply_mica(&window, None)
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_windows_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_windows_info() -> Result<(String, String, String, String, String), String> {
    // 修改为5个元素的元组
    let get_caption = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; (Get-CimInstance Win32_OperatingSystem).Caption"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let get_display_version = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; (Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').DisplayVersion"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let get_build = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; (Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').LCUVer"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let get_registered_org = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; (Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').RegisteredOrganization"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let get_registered_owner = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; (Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').RegisteredOwner"
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let caption = String::from_utf8(get_caption.stdout)
        .map_err(|e| format!("Caption编码错误: {}", e))?
        .trim()
        .to_string();
    let display_version = String::from_utf8(get_display_version.stdout)
        .map_err(|e| format!("DisplayVersion编码错误: {}", e))?
        .trim()
        .to_string();
    let build_version = String::from_utf8(get_build.stdout)
        .map_err(|e| format!("BuildVersion编码错误: {}", e))?
        .trim()
        .replace("10.0.", "");
    let registered_org = String::from_utf8(get_registered_org.stdout)
        .map_err(|e| format!("RegisteredOrg编码错误: {}", e))?
        .trim()
        .to_string();
    let registered_owner = String::from_utf8(get_registered_owner.stdout)
        .map_err(|e| format!("RegisteredOwner编码错误: {}", e))?
        .trim()
        .to_string();

    Ok((
        caption,
        build_version,
        display_version,
        registered_org,
        registered_owner,
    ))
}

#[allow(dead_code)]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}
