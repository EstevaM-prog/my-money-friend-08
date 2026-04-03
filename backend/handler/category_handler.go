package handler

import (
	"backend/ent"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	items, err := client.Category.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": items})
}

func CreateCategory(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	var input struct {
		Name  string `json:"name"`
		Color string `json:"color"`
		Icon  string `json:"icon"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	item, err := client.Category.Create().
		SetName(input.Name).
		SetColor(input.Color).
		SetIcon(input.Icon).
		Save(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": item})
}

func DeleteCategory(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, _ := strconv.Atoi(c.Param("id"))
	err := client.Category.DeleteOneID(id).Exec(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Categoria removida"})
}

func GetCategoryByID(c *gin.Context) { c.JSON(http.StatusNotImplemented, nil) }
func UpdateCategory(c *gin.Context) { c.JSON(http.StatusNotImplemented, nil) }