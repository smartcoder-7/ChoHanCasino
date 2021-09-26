import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import notifier from '../../../lib/utils/notifier';

function Notifier() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    notifier.setNotifier(enqueueSnackbar);
  }, []);

  return null;
}

export default Notifier;
