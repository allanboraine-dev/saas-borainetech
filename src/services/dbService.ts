
import { supabase } from './supabaseClient';

export interface UserAccess {
  tool_id: string;
  access_type: 'TRIAL' | 'PAID';
}

/**
 * Fetches all tools the user has accessed (either via Trial or Payment)
 */
export const getUserAccess = async (userId: string): Promise<UserAccess[]> => {
  try {
    const { data, error } = await supabase
      .from('user_access')
      .select('tool_id, access_type')
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase Read Error:', error.message);
      return [];
    }
    return data as UserAccess[] || [];
  } catch (e) {
    console.warn('Database connection failed (getUserAccess):', e);
    return [];
  }
};

/**
 * Records that a user has used a Free Trial for a specific tool.
 */
export const recordTrialUsage = async (userId: string, toolId: string) => {
  try {
    const { error } = await supabase
      .from('user_access')
      .insert([
        { user_id: userId, tool_id: toolId, access_type: 'TRIAL' }
      ]);

    if (error) throw error;
  } catch (e) {
     console.error("Failed to record trial usage:", e);
     // We don't throw here to allow the frontend to continue optimistically if DB is down
  }
};

/**
 * Records a successful payment/unlock for a tool.
 */
export const recordPurchase = async (userId: string, toolId: string) => {
  try {
    const { error } = await supabase
      .from('user_access')
      .upsert([
          { user_id: userId, tool_id: toolId, access_type: 'PAID' }
      ], { onConflict: 'user_id, tool_id, access_type' }); 

    if (error) throw error;
  } catch (e) {
    console.error("Failed to record purchase:", e);
    throw e; // Re-throw to alert the user that license generation failed
  }
};
