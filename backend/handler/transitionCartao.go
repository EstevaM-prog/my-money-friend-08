package handler

import (
	"backend/ent"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetCartoes returns all accounts/cards
func GetCartoes(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.Account.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de cartões", "data": items})
}

// CreateCartao creates a new account/card
func CreateCartao(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	var input struct {
		Name        string  `json:"name"`
		Type        string  `json:"type"`
		Balance     float64 `json:"balance"`
		Institution string  `json:"institution"`
		Color       string  `json:"color"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	t, err := client.Account.Create().
		SetName(input.Name).
		SetType(input.Type).
		SetBalance(input.Balance).
		SetInstitution(input.Institution).
		SetColor(input.Color).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Cartão/Conta criado", "data": t})
}

func GetCartaoByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateCartao(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteCartao(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}