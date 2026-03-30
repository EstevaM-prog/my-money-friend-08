package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Goal holds the schema definition for the Goal entity.
type Goal struct {
	ent.Schema
}

// Fields of the Goal.
func (Goal) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Float("target"),
		field.Float("current").Default(0),
		field.Time("deadline"),
		field.String("color"),
		field.Time("created_at").Default(time.Now),
	}
}

// Edges of the Goal.
func (Goal) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("goals").Unique(),
	}
}
