import { createClient } from '@/lib/supabase/client';

import { normalizeEmail } from '@/lib/email';

export { normalizeEmail };

export interface Investor {
  id: string;
  userId: string;
  investorId: string;
  certificateNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountStatus: string;
  joinDate: string;
  round: string;
  originalInvestment: number;
  originalStakePrice: number;
  originalStakesPurchased: number;
  additionalStakesPurchased: number;
  currentStakesOwned: number;
  stakesSold: number;
  stakesTransferred: number;
  stakesRepurchased: number;
  ownershipPercentage: number;
  beneficiaryName: string;
  beneficiaryRelationship: string;
  beneficiaryEmail: string;
  beneficiaryPhone: string;
  beneficiaryAddress: string;
  beneficiaryUpdatedAt: string;
  creatorProgramStatus: boolean;
  creatorBrandApproach: string;
  creatorWebsiteStatus: string;
  creatorAffiliateStatus: string;
  creatorAiContentStatus: string;
  creatorSocialPlatforms: number;
  creator90dayStart: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StakeTransaction {
  id: string;
  investorId: string;
  transactionType: string;
  numberOfStakes: number;
  pricePerStake: number;
  grossAmount: number;
  transactionDate: string;
  round: string;
  notes: string;
  createdAt: string;
}

export interface InvestorDocument {
  id: string;
  investorId: string;
  documentType: string;
  documentTitle: string;
  fileUrl: string;
  uploadDate: string;
  visibility: string;
  isGlobal: boolean;
}

export interface InvestorReport {
  id: string;
  title: string;
  quarter: string;
  year: number;
  fileUrl: string;
  datePublished: string;
  audience: string;
}

export interface InvestorUpdate {
  id: string;
  title: string;
  thumbnailUrl: string;
  shortDescription: string;
  fullContent: string;
  category: string;
  publishDate: string;
  audience: string;
  isPublished: boolean;
  createdAt: string;
}

export interface HotlineSettings {
  id: string;
  phoneNumber: string;
  hours: string;
}

export interface WelcomeKit {
  id: string;
  fileUrl: string;
  title: string;
  updatedAt: string;
}

function mapInvestor(row: any): Investor {
  return {
    id: row.id,
    userId: row.user_id,
    investorId: row.investor_id,
    certificateNumber: row.certificate_number,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || '',
    accountStatus: row.account_status,
    joinDate: row.join_date,
    round: row.round,
    originalInvestment: Number(row.original_investment),
    originalStakePrice: Number(row.original_stake_price),
    originalStakesPurchased: Number(row.original_stakes_purchased),
    additionalStakesPurchased: Number(row.additional_stakes_purchased),
    currentStakesOwned: Number(row.current_stakes_owned),
    stakesSold: Number(row.stakes_sold),
    stakesTransferred: Number(row.stakes_transferred),
    stakesRepurchased: Number(row.stakes_repurchased),
    ownershipPercentage: Number(row.ownership_percentage),
    beneficiaryName: row.beneficiary_name || '',
    beneficiaryRelationship: row.beneficiary_relationship || '',
    beneficiaryEmail: row.beneficiary_email || '',
    beneficiaryPhone: row.beneficiary_phone || '',
    beneficiaryAddress: row.beneficiary_address || '',
    beneficiaryUpdatedAt: row.beneficiary_updated_at || '',
    creatorProgramStatus: row.creator_program_status || false,
    creatorBrandApproach: row.creator_brand_approach || '',
    creatorWebsiteStatus: row.creator_website_status || '',
    creatorAffiliateStatus: row.creator_affiliate_status || '',
    creatorAiContentStatus: row.creator_ai_content_status || '',
    creatorSocialPlatforms: row.creator_social_platforms || 0,
    creator90dayStart: row.creator_90day_start || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTransaction(row: any): StakeTransaction {
  return {
    id: row.id,
    investorId: row.investor_id,
    transactionType: row.transaction_type,
    numberOfStakes: Number(row.number_of_stakes),
    pricePerStake: Number(row.price_per_stake),
    grossAmount: Number(row.gross_amount),
    transactionDate: row.transaction_date,
    round: row.round || '',
    notes: row.notes || '',
    createdAt: row.created_at,
  };
}

export const investorService = {
  async getMyInvestorProfile(): Promise<Investor | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) { console.error('getMyInvestorProfile error:', error.message); return null; }
    return data ? mapInvestor(data) : null;
  },

  async getMyTransactions(): Promise<StakeTransaction[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stake_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    if (error) { console.error('getMyTransactions error:', error.message); return []; }
    return (data || []).map(mapTransaction);
  },

  async getMyDocuments(): Promise<InvestorDocument[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('investor_documents')
      .select('*')
      .order('upload_date', { ascending: false });
    if (error) { console.error('getMyDocuments error:', error.message); return []; }
    return (data || []).map((row: any) => ({
      id: row.id,
      investorId: row.investor_id,
      documentType: row.document_type,
      documentTitle: row.document_title,
      fileUrl: row.file_url || '',
      uploadDate: row.upload_date,
      visibility: row.visibility,
      isGlobal: row.is_global,
    }));
  },

  async getReports(): Promise<InvestorReport[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('investor_reports')
      .select('*')
      .order('date_published', { ascending: false });
    if (error) { console.error('getReports error:', error.message); return []; }
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      quarter: row.quarter || '',
      year: row.year,
      fileUrl: row.file_url || '',
      datePublished: row.date_published,
      audience: row.audience,
    }));
  },

  async getUpdates(): Promise<InvestorUpdate[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('investor_updates')
      .select('*')
      .eq('is_published', true)
      .order('publish_date', { ascending: false });
    if (error) { console.error('getUpdates error:', error.message); return []; }
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      thumbnailUrl: row.thumbnail_url || '',
      shortDescription: row.short_description || '',
      fullContent: row.full_content || '',
      category: row.category,
      publishDate: row.publish_date,
      audience: row.audience,
      isPublished: row.is_published,
      createdAt: row.created_at,
    }));
  },

  async getHotlineSettings(): Promise<HotlineSettings | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('hotline_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) { console.error('getHotlineSettings error:', error.message); return null; }
    return data ? { id: data.id, phoneNumber: data.phone_number, hours: data.hours } : null;
  },

  async getWelcomeKit(): Promise<WelcomeKit | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('welcome_kit')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) { console.error('getWelcomeKit error:', error.message); return null; }
    return data ? { id: data.id, fileUrl: data.file_url, title: data.title, updatedAt: data.updated_at } : null;
  },

  async updateBeneficiary(investorId: string, beneficiaryData: {
    beneficiaryName: string;
    beneficiaryRelationship: string;
    beneficiaryEmail: string;
    beneficiaryPhone: string;
    beneficiaryAddress: string;
  }): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('investors')
      .update({
        beneficiary_name: beneficiaryData.beneficiaryName,
        beneficiary_relationship: beneficiaryData.beneficiaryRelationship,
        beneficiary_email: beneficiaryData.beneficiaryEmail,
        beneficiary_phone: beneficiaryData.beneficiaryPhone,
        beneficiary_address: beneficiaryData.beneficiaryAddress,
        beneficiary_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', investorId);
    if (error) { console.error('updateBeneficiary error:', error.message); return false; }
    return true;
  },

  async updateInvestorContact(investorId: string, data: { phone?: string }): Promise<boolean> {
    const supabase = createClient();
    const updates: any = { updated_at: new Date().toISOString() };
    if (data.phone !== undefined) updates.phone = data.phone;
    const { error } = await supabase.from('investors').update(updates).eq('id', investorId);
    if (error) { console.error('updateInvestorContact error:', error.message); return false; }
    return true;
  },
};

