package gofunc

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/gen2brain/beeep"
	"golang.org/x/sys/windows/registry"
)

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
func LoadOrInitSettings(filepath string) (AppSettings, error) {
	var settings AppSettings

	if _, err := os.Stat(filepath); os.IsNotExist(err) {
		settings = AppSettings{Theme: false}
		settings.Focus.Goal.DailyProgress = [2]int{0, 0}
		settings.Focus.Goal.Streak = 0
		settings.Focus.Goal.Yesterday = 0
		settings.Focus.Goal.Completed = 0
		settings.Focus.Goal.DailyGoal = 8
		settings.Focus.Goal.ClearHours = 12
		settings.Focus.Goal.ClearMinutes = 30
		settings.Focus.Goal.IncludeWeekdays = false

		settings.Focus.FocusCard.Hours = 8
		settings.Focus.FocusCard.Minutes = 60
		settings.Focus.FocusCard.Breaks = 4
		settings.Focus.FocusCard.BreaksTime = 5
		settings.Focus.FocusCard.SkipBreaks = false

		data, err := json.MarshalIndent(settings, "", "  ")
		if err != nil {
			return settings, err
		}
		err = os.WriteFile(os.Getenv("APP_SETTINGS"), data, 0644)
		if err != nil {
			return settings, err
		}
		return settings, nil
	}

	data, err := os.ReadFile(filepath)
	if err != nil {
		return settings, err
	}

	err = json.Unmarshal(data, &settings)
	return settings, err
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
