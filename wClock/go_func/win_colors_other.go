//go:build !windows
// +build !windows

package gofunc

func GetWindowsPcColors() (string, error) {
	// Return empty string and no error on non-Windows platforms
	return "", nil
}
