export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  email: string;
  name?: string;
  role: "admin" | "member";
  joinedAt: Date;
}
