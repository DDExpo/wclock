package main

import (
	"context"
	"fmt"
	"runtime"
	gofunc "wClock/go_func"

	runtime_2 "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetWindowsPcColors() string {
	var color string = ""
	var err error
	if runtime.GOOS == "windows" {
		color, err = gofunc.GetWindowsPcColors()
	}
	if err != nil {
		fmt.Println(err)
	}
	return color
}

func (a *App) CheckWindowSize() bool {
	width, _ := runtime_2.WindowGetSize(a.ctx)
	return width > 681
}
