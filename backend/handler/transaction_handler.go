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
		Order(ent.Desc(transaction.FieldDate)).
		All(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar despesas: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": items})
}

// GetReceitas retorna todas as receitas filtradas por tipo "income"
func GetReceitas(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	items, err := client.Transaction.Query().
		Where(transaction.TypeEQ("income")).
		Order(ent.Desc(transaction.FieldDate)).
		All(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar receitas: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": items})
}

// CreateDespesa cria uma nova transação de despesa
func CreateDespesa(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	var input struct {
		Description string    `json:"description"`
		Amount      float64   `json:"amount"`
		Date        time.Time `json:"date"`
		Category    string    `json:"category"`
		AccountID   int       `json:"accountId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	builder := client.Transaction.Create().
		SetDescription(input.Description).
		SetAmount(input.Amount).
		SetType("expense").
		SetDate(input.Date).
		SetCategory(input.Category)

	if input.AccountID > 0 {
		builder = builder.SetAccountID(input.AccountID)
	}

	t, err := builder.Save(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar despesa: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": t})
}

// CreateReceita cria uma nova transação de receita
func CreateReceita(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)

	var input struct {
		Description string    `json:"description"`
		Amount      float64   `json:"amount"`
		Date        time.Time `json:"date"`
		Category    string    `json:"category"`
		AccountID   int       `json:"accountId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	builder := client.Transaction.Create().
		SetDescription(input.Description).
		SetAmount(input.Amount).
		SetType("income").
		SetDate(input.Date).
		SetCategory(input.Category)

	if input.AccountID > 0 {
		builder = builder.SetAccountID(input.AccountID)
	}

	t, err := builder.Save(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar receita: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": t})
}

// DeleteDespesa deleta uma transação pelo ID
func DeleteDespesa(c *gin.Context) {
	client := c.MustGet("db").(*ent.Client)
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := client.Transaction.DeleteOneID(id).Exec(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transação removida com sucesso"})
}

// DeleteReceita reutiliza a lógica de deletar
func DeleteReceita(c *gin.Context) {
	DeleteDespesa(c)
}

func GetDespesaByID(c *gin.Context)  { c.JSON(http.StatusNotImplemented, gin.H{"error": "Em desenvolvimento"}) }
func UpdateDespesa(c *gin.Context)   { c.JSON(http.StatusNotImplemented, gin.H{"error": "Em desenvolvimento"}) }
func GetReceitaByID(c *gin.Context)  { c.JSON(http.StatusNotImplemented, gin.H{"error": "Em desenvolvimento"}) }
func UpdateReceita(c *gin.Context)   { c.JSON(http.StatusNotImplemented, gin.H{"error": "Em desenvolvimento"}) }