export const adminService = {
  async getAllInvestors(): Promise<Investor[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .order('investor_id', { ascending: true });
    if (error) { console.error('getAllInvestors error:', error.message); return []; }
    return (data || []).map(mapInvestor);
  },

  async getInvestorById(id: string): Promise<Investor | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) { console.error('getInvestorById error:', error.message); return null; }
    return data ? mapInvestor(data) : null;
  },

  /**
   * Creates the investor's login and links it to their record. Runs server-side
   * so the service-role key (if configured) stays off the client.
   */
  async createInvestorAccount(
    investorRowId: string,
    email: string,
    password?: string
  ): Promise<{ ok: boolean; error?: string; mustSetOwnPassword?: boolean }> {
    try {
      const res = await fetch('/api/admin/investors/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorRowId, email: normalizeEmail(email), password: password || undefined }),
      });
      const body = await res.json();
      if (!res.ok) return { ok: false, error: body?.error || 'Could not create the login.' };
      return { ok: true, mustSetOwnPassword: body?.mustSetOwnPassword };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Network error.' };
    }
  },

  /** Emails a password-reset link that lands on the investor's settings page. */
  async sendPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/investor/settings')}`;
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), { redirectTo });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  async createInvestor(investorData: Partial<Investor>): Promise<Investor | null> {
    const supabase = createClient();
    const { data: idData } = await supabase.rpc('generate_investor_id');
    const { data: certData } = await supabase.rpc('generate_certificate_number');
    const { data, error } = await supabase
      .from('investors')
      .insert({
        investor_id: idData,
        certificate_number: certData,
        first_name: investorData.firstName,
        last_name: investorData.lastName,
        email: normalizeEmail(investorData.email),
        phone: investorData.phone,
        round: investorData.round || 'Phase 1',
        original_investment: investorData.originalInvestment || 0,
        original_stake_price: investorData.originalStakePrice || 0.01,
        original_stakes_purchased: investorData.originalStakesPurchased || 0,
        current_stakes_owned: investorData.currentStakesOwned || 0,
        join_date: investorData.joinDate || new Date().toISOString().split('T')[0],
        account_status: 'active',
      })
      .select()
      .single();
    if (error) { console.error('createInvestor error:', error.message); return null; }
    return mapInvestor(data);
  },

  async addTransaction(transaction: {
    investorId: string;
    transactionType: string;
    numberOfStakes: number;
    pricePerStake: number;
    grossAmount: number;
    transactionDate: string;
    round: string;
    notes: string;
  }): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('stake_transactions')
      .insert({
        investor_id: transaction.investorId,
        transaction_type: transaction.transactionType,
        number_of_stakes: transaction.numberOfStakes,
        price_per_stake: transaction.pricePerStake,
        gross_amount: transaction.grossAmount,
        transaction_date: transaction.transactionDate,
        round: transaction.round,
        notes: transaction.notes,
        created_by: user?.id,
      });
    if (error) { console.error('addTransaction error:', error.message); return false; }
    return true;
  },

  async getInvestorTransactions(investorId: string): Promise<StakeTransaction[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stake_transactions')
      .select('*')
      .eq('investor_id', investorId)
      .order('transaction_date', { ascending: false });
    if (error) { console.error('getInvestorTransactions error:', error.message); return []; }
    return (data || []).map(mapTransaction);
  },

  async updateInvestor(id: string, updates: Partial<Investor>): Promise<boolean> {
    const supabase = createClient();
    const dbUpdates: any = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.email !== undefined) dbUpdates.email = normalizeEmail(updates.email);
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.accountStatus !== undefined) dbUpdates.account_status = updates.accountStatus;
    if (updates.round !== undefined) dbUpdates.round = updates.round;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.creatorProgramStatus !== undefined) dbUpdates.creator_program_status = updates.creatorProgramStatus;
    dbUpdates.updated_at = new Date().toISOString();
    const { error } = await supabase.from('investors').update(dbUpdates).eq('id', id);
    if (error) { console.error('updateInvestor error:', error.message); return false; }
    return true;
  },

  async createAuditLog(action: string, investorId?: string, oldValue?: any, newValue?: any): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      admin_user_id: user?.id,
      action,
      investor_id: investorId || null,
      old_value: oldValue ? JSON.stringify(oldValue) : null,
      new_value: newValue ? JSON.stringify(newValue) : null,
    });
  },

  async getAuditLogs(): Promise<any[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) { console.error('getAuditLogs error:', error.message); return []; }
    return data || [];
  },

  async uploadDocument(doc: {
    investorId?: string;
    documentType: string;
    documentTitle: string;
    fileUrl: string;
    isGlobal?: boolean;
  }): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('investor_documents').insert({
      investor_id: doc.investorId || null,
      document_type: doc.documentType,
      document_title: doc.documentTitle,
      file_url: doc.fileUrl,
      uploaded_by: user?.id,
      is_global: doc.isGlobal || false,
    });
    if (error) { console.error('uploadDocument error:', error.message); return false; }
    return true;
  },

  async createReport(report: {
    title: string;
    quarter: string;
    year: number;
    fileUrl: string;
    datePublished: string;
    audience: string;
  }): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('investor_reports').insert({
      title: report.title,
      quarter: report.quarter,
      year: report.year,
      file_url: report.fileUrl,
      date_published: report.datePublished,
      audience: report.audience,
      published_by: user?.id,
    });
    if (error) { console.error('createReport error:', error.message); return false; }
    return true;
  },

  async createUpdate(update: {
    title: string;
    shortDescription: string;
    fullContent: string;
    category: string;
    publishDate: string;
    audience: string;
    sendSms: boolean;
    thumbnailUrl?: string;
  }): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('investor_updates').insert({
      title: update.title,
      short_description: update.shortDescription,
      full_content: update.fullContent,
      category: update.category,
      publish_date: update.publishDate,
      audience: update.audience,
      send_sms: update.sendSms,
      thumbnail_url: update.thumbnailUrl || null,
      published_by: user?.id,
      is_published: true,
    });
    if (error) { console.error('createUpdate error:', error.message); return false; }
    return true;
  },

  async updateHotlineSettings(phoneNumber: string, hours: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: existing } = await supabase.from('hotline_settings').select('id').limit(1).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('hotline_settings').update({
        phone_number: phoneNumber, hours, updated_by: user?.id, updated_at: new Date().toISOString(),
      }).eq('id', existing.id);
      if (error) { console.error('updateHotlineSettings error:', error.message); return false; }
    } else {
      const { error } = await supabase.from('hotline_settings').insert({
        phone_number: phoneNumber, hours, updated_by: user?.id,
      });
      if (error) { console.error('updateHotlineSettings error:', error.message); return false; }
    }
    return true;
  },

  async updateWelcomeKit(fileUrl: string, title: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: existing } = await supabase.from('welcome_kit').select('id').limit(1).maybeSingle();
    if (existing) {
      const { error } = await supabase.from('welcome_kit').update({
        file_url: fileUrl, title, updated_by: user?.id, updated_at: new Date().toISOString(),
      }).eq('id', existing.id);
      if (error) { console.error('updateWelcomeKit error:', error.message); return false; }
    } else {
      const { error } = await supabase.from('welcome_kit').insert({
        file_url: fileUrl, title, updated_by: user?.id,
      });
      if (error) { console.error('updateWelcomeKit error:', error.message); return false; }
    }
    return true;
  },
};
