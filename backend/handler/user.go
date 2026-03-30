package handler

import (
	models "backend/struct"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateUser godoc
// @Summary      Cria um usuário
// @Description  Cadastra um novo usuário no sistema
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        user  body      models.User  true  "Dados do usuário"
// @Success      201   {object}  map[string]interface{}
// @Failure      400   {object}  map[string]interface{}
// @Router       /users/ [post]
func CreateUser(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Usuário criado", "data": input})
}

// GetUsers godoc
// @Summary      Lista usuários
// @Description  Retorna uma lista de todos os usuários
// @Tags         users
// @Produce      json
// @Success      200   {object}  map[string]interface{}
// @Router       /users/ [get]
func GetUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Lista de usuários", "data": []models.User{}})
}

// GetUserByID godoc
// @Summary      Busca um usuário
// @Description  Retorna os detalhes de um único usuário pelo ID
// @Tags         users
// @Produce      json
// @Param        id    path      int  true  "ID do usuário"
// @Success      200   {object}  map[string]interface{}
// @Router       /users/{id} [get]
func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Detalhes do usuário " + id})
}

// UpdateUser godoc
// @Summary      Atualiza usuário
// @Description  Edita dados de um usuário pelo ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id    path      int          true  "ID do usuário"
// @Param        user  body      models.User  true  "Novos dados"
// @Success      200   {object}  map[string]interface{}
// @Failure      400   {object}  map[string]interface{}
// @Router       /users/{id} [put]
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Usuário " + id + " atualizado", "data": input})
}

// DeleteUser godoc
// @Summary      Deleta usuário
// @Description  Remove usuário pelo ID
// @Tags         users
// @Produce      json
// @Param        id    path      int  true  "ID do usuário"
// @Success      200   {object}  map[string]interface{}
// @Router       /users/{id} [delete]
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Usuário " + id + " excluído"})
}