
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
