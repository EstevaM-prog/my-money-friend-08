package models

import "time"

type Meta struct {
	ID            uint      `json:"id"`
	UserID        uint      `json:"user_id"`
	Name          string    `json:"name"`
	TargetAmount  float64   `json:"target_amount"`
	CurrentAmount float64   `json:"current_amount"`
	Deadline      time.Time `json:"deadline"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
