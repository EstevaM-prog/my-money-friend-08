package models

import "time"

type Receita struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"user_id"`
	CategoryID  uint      `json:"category_id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	IsReceived  bool      `json:"is_received"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
