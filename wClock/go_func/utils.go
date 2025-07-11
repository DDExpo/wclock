package gofunc

import (
	"fmt"

	"golang.org/x/sys/windows/registry"
)

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
