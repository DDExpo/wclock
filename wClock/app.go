package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	db "wClock/db"
	gofunc "wClock/go_func"

	runtime_2 "github.com/wailsapp/wails/v2/pkg/runtime"
)

var userSettings gofunc.UserSettings

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

	appPath, err := gofunc.GetAppPath()

	if err != nil {
		fmt.Println(err)
	}

	binPath := filepath.Join(appPath, "binn")
	_, err = os.Stat(binPath)
	if err != nil {
		fmt.Println(err)
		err = os.MkdirAll(binPath, os.ModePerm)
		if err != nil {
			fmt.Println(err)
		}
	}
	dbPath := filepath.Join(binPath, "sqlite3.db")
	_, err = os.Stat(dbPath)
	DB := db.GetDB(dbPath)

	var exists int
	errTable := DB.Get(&exists, `SELECT 1 FROM sqlite_master WHERE type='table' AND name='cards'`)

	if os.IsNotExist(err) || errTable != nil {
		err = db.RunFirstTimeShemas(DB)
		if err != nil {
			fmt.Println(err)
		}
	}
	defer DB.Close()

	userSettings, err = gofunc.ReadSettings(binPath)
	if err != nil {
		fmt.Println(err)
	}
}

func (a *App) GetCards() []gofunc.Card {
	appPath, _ := gofunc.GetAppPath()
	DB := db.GetDB(filepath.Join(appPath, "binn", "sqlite3.db"))
	defer DB.Close()
	cards, err := db.GetAllCards(DB)
	if err != nil {
		fmt.Println(err)
	}
	return cards
}

func (a *App) DeleteCard(id string) {
	appPath, _ := gofunc.GetAppPath()
	DB := db.GetDB(filepath.Join(appPath, "binn", "sqlite3.db"))
	defer DB.Close()
	err := db.DeleteCards(DB, id)
	if err != nil {
		fmt.Println(err)
	}
}

func (a *App) SaveCard(cards []gofunc.Card) {
	appPath, _ := gofunc.GetAppPath()
	DB := db.GetDB(filepath.Join(appPath, "binn", "sqlite3.db"))
	defer DB.Close()
	err := db.SaveCards(DB, cards)
	if err != nil {
		fmt.Println(err)
	}
}

func (a *App) GetSettings() bool {
	return userSettings.AppTheme
}

func (a *App) Shutdown(ctx context.Context) {

	u, err := json.Marshal(userSettings)
	if err != nil {
		fmt.Println(err)
	}

	appPath, err := gofunc.GetAppPath()
	if err != nil {
		fmt.Println(err)
	}

	err = os.WriteFile(filepath.Join(appPath, "binn", "settings.json"), u, os.ModePerm)
	if err != nil {
		fmt.Println(err)
	}
}

func (a *App) GiveNewSettings(theme bool) {
	userSettings.AppTheme = theme
}

func (a *App) GetWindowsPcColors() string {
	var err error
	color := ""

	if runtime.GOOS == "windows" {
		color, err = gofunc.GetWindowsPcColors()
		if err != nil {
			fmt.Println(err)
		}
	}
	return color
}

func (a *App) SetWindowAlwaysOnTop(onTop bool) {
	runtime_2.WindowSetAlwaysOnTop(a.ctx, onTop)
}

func (a *App) MakeMiniWindowSize(width int, height int, compact bool) {
	runtime_2.WindowSetMinSize(a.ctx, width, height)
	runtime_2.WindowSetSize(a.ctx, width, height)
	if compact {
		runtime_2.WindowSetMaxSize(a.ctx, width, height)
	} else {
		runtime_2.WindowSetMaxSize(a.ctx, 0, 0)
	}
}

func (a *App) CloseWindow() {
	a.Shutdown(a.ctx)
	runtime_2.Quit(a.ctx)
}

func (a *App) CheckWindowSize() bool {
	width, _ := runtime_2.WindowGetSize(a.ctx)
	return width > 681
}
