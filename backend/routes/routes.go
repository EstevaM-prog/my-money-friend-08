package routes

import (
	"backend/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(api *gin.RouterGroup) {
	// Usuários
	usuarios := api.Group("/users")
	{
		usuarios.POST("", handler.CreateUser)
		usuarios.GET("", handler.GetUsers)
		usuarios.GET("/:id", handler.GetUserByID)
		usuarios.PUT("/:id", handler.UpdateUser)
		usuarios.DELETE("/:id", handler.DeleteUser)
	}

	// Cartões
	cartoes := api.Group("/cartoes")
	{
		cartoes.POST("", handler.CreateCartao)
		cartoes.GET("", handler.GetCartoes)
		cartoes.GET("/:id", handler.GetCartaoByID)
		cartoes.PUT("/:id", handler.UpdateCartao)
		cartoes.DELETE("/:id", handler.DeleteCartao)
	}

	// Categorias
	categorias := api.Group("/categories")
	{
		categorias.POST("", handler.CreateCategory)
		categorias.GET("", handler.GetCategories)
		categorias.GET("/:id", handler.GetCategoryByID)
		categorias.PUT("/:id", handler.UpdateCategory)
		categorias.DELETE("/:id", handler.DeleteCategory)
	}

	// Investimentos
	investimentos := api.Group("/investments")
	{
		investimentos.POST("", handler.CreateInvestment)
		investimentos.GET("", handler.GetInvestments)
		investimentos.GET("/:id", handler.GetInvestmentByID)
		investimentos.PUT("/:id", handler.UpdateInvestment)
		investimentos.DELETE("/:id", handler.DeleteInvestment)
	}

	// Metas
	metas := api.Group("/metas")
	{
		metas.POST("", handler.CreateMeta)
		metas.GET("", handler.GetMetas)
		metas.GET("/:id", handler.GetMetaByID)
		metas.PUT("/:id", handler.UpdateMeta)
		metas.DELETE("/:id", handler.DeleteMeta)
	}

	// Despesas
	despesas := api.Group("/despesas")
	{
		despesas.POST("", handler.CreateDespesa)
		despesas.GET("", handler.GetDespesas)
		despesas.GET("/:id", handler.GetDespesaByID)
		despesas.PUT("/:id", handler.UpdateDespesa)
		despesas.DELETE("/:id", handler.DeleteDespesa)
	}

	// Receitas
	receitas := api.Group("/receitas")
	{
		receitas.POST("", handler.CreateReceita)
		receitas.GET("", handler.GetReceitas)
		receitas.GET("/:id", handler.GetReceitaByID)
		receitas.PUT("/:id", handler.UpdateReceita)
		receitas.DELETE("/:id", handler.DeleteReceita)
	}

	// Regras de Orçamento
	regras := api.Group("/budget-rules")
	{
		regras.POST("", handler.CreateBudgetRule)
		regras.GET("", handler.GetBudgetRules)
		regras.GET("/:id", handler.GetBudgetRuleByID)
		regras.PUT("/:id", handler.UpdateBudgetRule)
		regras.DELETE("/:id", handler.DeleteBudgetRule)
	}
}