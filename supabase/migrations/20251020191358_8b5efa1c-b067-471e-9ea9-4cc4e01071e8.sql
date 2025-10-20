-- Create financial module tables

-- Transaction types enum
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');

-- Payment types enum
CREATE TYPE payment_type AS ENUM ('UNICO', 'PARCELADO', 'RECORRENTE');

-- Transaction status enum
CREATE TYPE transaction_status AS ENUM ('PAID', 'PENDING', 'OVERDUE', 'CANCELLED');

-- Financial accounts (bank accounts, cash boxes)
CREATE TABLE financial_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  initial_balance DECIMAL(15,2) DEFAULT 0,
  current_balance DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial categories
CREATE TABLE financial_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type transaction_type NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial contacts (suppliers, customers)
CREATE TABLE financial_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  phone2 VARCHAR(20),
  document VARCHAR(50),
  address TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cost centers
CREATE TABLE cost_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial transactions
CREATE TABLE financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  transaction_date DATE NOT NULL,
  due_date DATE,
  competency_date DATE,
  status transaction_status DEFAULT 'PENDING',
  payment_type payment_type DEFAULT 'UNICO',
  document_number VARCHAR(50),
  notes TEXT,
  
  -- Foreign keys
  account_id UUID REFERENCES financial_accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES financial_categories(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES financial_contacts(id) ON DELETE SET NULL,
  cost_center_id UUID REFERENCES cost_centers(id) ON DELETE SET NULL,
  
  -- Recurring/installment info
  parent_transaction_id UUID REFERENCES financial_transactions(id) ON DELETE CASCADE,
  installment_number INTEGER,
  total_installments INTEGER,
  
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transaction attachments
CREATE TABLE transaction_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES financial_transactions(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_accounts
CREATE POLICY "Users can view accounts in their church"
  ON financial_accounts FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage accounts"
  ON financial_accounts FOR ALL
  USING (
    church_id = get_user_church_id(auth.uid()) 
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for financial_categories
CREATE POLICY "Users can view categories in their church"
  ON financial_categories FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage categories"
  ON financial_categories FOR ALL
  USING (
    church_id = get_user_church_id(auth.uid()) 
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for financial_contacts
CREATE POLICY "Users can view contacts in their church"
  ON financial_contacts FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage contacts"
  ON financial_contacts FOR ALL
  USING (
    church_id = get_user_church_id(auth.uid()) 
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for cost_centers
CREATE POLICY "Users can view cost centers in their church"
  ON cost_centers FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage cost centers"
  ON cost_centers FOR ALL
  USING (
    church_id = get_user_church_id(auth.uid()) 
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for financial_transactions
CREATE POLICY "Users can view transactions in their church"
  ON financial_transactions FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage transactions"
  ON financial_transactions FOR ALL
  USING (
    church_id = get_user_church_id(auth.uid()) 
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for transaction_attachments
CREATE POLICY "Users can view attachments in their church"
  ON transaction_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM financial_transactions
      WHERE financial_transactions.id = transaction_attachments.transaction_id
      AND financial_transactions.church_id = get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can manage attachments"
  ON transaction_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM financial_transactions
      WHERE financial_transactions.id = transaction_attachments.transaction_id
      AND financial_transactions.church_id = get_user_church_id(auth.uid())
    )
    AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- Create indexes for better performance
CREATE INDEX idx_financial_accounts_church ON financial_accounts(church_id);
CREATE INDEX idx_financial_categories_church ON financial_categories(church_id);
CREATE INDEX idx_financial_contacts_church ON financial_contacts(church_id);
CREATE INDEX idx_cost_centers_church ON cost_centers(church_id);
CREATE INDEX idx_transactions_church ON financial_transactions(church_id);
CREATE INDEX idx_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_transactions_type ON financial_transactions(type);
CREATE INDEX idx_transactions_status ON financial_transactions(status);

-- Create triggers for updated_at
CREATE TRIGGER update_financial_accounts_updated_at
  BEFORE UPDATE ON financial_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_categories_updated_at
  BEFORE UPDATE ON financial_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_contacts_updated_at
  BEFORE UPDATE ON financial_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_centers_updated_at
  BEFORE UPDATE ON cost_centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();