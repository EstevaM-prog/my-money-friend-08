package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCartao(c *gin.Context) {
	var input models.Cartao
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Cartão criado", "data": input})
}

func GetCartoes(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de cartões", "data": []models.Cartao{}})
}

func GetCartaoByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes do cartão " + id})
}

func UpdateCartao(c *gin.Context) {
	id := c.Param("id")
	var input models.Cartao
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cartão " + id + " atualizado", "data": input})
}

func DeleteCartao(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Cartão " + id + " excluído"})
}