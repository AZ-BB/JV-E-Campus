DROP TABLE IF EXISTS action_logs;

CREATE TABLE action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    type TEXT NOT NULL,
    actor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acted_on_id INTEGER,
    acted_on_type TEXT,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'
)