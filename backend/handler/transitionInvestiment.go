package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateInvestment(c *gin.Context) {
	var input models.Investment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Investimento criado", "data": input})
}

func GetInvestments(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de investimentos", "data": []models.Investment{}})
}

func GetInvestmentByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes do investimento " + id})
}

func UpdateInvestment(c *gin.Context) {
	id := c.Param("id")
	var input models.Investment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Investimento " + id + " atualizado", "data": input})
}

func DeleteInvestment(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Investimento " + id + " excluído"})
}