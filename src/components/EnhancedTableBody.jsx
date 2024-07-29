import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox
} from '@mui/material';

const EnhancedTableBody = ({
  rows,
  editableRow,
  editData,
  handleEditClick,
  handleInputChange,
  handleSaveChanges
}) => {
  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow hover key={row._id}>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="name"
                value={editData.name || ''}
                onChange={handleInputChange}
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
              />
            ) : (
              row.payment
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="lessondate"
                type="date"
                value={editData.lessondate || ''}
                onChange={handleInputChange}
              />
            ) : (
              row.lessondate
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="date"
                type="date"
                value={editData.date || ''}
                onChange={handleInputChange}
              />
            ) : (
              row.date
            )}
          </TableCell>
          <TableCell>
            {editableRow === index ? (
              <TextField
                name="payment_method"
                value={editData.payment_method || ''}
                onChange={handleInputChange}
              />
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
              <Button onClick={handleSaveChanges}>Save</Button>
            ) : (
              <Button onClick={() => handleEditClick(index)}>Edit</Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default EnhancedTableBody;
