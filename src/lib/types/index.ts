export interface Group {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface Member {
  id: string;
  group_id: string;
  user_id: string;
  email: string;
  display_name?: string;
  role: "admin" | "member";
}
