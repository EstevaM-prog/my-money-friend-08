package handler

import (
	"backend/ent"
	"backend/ent/transaction"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// GetDespesas retorna todas as despesas filtradas por tipo "expense"
func GetDespesas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	items, err := client.Transaction.Query().
		Where(transaction.TypeEQ("expense")).
		WithAccount().
		Order(ent.Desc(transaction.FieldDate)).
		All(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar despesas: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lista de despesas", "data": items})
}

// GetReceitas retorna todas as receitas filtradas por tipo "income"
func GetReceitas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	items, err := client.Transaction.Query().
		Where(transaction.TypeEQ("income")).
		WithAccount().
		Order(ent.Desc(transaction.FieldDate)).
		All(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar receitas: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lista de receitas", "data": items})
}

// CreateDespesa cria uma nova transação de despesa
func CreateDespesa(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	var input struct {
		Description string    `json:"description"`
		Amount      float64   `json:"amount"`
		Date        time.Time `json:"date"`
		Category    string    `json:"category"`
		AccountID   string    `json:"accountId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	accID, _ := strconv.Atoi(input.AccountID)

	// Inicia o builder de criação
	builder := client.Transaction.Create().
		SetDescription(input.Description).
		SetAmount(input.Amount).
		SetType("expense").
		SetDate(input.Date).
		SetCategory(input.Category)

	// Vincula à conta se o ID for válido
	if accID > 0 {
		builder.SetAccountID(accID)
	}

	t, err := builder.Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar despesa: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Despesa criada", "data": t})
}

// CreateReceita cria uma nova transação de receita
func CreateReceita(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	var input struct {
		Description string    `json:"description"`
		Amount      float64   `json:"amount"`
		Date        time.Time `json:"date"`
		Category    string    `json:"category"`
		AccountID   string    `json:"accountId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	accID, _ := strconv.Atoi(input.AccountID)

	builder := client.Transaction.Create().
		SetDescription(input.Description).
		SetAmount(input.Amount).
		SetType("income").
		SetDate(input.Date).
		SetCategory(input.Category)

	if accID > 0 {
		builder.SetAccountID(accID)
	}

	t, err := builder.Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar receita: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Receita criada", "data": t})
}

// DeleteDespesa deleta uma despesa pelo ID
func DeleteDespesa(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)

	err := client.Transaction.DeleteOneID(id).Exec(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transação removida com sucesso"})
}

// DeleteReceita deleta uma receita pelo ID
func DeleteReceita(c *gin.Context) {
	DeleteDespesa(c) // Reusa a lógica de deletar transação genérica
}

func GetDespesaByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Feature em desenvolvimento"})
}

func UpdateDespesa(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Feature em desenvolvimento"})
}

func GetReceitaByID(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Feature em desenvolvimento"})
}

func UpdateReceita(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Feature em desenvolvimento"})
}
