package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Categoria criada", "data": input})
}

func GetCategories(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de categorias", "data": []models.Category{}})
}

func GetCategoryByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes da categoria " + id})
}

func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Categoria " + id + " atualizada", "data": input})
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Categoria " + id + " excluída"})
}