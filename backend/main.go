package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"backend/ent"
	_ "backend/docs"
	"backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           My Money Friend API
// @version         1.0
// @description     API de gerenciamento financeiro com Go + Gin + Ent (Neon Serverless)
// @host            localhost:8080
// @BasePath        /api
func main() {
	// Carrega variáveis de ambiente do arquivo .env
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Aviso: Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("ERRO: DATABASE_URL não definida no ambiente")
	}

	// Inicializa o cliente Ent (PostgreSQL/Neon)
	client, err := ent.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Falha ao abrir conexão com o banco Neon: %v", err)
	}
	defer client.Close()

	// Executa migrações automáticas (Neon Serverless)
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("Falha ao criar recursos do schema (migração): %v", err)
	}
	log.Println("✅ Banco de dados Neon sincronizado com sucesso!")

	// Inicializa o roteador do Gin
	r := gin.Default()

	// Middleware de CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Disponibiliza o cliente Ent para todos os handlers via Middleware
	r.Use(func(c *gin.Context) {
		c.Set("db", client)
		c.Next()
	})

	// Grupo de rotas da API
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "sucesso",
				"message": "My Money Friend API rodando com Neon Serverless! 🚀",
			})
		})

		// Configura rotas da aplicação
		routes.RegisterRoutes(api)
	}

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Inicia o servidor na porta 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("🚀 Servidor Go rodando em http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
