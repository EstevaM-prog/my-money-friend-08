package handler

import (
	"backend/ent"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func GetMetas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	items, err := client.Goal.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": items})
}

func CreateMeta(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	var input struct {
		Name     string    `json:"title"`
		Target   float64   `json:"target"`
		Current  float64   `json:"current"`
		Deadline time.Time `json:"deadline"`
		Color    string    `json:"color"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	item, err := client.Goal.Create().
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
	c.JSON(http.StatusCreated, gin.H{"data": item})
}

func UpdateMeta(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, _ := strconv.Atoi(c.Param("id"))
	
	var input struct {
		Name     string    `json:"title"`
		Target   float64   `json:"target"`
		Current  float64   `json:"current"`
		Deadline time.Time `json:"deadline"`
		Color    string    `json:"color"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	item, err := client.Goal.UpdateOneID(id).
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
	c.JSON(http.StatusOK, gin.H{"data": item})
}

func DeleteMeta(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, _ := strconv.Atoi(c.Param("id"))
	err := client.Goal.DeleteOneID(id).Exec(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Meta removida"})
}

func GetMetaByID(c *gin.Context) { c.JSON(http.StatusNotImplemented, nil) }