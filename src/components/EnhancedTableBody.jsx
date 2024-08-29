import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { format } from 'date-fns';

const EnhancedTableBody = ({
  rows,
  editableRow,
  editData,
  handleEditClick,
  handleInputChange,
  handleSaveChanges,
  handleCancelClick
}) => {
  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          hover
          key={row._id}
          sx={{
            backgroundColor: index % 2 === 0 ? '#ede7f6' : '#ffffff', // Alternating row colors
            '&:hover': {
              backgroundColor: '#e0e0e0' // Highlight on hover
            }
          }}
        >
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="name"
                value={editData.name || ''}
                onChange={handleInputChange}
                sx={{ width: '110px' }}
              />
            ) : (
              row.name
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="price"
                type="number"
                value={editData.price || ''}
                onChange={handleInputChange}
                sx={{ width: '100%' }}
              />
            ) : (
              row.price
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="payment"
                type="number"
                value={editData.payment || ''}
                onChange={handleInputChange}
                sx={{ width: '100%' }}
              />
            ) : (
              row.payment
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="lesson_date"
                type="date"
                value={editData.lesson_date ? format(new Date(editData.lesson_date), 'yyyy-MM-dd') : null} 
                onChange={handleInputChange}
                sx={{ width: '100%' }}
              />
            ) : (
              format(new Date(row.lesson_date), 'yyyy-MM-dd')
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="payment_date"
                type="date"
                value={editData.payment_date ? format(new Date(editData.payment_date), 'yyyy-MM-dd') : null}
                onChange={handleInputChange}
                sx={{ width: '100%' }}
              />
            ) : (
              row.payment_date ? format(new Date(row.payment_date), 'yyyy-MM-dd') : null
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <Select
                name="payment_method"
                value={editData.payment_method || ''}
                onChange={handleInputChange}
                sx={{ width: '100%' }}
              >
                <MenuItem value="Bit">Bit</MenuItem>
                <MenuItem value="Paybox">Paybox</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="No payment">No payment</MenuItem>
              </Select>
            ) : (
              row.payment_method
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <Checkbox
                name="reception"
                checked={editData.reception || false}
                onChange={handleInputChange}
              />
            ) : (
              <Checkbox
                checked={row.reception}
                disabled
              />
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 'fit-content' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    sx={{ minWidth: 50 }}
                  >
                    Save
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancelClick}
                    sx={{ minWidth: 50 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleEditClick(index)}
              >
                Edit
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default EnhancedTableBody;
