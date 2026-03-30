package models

import "time"

type Cartao struct {
	ID         uint      `json:"id"`
	UserID     uint      `json:"user_id"`
	Name       string    `json:"name"`
	Limit      float64   `json:"limit"`
	ClosingDay int       `json:"closing_day"`
	DueDate    int       `json:"due_date"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
