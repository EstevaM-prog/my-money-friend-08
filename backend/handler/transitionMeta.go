package handler

import (
	"backend/ent"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetMetas returns all goals
func GetMetas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.Goal.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de metas", "data": items})
}

// CreateMeta creates a new goal
func CreateMeta(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	var input struct {
		Name     string    `json:"name"`
		Target   float64   `json:"target"`
		Current  float64   `json:"current"`
		Deadline time.Time `json:"deadline"`
		Color    string    `json:"color"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	t, err := client.Goal.Create().
		SetName(input.Name).
		SetTarget(input.Target).
		SetCurrent(input.Current).
		SetDeadline(input.Deadline).
		SetColor(input.Color).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Meta criada", "data": t})
}

func GetMetaByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateMeta(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteMeta(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}