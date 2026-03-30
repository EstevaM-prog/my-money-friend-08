package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMeta(c *gin.Context) {
	var input models.Meta
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Meta criada", "data": input})
}

func GetMetas(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de metas", "data": []models.Meta{}})
}

func GetMetaByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes da meta " + id})
}

func UpdateMeta(c *gin.Context) {
	id := c.Param("id")
	var input models.Meta
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Meta " + id + " atualizada", "data": input})
}

func DeleteMeta(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Meta " + id + " excluída"})
}