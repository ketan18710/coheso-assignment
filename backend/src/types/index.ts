export interface Field {
  id: string;
  label: string;
  type: 'text' | 'long-text' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select type
}

export interface RequestType {
  id: string;
  requestType: string;
  purpose: string;
  fields: Field[];
  owner: string; // email
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Database {
  requestTypes: RequestType[];
}

export type CreateRequestTypeInput = Omit<RequestType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequestTypeInput = Partial<Omit<RequestType, 'id' | 'createdAt'>>;

