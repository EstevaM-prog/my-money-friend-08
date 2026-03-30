package handler

import (
	"backend/ent"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetCategories returns all categories
func GetCategories(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	items, err := client.Category.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Lista de categorias", "data": items})
}

// CreateCategory creates a new category
func CreateCategory(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	
	var input struct {
		Name  string `json:"name"`
		Type  string `json:"type"`
		Icon  string `json:"icon"`
		Color string `json:"color"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	t, err := client.Category.Create().
		SetName(input.Name).
		SetType(input.Type).
		SetIcon(input.Icon).
		SetColor(input.Color).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Categoria criada", "data": t})
}

func GetCategoryByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func UpdateCategory(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func DeleteCategory(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}