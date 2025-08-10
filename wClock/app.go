package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"
	db "wClock/db"
	gofunc "wClock/go_func"

	"github.com/joho/godotenv"
	runtime_wails "github.com/wailsapp/wails/v2/pkg/runtime"
)

var Settings gofunc.AppSettings

// App struct
type App struct {
	ctx     context.Context
	logFile *os.File
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	logPath := filepath.Dir(exePath)

	filePath := filepath.Join(logPath, "Logs.log")
	f, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		panic(fmt.Sprintf("failed to open log file: %v", err))
	}
	a.logFile = f

	a.LogBackend("info", "App started", "backend")

	envPath := filepath.Join(filepath.Dir(exePath), ".env")
	if err := godotenv.Load(envPath); err != nil {
		a.LogBackend("warn", ".env not found, initializing default env: "+err.Error(), "backend")
		if err = gofunc.InitEnv(); err != nil {
			a.LogBackend("error", "Failed to initialize env: "+err.Error(), "backend")
		}
		if err = godotenv.Load(envPath); err != nil {
			a.LogBackend("error", "Failed to load .env: "+err.Error(), "backend")
		}
	}

	binPath := os.Getenv("APP_BINN")
	if _, err = os.Stat(binPath); err != nil {
		a.LogBackend("debug", "Bin path missing, creating: "+binPath, "backend")
		if err = os.MkdirAll(binPath, os.ModePerm); err != nil {
			a.LogBackend("error", "Failed to create bin path: "+err.Error(), "backend")
		}
	}

	dbPath := os.Getenv("APP_DB")
	DB := db.GetDB(dbPath)

	var exists int
	errTable := DB.Get(&exists, `SELECT 1 FROM sqlite_master WHERE type='table' AND name='cards'`)
	if os.IsNotExist(err) || errTable != nil {
		a.LogBackend("warn", "Database tables missing, running initial schema", "backend")
		if err = db.RunFirstTimeShemas(DB); err != nil {
			a.LogBackend("error", "Failed to run initial schema: "+err.Error(), "backend")
		}
	}
	defer DB.Close()

	var settingsErr error
	Settings, settingsErr = gofunc.LoadOrInitSettings(os.Getenv("APP_SETTINGS"))
	if settingsErr != nil {
		a.LogBackend("error", "Failed to load/init settings: "+settingsErr.Error(), "backend")
	}
}

func (a *App) LogBackend(level string, message string, side string) {
	_, file, line, _ := runtime.Caller(1)
	shortFile := filepath.Base(file)
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	formatted := fmt.Sprintf("[%s] [%s/%s] %s:%s| %s\n", timestamp, side, fmt.Sprintf("%-5s", level), shortFile, fmt.Sprintf("%-4d", line), message)

	if a.logFile != nil {
		a.logFile.WriteString(formatted)
	}
}

func (a *App) DBGet(table string) gofunc.ItemsDB {
	a.LogBackend("debug", "Fetching from DB table: "+table, "backend")
	var err error
	items := gofunc.ItemsDB{}

	DB := db.GetDB(os.Getenv("APP_DB"))
	defer DB.Close()

	switch table {
	case "cards":
		items.Cards, err = db.GetAllCards(DB)
	case "tasks":
		items.Tasks, err = db.GetAllTasks(DB)
	case "alarms":
		items.Alarms, err = db.GetAllAlarms(DB)
	}
	if err != nil {
		a.LogBackend("error", "DBGet error: "+err.Error(), "backend")
	}
	return items
}

func (a *App) DBSave(table string, items gofunc.ItemsDB) {
	a.LogBackend("debug", "Saving to DB table: "+table, "backend")
	var err error

	DB := db.GetDB(os.Getenv("APP_DB"))
	defer DB.Close()

	switch table {
	case "cards":
		err = db.SaveCards(DB, items.Cards)
	case "tasks":
		err = db.SaveTasks(DB, items.Tasks)
	case "alarms":
		err = db.SaveAlarms(DB, items.Alarms)
	case "items":
		err = db.SaveCards(DB, items.Cards)
		if err != nil {
			a.LogBackend("error", "Failed to save cards: "+err.Error(), "backend")
		}
		err = db.SaveTasks(DB, items.Tasks)
		if err != nil {
			a.LogBackend("error", "Failed to save tasks: "+err.Error(), "backend")
		}
		err = db.SaveAlarms(DB, items.Alarms)
	}

	if err != nil {
		a.LogBackend("error", "DBSave error: "+err.Error(), "backend")
	}
}

