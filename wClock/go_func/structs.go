package gofunc

type UserSettings struct {
	AppTheme bool
}

type Card struct {
	ID          string
	Name        string
	Dial        [6]int
	TimeLeft    float64
	InitialDial [6]int
}

type Alarm struct {
	ID       string
	Enable   bool
	Text     string
	Dial     [4]int
	WeekDays [7]bool
}
