export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateFileName = (fileName: string): boolean => {
  // Prevent path traversal
  return !fileName.includes('..');
};

export const isValidFileSize = (sizeInBytes: number): boolean => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5368709120');
  return sizeInBytes <= maxSize;
};

export const isAllowedFileType = (fileName: string): boolean => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf').split(',');
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};
