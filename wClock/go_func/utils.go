package gofunc

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"path/filepath"

	"golang.org/x/sys/windows/registry"
)

var userSettings UserSettings

func GetAppPath() (string, error) {

	var appPath string

	appPath, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}

	appBytes, err := os.ReadFile(filepath.Join(appPath, "build", "bin", "binn", "env"))
	if err != nil {
		fmt.Println(err)
	}
	err = json.Unmarshal(appBytes, &appPath)
	if err != nil {
		fmt.Println(err)
	} else {
		return appPath, err
	}

	appPath, err = os.Executable()
	if err != nil {
		fmt.Println(err)
	}

	appPath, err = filepath.EvalSymlinks(appPath)
	if err != nil {
		fmt.Println(err)
	}

	appPath = filepath.Dir(appPath)
	appPathJson, err := json.Marshal(appPath)
	if err != nil {
		fmt.Println(err)
	}
	err = os.WriteFile(filepath.Join(appPath, "/binn/env"), appPathJson, os.ModePerm)
	if err != nil {
		fmt.Println(err)
	}
	return appPath, err
}

func ReadSettings(binPath string) (UserSettings, error) {

	settingsPath := path.Join(binPath, "settings.json")
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
