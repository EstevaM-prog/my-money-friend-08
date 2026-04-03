package handler

import (
	"backend/ent"
	"backend/ent/user"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Login valida email + senha e retorna os dados do usuário
func Login(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email e senha são obrigatórios"})
		return
	}

	// Busca o usuário pelo email no banco
	u, err := client.User.Query().
		Where(user.EmailEQ(input.Email)).
		Only(c.Request.Context())

	if err != nil {
		if ent.IsNotFound(err) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar usuário: " + err.Error()})
		}
		return
	}

	// Valida a senha (comparação direta — sem hash por enquanto)
	if u.Password != input.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha incorreta"})
		return
	}

	// Retorna os dados do usuário (sem a senha)
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":         u.ID,
			"name":       u.Name,
			"email":      u.Email,
			"phone":      u.Phone,
			"avatar_url": u.AvatarURL,
			"created_at": u.CreatedAt,
		},
	})
}
