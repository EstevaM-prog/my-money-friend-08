package models

import "time"

type Despesa struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"user_id"`
	CategoryID  uint      `json:"category_id"`
	CartaoID    *uint     `json:"cartao_id,omitempty"` // nullable if not paid with credit card
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	IsPaid      bool      `json:"is_paid"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
