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

func GetAllCards(DB *sqlx.DB) ([]gofunc.Card, error) {

	items := []gofunc.Card{}

	rows, err := DB.Query("SELECT * FROM cards")

	if err != nil {
		return items, fmt.Errorf("error when getting all Cards: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var card gofunc.Card
		var dialRaw string
		var initialdialRaw string

		err = rows.Scan(&card.ID, &card.Name, &dialRaw, &card.TimeLeft, &initialdialRaw)
		errj := json.Unmarshal([]byte(dialRaw), &card.Dial)
		if errj != nil {
			return items, fmt.Errorf("error when unmarshall column Cards dial: %v", err)
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

func DbDelete(DB *sqlx.DB, id string, table string) error {
	_, err := DB.Exec(("DELETE FROM " + table + " WHERE id = ?"), id)
	return err
}

func SaveCards(DB *sqlx.DB, cards []gofunc.Card) error {
	tx, err := DB.Beginx()
	if err != nil {
		return err
	}
	stmt, err := tx.Preparex(`
		INSERT INTO cards (id, name, dial, timeleft, initialdial)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			name = excluded.name,
			dial = excluded.dial,
			timeleft = excluded.timeleft,
			initialdial = excluded.initialdial
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
		_, err = stmt.Exec(c.ID, c.Name, dialJSON, c.TimeLeft, initialDialJSON)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func GetAllAlarms(DB *sqlx.DB) ([]gofunc.Alarm, error) {

	items := []gofunc.Alarm{}

	rows, err := DB.Query("SELECT * FROM alarms")

	if err != nil {
		return items, fmt.Errorf("error when getting all Alarms: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var alarm gofunc.Alarm
		var dialRaw string
		var weekDaysRaw string

		err = rows.Scan(&alarm.ID, &alarm.Text, &alarm.Disabled, &dialRaw, &weekDaysRaw)
		errj := json.Unmarshal([]byte(dialRaw), &alarm.Dial)
		if errj != nil {
			return items, fmt.Errorf("error when unmarshall column alarms dial: %v", err)
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
		INSERT INTO alarms (id, text, dial, disabled, weekdays)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			text = excluded.text,
			dial = excluded.dial,
			disabled = excluded.disabled,
			weekdays = excluded.weekdays
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
		_, err = stmt.Exec(a.ID, a.Text, dialJSON, a.Disabled, weekDaysJSON)
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
		initialdial BLOB
	);`
	schemaAlarms := `CREATE TABLE IF NOT EXISTS alarms (
		id TEXT PRIMARY KEY,
		text TEXT,
		disabled BOOLEAN,
		dial BLOB,
		weekdays BLOB
	);`
	_, err := db.Exec(schemaCards)
	if err != nil {
		return fmt.Errorf("error on executing shemaCards: %v", err)
	}
	_, err = db.Exec(schemaAlarms)
	if err != nil {
		return fmt.Errorf("error on executing shemaAlarms: %v", err)
	}

	return nil
}
