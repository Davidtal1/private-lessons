import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Button,
  Checkbox
} from '@mui/material';

function createData(name, price, pay, lessonDate, paymentDate, reception) {
  return { name, price, pay, lessonDate, paymentDate, reception };
}

const initialRows = [
  createData('Lesson 1', 10, 5, '2023-01-01', '2023-01-05', true),
  createData('Lesson 2', 15, 7, '2023-02-01', '2023-02-05', false),
  createData('Lesson 3', 10, 5, '2024-01-01', '2023-01-05', true),
  createData('Lesson 4', 15, 7, '2023-04-01', '2023-02-05', false),
  createData('Lesson 5', 10, 5, '2023-07-01', '2023-01-05', true),
  createData('Lesson 6', 15, 7, '2023-02-08', '2023-02-05', false),
  // Add more rows as needed
];

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price for lesson' },
  { id: 'pay', label: 'Pay in this lesson' },
  { id: 'lessonDate', label: 'Lesson Date' },
  { id: 'paymentDate', label: 'Date of payment' },
  { id: 'reception', label: 'Reception' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState(initialRows);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (index) => {
    setEditableRow(index);
    setEditData({ ...rows[index] });
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveChanges = () => {
    const updatedRows = rows.map((row, index) =>
      index === editableRow ? { ...editData } : row
    );
    setRows(updatedRows);
    setEditableRow(null);
    setEditData({});
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TextField
        label="Filter by Month"
        value={monthFilter}
        onChange={(e) => setMonthFilter(e.target.value)}
        sx={{ m: 2 }}
        type='number'
      />
      <TextField
        label="Filter by Year"
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
        sx={{ m: 2 }}
        type='number'
      />
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(
              rows.filter(row => {
                if (!monthFilter) return true;
                // const lessonDate = row.lessonDate;
                // const filterDate = new Date(yearFilter,monthFilter);
                // console.log(filterDate);
                // return lessonDate.getFullYear() === filterDate.getFullYear() &&
                //       lessonDate.getMonth() === filterDate.getMonth();


                const date = new Date(row.lessonDate);
                const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
                const year = date.getFullYear();
                return year === Number(yearFilter) && month === Number(monthFilter);
              }),
              getComparator(order, orderBy)
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    {editableRow === index ? (
                      <TextField
                        name="name"
                        value={editData.name}
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
                        value={editData.price}
                        onChange={handleInputChange}
                      />
                    ) : (
                      row.price
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === index ? (
                      <TextField
                        name="pay"
                        type="number"
                        value={editData.pay}
                        onChange={handleInputChange}
                      />
                    ) : (
                      row.pay
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === index ? (
                      <TextField
                        name="lessonDate"
                        type="date"
                        value={editData.lessonDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      row.lessonDate
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === index ? (
                      <TextField
                        name="paymentDate"
                        type="date"
                        value={editData.paymentDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      row.paymentDate
                    )}
                  </TableCell>
                  <TableCell>
                    {editableRow === index ? (
                      <Checkbox
                        name="reception"
                        checked={editData.reception}
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
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
