package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateReceita(c *gin.Context) {
	var input models.Receita
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Receita criada", "data": input})
}

func GetReceitas(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de receitas", "data": []models.Receita{}})
}

func GetReceitaByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes da receita " + id})
}

func UpdateReceita(c *gin.Context) {
	id := c.Param("id")
	var input models.Receita
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Receita " + id + " atualizada", "data": input})
}

func DeleteReceita(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Receita " + id + " excluída"})
}