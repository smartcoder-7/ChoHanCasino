import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

import logger from './logger';

type NotifierType = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined,
) => SnackbarKey;

class Notifier {
  notify: NotifierType | null = null;

  setNotifier = (notify: NotifierType) => {
    this.notify = notify;
  };

  _notify = (msg: string, options: Record<string, string>) => {
    if (typeof this.notify !== 'function') {
      logger.warn('Notifier is not initialized');
      return;
    }

    this.notify(msg, options);
  };

  error = (msg: string, options = {}) => {
    this._notify(msg, {
      ...options,
      variant: 'error',
    });
  };

  success = (msg: string, options = {}) => {
    this._notify(msg, {
      ...options,
      variant: 'success',
    });
  };

  info = (msg: string, options = {}) => {
    this._notify(msg, {
      ...options,
      variant: 'info',
    });
  };

  warn = (msg: string, options = {}) => {
    this._notify(msg, {
      ...options,
      variant: 'warning',
    });
  };
}

export default new Notifier();
