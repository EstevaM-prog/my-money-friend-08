package models

import "time"

type Investment struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"user_id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"` // e.g., "Renda Fixa", "Ações"
	Amount      float64   `json:"amount"`
	YieldRate   float64   `json:"yield_rate"`
	StartDate   time.Time `json:"start_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
