
// Simulating a Payment Gateway for Boraine Tech
// In production, this would be replaced by a server-side integration with PayFast/PayStack/Yoco

export interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

export const processPayment = async (amount: number, email: string): Promise<TransactionResponse> => {
  return new Promise((resolve) => {
    // Simulate network latency
    setTimeout(() => {
      // Simulate random success/failure (mostly success for demo)
      const isSuccess = Math.random() > 0.05; 
      
      if (isSuccess) {
        resolve({
          success: true,
          transactionId: `TRX-${Math.floor(Math.random() * 1000000)}-ZAR`,
          message: "Payment authorized via PayStack Gateway."
        });
      } else {
        resolve({
          success: false,
          message: "Bank declined transaction. Please check 3D Secure."
        });
      }
    }, 2500);
  });
};
