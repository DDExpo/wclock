package gofunc

type Card struct {
	ID          string
	Name        string
	Dial        [6]int
	TimeLeft    float64
	InitialDial [6]int
}

type Alarm struct {
	ID       string
	Disabled bool
	Text     string
	Dial     [4]int
	WeekDays [7]bool
}

type Task struct {
	ID        string
	Text      string
	Checked   bool
	TimeSpent string
}

type Goal struct {
	DailyProgress   [2]int `json:"dailyProgress"`
	Streak          int    `json:"streak"`
	Yesterday       int    `json:"yesterday"`
	Completed       int    `json:"completed"`
	DailyGoal       int    `json:"dailyGoal"`
	ClearHours      int    `json:"clearHours"`
	ClearMinutes    int    `json:"clearMinutes"`
	IncludeWeekdays bool   `json:"includeWeekdays"`
}

type FocusCard struct {
	Hours      int  `json:"hours"`
	Minutes    int  `json:"minutes"`
	Breaks     int  `json:"breaks"`
	BreaksTime int  `json:"breaksTime"`
	SkipBreaks bool `json:"skipBreaks"`
}

type FocusSettings struct {
	Goal      Goal      `json:"goal"`
	FocusCard FocusCard `json:"focus"`
}

type AppSettings struct {
	Theme bool          `json:"Theme"`
	Focus FocusSettings `json:"Focus"`
}
