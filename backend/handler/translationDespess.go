package handler

import (
	"backend/ent"
	"backend/ent/transaction"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetDespesas returns all expenses
func GetDespesas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.Transaction.Query().
		Where(transaction.TypeEQ("expense")).
		All(c.Request.Context())
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de despesas", "data": items})
}

// CreateDespesa creates a new expense transaction
func CreateDespesa(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	var input struct {
		Description string    `json:"description"`
		Amount      float64   `json:"amount"`
		Date        time.Time `json:"date"`
		Category    string    `json:"category"`
		AccountID   string    `json:"accountId"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Create transaction in Ent
	t, err := client.Transaction.Create().
		SetDescription(input.Description).
		SetAmount(input.Amount).
		SetType("expense").
		SetDate(input.Date).
		SetCategory(input.Category).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Despesa criada", "data": t})
}

func GetDespesaByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateDespesa(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteDespesa(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}