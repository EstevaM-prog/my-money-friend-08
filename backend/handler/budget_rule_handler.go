package handler

import (
	"backend/ent"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetBudgetRules returns all budget rules
func GetBudgetRules(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.BudgetRule.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de regras", "data": items})
}

// CreateBudgetRule creates a new budget rule
func CreateBudgetRule(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	var input struct {
		Label      string  `json:"label"`
		Category   string  `json:"category"`
		Percentage float64 `json:"percentage"`
		Color      string  `json:"color"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	t, err := client.BudgetRule.Create().
		SetLabel(input.Label).
		SetCategory(input.Category).
		SetPercentage(input.Percentage).
		SetColor(input.Color).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Regra criada", "data": t})
}

func GetBudgetRuleByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateBudgetRule(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteBudgetRule(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}
