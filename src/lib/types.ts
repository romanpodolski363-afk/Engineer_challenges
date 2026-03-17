// ---------------------------------------------------------------------------
// Database row types — use these throughout the app. Do not redefine.
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  website: string | null;
  created_at: string;
}

export interface Model {
  id: string;
  name: string;
  model_id: string;
  provider_id: string;
  context_window: number | null;
  status: 'evaluating' | 'approved' | 'deprecated';
  notes: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  model_id: string;
  environment: 'development' | 'staging' | 'production';
  deployed_by: string;
  deployed_at: string;
  status: 'active' | 'inactive' | 'failed';
  notes: string | null;
  created_at: string;
}

/** Joined view returned by the dashboard query. */
export interface ModelWithProvider extends Model {
  provider_name: string;
  provider_website: string | null;
}
