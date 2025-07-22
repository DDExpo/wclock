package gofunc

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/gen2brain/beeep"
	"golang.org/x/sys/windows/registry"
)

var userSettings UserSettings

func InitEnv() error {

	var appPath string

	appPath, err := os.Executable()
	if err != nil {
		fmt.Println(err)
	}
	appPath, err = filepath.EvalSymlinks(appPath)
	if err != nil {
		fmt.Println(err)
	}
	appPath = filepath.Dir(appPath)
	appBinn := filepath.Join(appPath, "binn")
	dbPath := filepath.Join(appBinn, "sqlite3.db")
	settingsPath := filepath.Join(appBinn, "settings.json")
	iconPath := filepath.Join(appBinn, "appIcon.png")

	content := fmt.Sprintf(
		"APP_PATH=%s\nAPP_BINN=%s\nAPP_DB=%s\nAPP_SETTINGS=%s\nAPP_ICON=%s", appPath, appBinn, dbPath, settingsPath, iconPath)

	err = os.WriteFile(filepath.Join(appPath, ".env"), []byte(content), os.ModePerm)
	if err != nil {
		fmt.Println(err)
	}

	return err
}

func ReadSettings(settingsPath string) (UserSettings, error) {

	file, err := os.Open(settingsPath)
	if err != nil {
		return userSettings, nil
	}
	defer file.Close()

	fileBytes, err := os.ReadFile(settingsPath)
	if err != nil {
		return userSettings, fmt.Errorf("fuck me: %v", err)
	}

	err = json.Unmarshal(fileBytes, &userSettings)
	if err != nil {
		return userSettings, fmt.Errorf("fuck me: %v", err)
	}
	return userSettings, nil
}

func GetWindowsPcColors() (string, error) {

	key, err := registry.OpenKey(registry.CURRENT_USER, `Software\Microsoft\Windows\DWM`, registry.QUERY_VALUE)

	if err != nil {
		return "", fmt.Errorf("error opening registry: %v", err)
	}
	defer key.Close()

	val, _, err := key.GetIntegerValue("ColorizationColor")
	if err != nil {
		return "", fmt.Errorf("error reading value: %v", err)
	}

	r := (val >> 16) & 0xFF
	g := (val >> 8) & 0xFF
	b := val & 0xFF

	hexColor := fmt.Sprintf("#%02X%02X%02X", r, g, b)
	return hexColor, nil
}

func Notify(title, body string) error {
	beeep.AppName = "WClock"
	return beeep.Notify(title, body, os.Getenv("APP_ICON"))
}
