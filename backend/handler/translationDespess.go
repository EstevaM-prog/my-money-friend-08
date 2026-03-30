package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateDespesa(c *gin.Context) {
	var input models.Despesa
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Despesa criada", "data": input})
}

func GetDespesas(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de despesas", "data": []models.Despesa{}})
}

func GetDespesaByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes da despesa " + id})
}

func UpdateDespesa(c *gin.Context) {
	id := c.Param("id")
	var input models.Despesa
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Despesa " + id + " atualizada", "data": input})
}

func DeleteDespesa(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Despesa " + id + " excluída"})
}