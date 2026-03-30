package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Transaction holds the schema definition for the Transaction entity.
type Transaction struct {
	ent.Schema
}

// Fields of the Transaction.
func (Transaction) Fields() []ent.Field {
	return []ent.Field{
		field.String("description"),
		field.Float("amount"),
		field.String("type"), // "income" or "expense"
		field.Time("date"),
		field.String("category"),
		field.String("payment_method").Optional(),
		field.Bool("is_recurring").Default(false),
		field.Bool("notification_active").Default(false),
		field.Time("created_at").Default(time.Now),
	}
}

// Edges of the Transaction.
func (Transaction) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("transactions").Unique(),
		edge.From("account", Account.Type).Ref("transactions").Unique(),
	}
}
