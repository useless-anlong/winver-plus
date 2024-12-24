#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::os::windows::process::CommandExt;
use std::process::Command;
use tauri::Manager;
use window_vibrancy::*;

// Windows-specific constant for CREATE_NO_WINDOW
const CREATE_NO_WINDOW: u32 = 0x08000000;

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
        .invoke_handler(tauri::generate_handler![get_windows_info, open_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn open_system_info() -> Result<(), String> {
    Command::new("cmd")
        .creation_flags(CREATE_NO_WINDOW)
        .args(["/C", "start ms-settings:about"])
        .output()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_windows_info() -> Result<
    (
        String,
        String,
        String,
        String,
        String,
        String,
        String,
        String,
    ),
    String,
> {
    let ps_command = r#"$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8;
    $os = Get-CimInstance Win32_OperatingSystem;
    $cs = Get-CimInstance Win32_ComputerSystem;
    $nt = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion';
    $ui = Get-WinSystemLocale;
    
    $result = @{
        Caption = $os.Caption
        DisplayVersion = $nt.DisplayVersion
        BuildVersion = $nt.LCUVer
        RegisteredOrg = $nt.RegisteredOrganization
        RegisteredOwner = $nt.RegisteredOwner
        OsLocale = $ui.DisplayName
        PCSystemType = switch ($cs.PCSystemType) {
            0 {"未指定"}
            1 {"桌面设备"}
            2 {"便携式设备"}
            3 {"工作站"}
            4 {"企业服务器"}
            5 {"SOHO服务器"}
            6 {"设备控制器"}
            7 {"单功能系统"}
            8 {"笔记本电脑"}
            default {"未知"}
        }
        SystemType = $cs.SystemType
    };
    
    $result | ConvertTo-Json"#;

    let output = Command::new("powershell")
        .creation_flags(CREATE_NO_WINDOW)
        .args([
            "-NonInteractive",
            "-WindowStyle",
            "Hidden",
            "-NoProfile",
            "-Command",
            ps_command,
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let output_str =
        String::from_utf8(output.stdout).map_err(|e| format!("Encountered when outputting the encoding {}", e))?;

    let result: serde_json::Value =
        serde_json::from_str(&output_str).map_err(|e| format!("Encountered when parsing JSON {}", e))?;
    Ok((
        result["Caption"].as_str().unwrap_or("").to_string(),
        result["BuildVersion"]
            .as_str()
            .unwrap_or("")
            .replace("10.0.", ""),
        result["DisplayVersion"].as_str().unwrap_or("").to_string(),
        result["RegisteredOrg"].as_str().unwrap_or("").to_string(),
        result["RegisteredOwner"].as_str().unwrap_or("").to_string(),
        result["OsLocale"].as_str().unwrap_or("").to_string(),
        result["PCSystemType"].as_str().unwrap_or("").to_string(),
        result["SystemType"].as_str().unwrap_or("").to_string(),
    ))
}

#[allow(dead_code)]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}
