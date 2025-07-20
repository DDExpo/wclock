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

	var items []gofunc.Card

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

func DeleteCards(DB *sqlx.DB, id string) error {
	_, err := DB.Exec(`DELETE FROM cards WHERE id = ?`, id)
	return err
}

func SaveCards(DB *sqlx.DB, cards []gofunc.Card) error {
	for _, c := range cards {
		dialJSON, err := json.Marshal(c.Dial)
		if err != nil {
			fmt.Println(err)
		}
		initialDialJSON, err := json.Marshal(c.InitialDial)
		if err != nil {
			fmt.Println(err)
		}
		DB.MustExec(`
			INSERT INTO cards (id, name, dial, timeleft, initialdial)
			VALUES (?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET
				name = excluded.name,
				dial = excluded.dial,
				timeleft = excluded.timeleft,
				initialdial = excluded.initialdial
		`, c.ID, c.Name, dialJSON, c.TimeLeft, initialDialJSON)
	}
	return nil
}

func RunFirstTimeShemas(db *sqlx.DB) error {
	schemaCards := `CREATE TABLE IF NOT EXISTS cards (
		id TEXT PRIMARY KEY,
		name TEXT,
		dial BLOB,
		timeleft REAL,
		initialdial BLOB
	);`
	// schemaAlarms := `CREATE TABLE IF NOT EXISTS alarms (
	// 	id INTEGER PRIMARY KEY,
	// 	name TEXT,
	// 	time TEXT,
	// 	timeLeft INT
	// );`
	_, err := db.Exec(schemaCards)
	if err != nil {
		return fmt.Errorf("error on executing shemaCards: %v", err)
	}
	// _, err = db.Exec(schemaAlarms)
	// if err != nil {
	// 	return fmt.Errorf("error on executing shemaCards: %v", err)
	// }

	return nil
}
