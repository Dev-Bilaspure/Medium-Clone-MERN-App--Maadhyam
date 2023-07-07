import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SuccessSnackBar = ({open, handleClose, message}) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SuccessSnackBar