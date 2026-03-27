package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializa o roteador do Gin com logs e tratamento de pânico
	r := gin.Default()

	// Middleware de CORS simplificado para desenvolvimento local (permitir que o Vite acesse a API)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Ajuste se o Vite rodar em outra porta
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Grupo de rotas da API
	api := r.Group("/api")
	{
		// Rota de checagem de saúde
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "sucesso",
				"message": "API em Go (Gin) está funcionando! 🚀",
			})
		})
	}

	// Inicia o servidor na porta 8080
	log.Println("🚀 Servidor Go rodando em http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
