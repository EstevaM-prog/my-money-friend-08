package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("email").Unique(),
		field.String("password").Sensitive(),
		field.String("phone").Optional(),
		field.String("avatar_url").Optional(),
		field.Enum("role").Values("admin", "userVitalicio", "userMensal", "UserExperimental").Default("UserExperimental"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("accounts", Account.Type),
		edge.To("transactions", Transaction.Type),
		edge.To("goals", Goal.Type),
		edge.To("categories", Category.Type),
		edge.To("budget_rules", BudgetRule.Type),
	}
}
