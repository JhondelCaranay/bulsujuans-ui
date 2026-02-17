export interface Option {
  label: string;
  value: string;
}

export interface Complaint {
  id: string;
  name: string;
  contact_number: string;
  alternate_contact_number: string;
  email: string;
  incident_detail: string;
  date_of_incident: string;
  complaint_status: string;
  complaint_type: string;
  complainant_id: string;
  createdAt: string;
  updatedAt: string;
  deleted_at?: string;
  is_anonymous?: boolean;
  // relation
  documents: Documents[];
  ticket: Tickets;
}

export interface Documents {
  id: string;
  public_url: string;
  public_id: string;
  complaint_id: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

export interface Tickets {
  id: string;
  title: string;
  description: string;
  status: string;
  complaint_id: string;
  assigned_office_id: string | null;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

export interface Access {
  id: string;
  code: string;
  name: string;
  desc: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  student_id?: string;

  status?: boolean;
  photo_url?: string;
  photo_id?: string;

  role?: Role;
  role_id?: string;

  office?: Office;
  office_id?: string;

  complaint?: Complaint[];
  news?: News[];
  experiences?: Experience[];
  education?: Education[];

  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
}

export interface News {
  id: string;
  title: string;
  source: string;
  content: string;
  category: string;
  posted_by?: User;
  posted_by_id?: string;

  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
}

export interface Experience {
  id: string;

  title: string;
  company: string;
  description?: string;

  start_year: number;
  end_year?: number;
  is_current?: boolean;

  createdAt: string;
  updatedAt: string;
  deleted_at?: string;

  user?: User;
  userId?: string;
}

export interface Education {
  id: string;

  degree: string;
  institution: string;
  description?: string;
  year: number;

  createdAt: string;
  updatedAt: string;
  deleted_at?: string;

  userId: string;
  user: User;
}

export interface Office {
  id: string;
  name: string;
  desc?: string;
  type: string;
  ticket: any;
  users: User[];
  createdAt: string;
  updatedAt: string;
  deleted_at?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
