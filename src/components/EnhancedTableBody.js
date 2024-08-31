import React from 'react';
import { TableBody, TableRow, TableCell, Button, Box, Checkbox } from '@mui/material';
import { ROW_COLORS } from '../constants';
import { formatDate } from '../utils';
import {
  EditableTextCell,
  EditableDateCell,
  EditableSelectCell,
  EditableCheckbox
} from './EditableCells';

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
      {rows.map((row, index) => {
        const isEditable = editableRow === index;
        const isChecked = row.reception;

        return (
          <TableRow
            hover
            key={row._id}
            sx={{
              backgroundColor: index % 2 === 0 ? ROW_COLORS.even : ROW_COLORS.odd,
              '&:hover': {
                backgroundColor: ROW_COLORS.hover
              },
              
              textDecoration: isChecked ? `line-through ${ROW_COLORS.strikethrough} 1.5px` : 'none' // Apply line-through if reception is checked
            }}
          >
            <TableCell>
              {isEditable ? (
                <EditableTextCell name="name" value={editData.name} onChange={handleInputChange} />
              ) : (
                row.name
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableTextCell name="price" value={editData.price} onChange={handleInputChange} type="number" />
              ) : (
                row.price
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableTextCell name="payment" value={editData.payment} onChange={handleInputChange} type="number" />
              ) : (
                row.payment
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableDateCell name="lesson_date" value={editData.lesson_date} onChange={handleInputChange} />
              ) : (
                formatDate(row.lesson_date)
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableDateCell name="payment_date" value={editData.payment_date} onChange={handleInputChange} />
              ) : (
                row.payment_date ? formatDate(row.payment_date) : ''
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableSelectCell name="payment_method" value={editData.payment_method} onChange={handleInputChange} />
              ) : (
                row.payment_method
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
                <EditableCheckbox name="reception" checked={editData.reception} onChange={handleInputChange} />
              ) : (
                <Checkbox checked={row.reception} disabled />
              )}
            </TableCell>
            <TableCell>
              {isEditable ? (
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
        );
      })}
    </TableBody>
  );
};

export default EnhancedTableBody;
