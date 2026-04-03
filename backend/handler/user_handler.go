package handler

import (
	"backend/ent"
	"backend/ent/user"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateUser cria um novo usuário no banco de dados
func CreateUser(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Phone    string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	if input.Name == "" || input.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome e email são obrigatórios"})
		return
	}

	u, err := client.User.Create().
		SetName(input.Name).
		SetEmail(input.Email).
		SetPassword(input.Password).
		SetNillablePhone(nilIfEmpty(input.Phone)).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": u})
}

// GetUsers retorna todos os usuários ou filtra por email (?email=...)
func GetUsers(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	email := c.Query("email")
	if email != "" {
		// Modo login: busca por email
		u, err := client.User.Query().Where(user.EmailEQ(email)).Only(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"data": []interface{}{}})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": []*ent.User{u}})
		return
	}

	items, err := client.User.Query().All(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": items})
}

// GetUserByID retorna um usuário pelo ID
func GetUserByID(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	u, err := client.User.Get(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": u})
}

// UpdateUser atualiza os dados de um usuário no banco
func UpdateUser(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var input struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	u, err := client.User.UpdateOneID(id).
		SetName(input.Name).
		SetEmail(input.Email).
		SetNillablePhone(nilIfEmpty(input.Phone)).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar usuário: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": u})
}

// DeleteUser remove um usuário do banco
func DeleteUser(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	if err := client.User.DeleteOneID(id).Exec(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar usuário: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Usuário removido com sucesso"})
}

// GetUserByEmail busca um usuário pelo email (usado no login)
func GetUserByEmail(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email é obrigatório"})
		return
	}
	u, err := client.User.Query().Where(user.EmailEQ(email)).Only(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": u})
}

// nilIfEmpty retorna ponteiro para string ou nil se vazia
func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}