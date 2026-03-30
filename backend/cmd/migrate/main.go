package main

import (
	"context"
	"log"
	"os"

	"backend/ent"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

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

	// Inicializa o cliente Ent
	client, err := ent.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Falha ao abrir conexão com o banco Neon: %v", err)
	}
	defer client.Close()

	// Executa migrações automáticas
	log.Println("⏳ Iniciando sincronização do schema com o Neon Serverless...")
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("Falha ao criar recursos do schema (migração): %v", err)
	}
	
	log.Println("✅ Banco de dados sincronizado com sucesso!")
}
