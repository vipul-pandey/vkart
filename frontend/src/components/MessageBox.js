import { Alert } from '@mui/material';

const severityMap = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info',
};

export default function MessageBox(props) {
  const severity = severityMap[props.variant] || 'info';
  return <Alert severity={severity}>{props.children}</Alert>;
}
