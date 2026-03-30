package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// BudgetRule holds the schema definition for the BudgetRule entity.
type BudgetRule struct {
	ent.Schema
}

// Fields of the BudgetRule.
func (BudgetRule) Fields() []ent.Field {
	return []ent.Field{
		field.String("label"),
		field.String("category"),
		field.Float("percentage"),
		field.String("color"),
		field.Time("created_at").Default(time.Now),
	}
}

// Edges of the BudgetRule.
func (BudgetRule) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("budget_rules").Unique(),
	}
}
