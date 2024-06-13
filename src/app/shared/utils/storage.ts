import { EncryptStorage } from 'encrypt-storage';

export const encryptStorage = new EncryptStorage('MSOPALZM@N', {
  storageType: 'sessionStorage',
  stateManagementUse: true,
});
