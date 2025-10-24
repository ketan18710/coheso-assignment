export interface Field {
  id: string;
  label: string;
  type: 'text' | 'long-text' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface RequestType {
  id: string;
  requestType: string;
  purpose: string;
  fields: Field[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateRequestTypeInput = Omit<RequestType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequestTypeInput = Partial<Omit<RequestType, 'id' | 'createdAt'>>;

