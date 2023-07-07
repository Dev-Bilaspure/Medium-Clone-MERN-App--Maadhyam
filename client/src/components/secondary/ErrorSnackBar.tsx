import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const ErrorSnackBar = ({open, handleClose, message}) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackBar