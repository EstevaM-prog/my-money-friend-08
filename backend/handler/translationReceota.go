package handler

import (
	"backend/ent"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetReceitas returns all income transactions
func GetReceitas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.Transaction.Query().
		Where(ent.TransactionTypeEQ("income")).
		All(c.Request.Context())
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de receitas", "data": items})
}

// CreateReceita creates a new income transaction
func CreateReceita(c *gin.Context) {
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
		SetType("income").
		SetDate(input.Date).
		SetCategory(input.Category).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Receita criada", "data": t})
}

func GetReceitaByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateReceita(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteReceita(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}