func (a *App) DbDelete(ids []string, table string) {
	a.LogBackend("debug", "Deleting from DB table: "+table, "backend")
	DB := db.GetDB(os.Getenv("APP_DB"))
	defer DB.Close()
	if err := db.DbDelete(DB, ids, table); err != nil {
		a.LogBackend("error", "DbDelete error: "+err.Error(), "backend")
	}
}

func (a *App) GiveNewSettings(newSettings map[string]any) {
	a.LogBackend("debug", "Updating settings", "backend")
	key := ""
	for k := range newSettings {
		key = k
		break
	}
	switch key {
	case "Theme":
		Settings.Theme = newSettings[key].(bool)
	case "Grid":
		data, _ := json.Marshal(newSettings[key])
		if err := json.Unmarshal(data, &Settings.Focus.GridSeize); err != nil {
			a.LogBackend("error", "Failed to unmarshal GridSeize: "+err.Error(), "backend")
		}
	case "Focus":
		data, _ := json.Marshal(newSettings[key])
		if err := json.Unmarshal(data, &Settings.Focus.FocusCard); err != nil {
			a.LogBackend("error", "Failed to unmarshal FocusCard: "+err.Error(), "backend")
		}
	case "goal":
		data, _ := json.Marshal(newSettings[key])
		if err := json.Unmarshal(data, &Settings.Focus.Goal); err != nil {
			a.LogBackend("error", "Failed to unmarshal Goal: "+err.Error(), "backend")
		}
	default:
		a.LogBackend("warn", "Unknown settings key received", "backend")
	}
}

func (a *App) SaveSettings(appSettings gofunc.AppSettings) {
	a.LogBackend("debug", "Saving settings to file", "backend")
	file, err := os.Create(os.Getenv("APP_SETTINGS"))
	if err != nil {
		a.LogBackend("error", "Failed to create settings file: "+err.Error(), "backend")
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(appSettings); err != nil {
		a.LogBackend("error", "Failed to encode settings: "+err.Error(), "backend")
	}

	Settings = appSettings
}

func (a *App) GetSettings() gofunc.AppSettings {
	a.LogBackend("debug", "Retrieving settings", "backend")
	return Settings
}

func (a *App) GetWindowsPcColors() string {
	a.LogBackend("debug", "Getting Windows PC colors", "backend")
	var err error
	color := ""
	if runtime.GOOS == "windows" {
		color, err = gofunc.GetWindowsPcColors()
		if err != nil {
			a.LogBackend("error", "Failed to get Windows PC colors: "+err.Error(), "backend")
		}
	}
	return color
}

func (a *App) SetWindowAlwaysOnTop(onTop bool) {
	a.LogBackend("debug", fmt.Sprintf("Setting window always on top: %v ", onTop), "backend")
	runtime_wails.WindowSetAlwaysOnTop(a.ctx, onTop)
}

func (a *App) MakeMiniWindowSize(width int, height int, compact bool) {
	a.LogBackend("debug", "Setting mini window size: "+fmt.Sprintf("%dx%d compact=%v", width, height, compact), "backend")
	runtime_wails.WindowSetMinSize(a.ctx, width, height)
	runtime_wails.WindowSetSize(a.ctx, width, height)
	if compact {
		runtime_wails.WindowSetMaxSize(a.ctx, width, height)
	} else {
		runtime_wails.WindowSetMaxSize(a.ctx, 0, 0)
	}
}

func (a *App) TimerFinished(typeNotify string, description string) {
	a.LogBackend("info", fmt.Sprintf("Timer finished: %s - %s", typeNotify, description), "backend")
	if err := gofunc.Notify(typeNotify+": "+description, "has ended!"); err != nil {
		a.LogBackend("error", "Notification failed: "+err.Error(), "backend")
	}
}

func (a *App) Shutdown(ctx context.Context) {
	a.LogBackend("info", "App shutting down, saving settings", "backend")
	if a.logFile != nil {
		a.logFile.Close()
	}
	a.SaveSettings(Settings)
}

func (a *App) CloseWindow() {
	a.LogBackend("info", "Closing window", "backend")
	a.Shutdown(a.ctx)
	runtime_wails.Quit(a.ctx)
}
