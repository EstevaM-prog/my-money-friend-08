package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Account holds the schema definition for the Account entity.
type Account struct {
	ent.Schema
}

// Fields of the Account.
func (Account) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("type"),
		field.Float("balance").Default(0),
		field.String("institution"),
		field.String("color"),
		field.Float("limit").Default(0),
		field.Time("created_at").Default(time.Now),
	}
}

// Edges of the Account.
func (Account) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("accounts").Unique(),
		edge.To("transactions", Transaction.Type),
	}
}
