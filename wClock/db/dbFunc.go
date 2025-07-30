package db

import (
	"encoding/json"
	"fmt"
	gofunc "wClock/go_func"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func GetDB(dbPath string) *sqlx.DB {
	db, err := sqlx.Connect("sqlite3", dbPath)
	if err != nil {
		fmt.Println(err)
	}
	return db
}

func DbDelete(DB *sqlx.DB, ids []string, table string) error {

	query, args, err := sqlx.In("DELETE FROM "+table+" WHERE id IN (?)", ids)
	if err != nil {
		return err
	}
	query = DB.Rebind(query)

	_, err = DB.Exec(query, args...)
	return err
}

func GetAllCards(DB *sqlx.DB) ([]gofunc.Card, error) {

	items := []gofunc.Card{}

	rows, err := DB.Query(`SELECT * FROM cards ORDER BY sort_order ASC`)

	if err != nil {
		return items, fmt.Errorf("error when getting all Cards: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var card gofunc.Card
		var dialRaw string
		var initialdialRaw string

		rows.Scan(&card.ID, &card.Name, &dialRaw, &card.TimeLeft, &initialdialRaw, &card.Order)
		errj := json.Unmarshal([]byte(dialRaw), &card.Dial)
		if errj != nil {
			return items, fmt.Errorf("error when unmarshall column Cards dial: %v", errj)
		}
		errjd := json.Unmarshal([]byte(initialdialRaw), &card.InitialDial)
		if errjd != nil {
			return items, fmt.Errorf("error when unmarshall column Cards initilaDial: %v", errjd)
		}
		items = append(items, card)
	}
	err = rows.Err()
	if err != nil {
		return items, fmt.Errorf("error when getting all Cards: %v", err)
	}
	return items, err
}

func SaveCards(DB *sqlx.DB, cards []gofunc.Card) error {
	tx, err := DB.Beginx()
	if err != nil {
		return err
	}
	stmt, err := tx.Preparex(`
		INSERT INTO cards (id, name, dial, timeleft, initialdial, sort_order)
		VALUES (?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name = excluded.name,
			dial = excluded.dial,
			timeleft = excluded.timeleft,
			initialdial = excluded.initialdial,
			sort_order = excluded.sort_order
	`)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()

	for _, c := range cards {
		dialJSON, err := json.Marshal(c.Dial)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("marshal dial: %w", err)
		}
		initialDialJSON, err := json.Marshal(c.InitialDial)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("marshal initialDial: %w", err)
		}
		_, err = stmt.Exec(c.ID, c.Name, dialJSON, c.TimeLeft, initialDialJSON, c.Order)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func GetAllAlarms(DB *sqlx.DB) ([]gofunc.Alarm, error) {

	items := []gofunc.Alarm{}

	rows, err := DB.Query(`SELECT * FROM alarms ORDER BY sort_order ASC`)

	if err != nil {
		return items, fmt.Errorf("error when getting all Alarms: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var alarm gofunc.Alarm
		var dialRaw string
		var weekDaysRaw string

		rows.Scan(&alarm.ID, &alarm.Text, &alarm.Disabled, &dialRaw, &weekDaysRaw, &alarm.Order)
		errj := json.Unmarshal([]byte(dialRaw), &alarm.Dial)
		if errj != nil {
			return items, fmt.Errorf("error when unmarshall column alarms dial: %v", errj)
		}
		errjd := json.Unmarshal([]byte(weekDaysRaw), &alarm.WeekDays)
		if errjd != nil {
			return items, fmt.Errorf("error when unmarshall column alarms WeekDays: %v", errjd)
		}
		items = append(items, alarm)
	}
	err = rows.Err()
	if err != nil {
		return items, fmt.Errorf("error when getting all Alarms: %v", err)
	}
	return items, err
}

func SaveAlarms(DB *sqlx.DB, alarms []gofunc.Alarm) error {

	tx, err := DB.Beginx()
	if err != nil {
		return err
	}
	stmt, err := tx.Preparex(`
		INSERT INTO alarms (id, text, dial, disabled, weekdays, sort_order)
		VALUES (?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			text = excluded.text,
			dial = excluded.dial,
			disabled = excluded.disabled,
			weekdays = excluded.weekdays,
			sort_order = excluded.sort_order
	`)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()

	for _, a := range alarms {
		dialJSON, err := json.Marshal(a.Dial)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("marshal dial: %w", err)
		}
		weekDaysJSON, err := json.Marshal(a.WeekDays)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("marshal weekdays: %w", err)
		}
		_, err = stmt.Exec(a.ID, a.Text, dialJSON, a.Disabled, weekDaysJSON, a.Order)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func GetAllTasks(DB *sqlx.DB) ([]gofunc.Task, error) {
	items := []gofunc.Task{}

	rows, err := DB.Query("SELECT * FROM tasks")

	if err != nil {
		return items, fmt.Errorf("error when getting all Tasks: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var tasks gofunc.Task

		rows.Scan(&tasks.ID, &tasks.Text, &tasks.Checked, &tasks.TimeSpent)
		items = append(items, tasks)
	}

	err = rows.Err()
	if err != nil {
		return items, fmt.Errorf("error when getting all Tasks: %v", err)
	}
	return items, err
}

func SaveTasks(DB *sqlx.DB, tasks []gofunc.Task) error {

	tx, err := DB.Beginx()
	if err != nil {
		return err
	}

	stmt, err := tx.Preparex(`
		INSERT INTO tasks (id, text, checked, timespent)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			text = excluded.text,
			checked = excluded.checked,
			timespent = excluded.timespent
	`)

	if err != nil {
		tx.Rollback()
		return err
	}

	defer stmt.Close()

	for _, t := range tasks {
		_, err := stmt.Exec(t.ID, t.Text, t.Checked, t.TimeSpent)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}

func RunFirstTimeShemas(db *sqlx.DB) error {
	schemaCards := `CREATE TABLE IF NOT EXISTS cards (
		id TEXT PRIMARY KEY,
		name TEXT,
		dial BLOB,
		timeleft REAL,
		initialdial BLOB,
		sort_order SMALLINT
	);`
	schemaAlarms := `CREATE TABLE IF NOT EXISTS alarms (
		id TEXT PRIMARY KEY,
		text TEXT,
		disabled BOOLEAN,
		dial BLOB,
		weekdays BLOB,
		sort_order SMALLINT
	);`
	schemaTasks := `CREATE TABLE IF NOT EXISTS tasks (
		id TEXT PRIMARY KEY,
		text TEXT,
		checked BOOLEAN,
		timespent TEXT
	);`
	_, err := db.Exec(schemaCards)
	if err != nil {
		return fmt.Errorf("error on executing shemaCards: %v", err)
	}
	_, err = db.Exec(schemaAlarms)
	if err != nil {
		return fmt.Errorf("error on executing shemaAlarms: %v", err)
	}
	_, err = db.Exec(schemaTasks)
	if err != nil {
		return fmt.Errorf("error on executing shemaTasks: %v", err)
	}

	return nil
}
