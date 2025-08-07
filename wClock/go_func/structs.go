package gofunc

type ItemsDB struct {
	Cards  []Card
	Tasks  []Task
	Alarms []Alarm
}

type Card struct {
	ID          string
	Name        string
	Dial        [6]int
	TimeLeft    float64
	InitialDial [6]int
	Order       int
}

type Alarm struct {
	ID       string
	Disabled bool
	Text     string
	Dial     [4]int
	WeekDays [7]bool
	Order    int
}

type Task struct {
	ID              string
	Text            string
	Checked         bool
	TimeToSpend     float64
	TimeInitToSpend int
	Order           int
	Completed       bool
}

type Goal struct {
	DailyProgress   [2]int `json:"dailyProgress"`
	Streak          int    `json:"streak"`
	Yesterday       [2]int `json:"yesterday"`
	Completed       int    `json:"completed"`
	DailyGoal       int    `json:"dailyGoal"`
	ClearHours      int    `json:"clearHours"`
	ClearMinutes    int    `json:"clearMinutes"`
	MonthDay        [2]int `json:"monthDay"`
	IncludeWeekdays bool   `json:"includeWeekdays"`
}

type FocusCard struct {
	Minutes       int  `json:"minutes"`
	CurMinutes    int  `json:"curMinutes"`
	BreaksAtEvery int  `json:"breaksAtEvery"`
	BreaksTime    int  `json:"breaksTime"`
	SkipBreaks    bool `json:"skipBreaks"`
}

type GridSeize struct {
	Left   int `json:"left"`
	Bottom int `json:"bottom"`
}

type FocusSettings struct {
	GridSeize GridSeize `json:"gridSeize"`
	Goal      Goal      `json:"goal"`
	FocusCard FocusCard `json:"focus"`
}

type AppSettings struct {
	Theme bool          `json:"Theme"`
	Focus FocusSettings `json:"Focus"`
}
