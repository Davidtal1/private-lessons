import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price for lesson' },
  { id: 'payment', label: 'Pay in this lesson' },
  { id: 'lessondate', label: 'Lesson Date' },
  { id: 'date', label: 'Date of payment' },
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
  const [rows, setRows] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_lessons');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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
    const globalIndex = page * rowsPerPage + index;
    setEditableRow(globalIndex);
    setEditData({ ...rows[globalIndex] });
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/update_lesson/${editData._id}`, editData);
      const updatedRows = rows.map((row, index) =>
        index === editableRow ? { ...editData } : row
      );
      setRows(updatedRows);
      setEditableRow(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
                if (!monthFilter && !yearFilter) return true;
                const lessonDate = new Date(row.lessondate);
                const lessonMonth = lessonDate.getMonth() + 1; 
                const lessonYear = lessonDate.getFullYear();
                const paymentDate = new Date(row.date);
                const paymentMonth = paymentDate.getMonth() + 1; 
                const paymentYear = paymentDate.getFullYear();

                return (yearFilter && (lessonYear === Number(yearFilter) || paymentYear === Number(yearFilter))) && 
                       (monthFilter && (lessonMonth === Number(monthFilter) || paymentMonth === Number(monthFilter)));
              }),
              getComparator(order, orderBy)
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isRowEditable = editableRow === (page * rowsPerPage + index);
                return (
                  <TableRow hover key={index}>
                    <TableCell>
                      {isRowEditable ? (
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
                      {isRowEditable ? (
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
                      {isRowEditable ? (
                        <TextField
                          name="payment"
                          type="number"
                          value={editData.payment}
                          onChange={handleInputChange}
                        />
                      ) : (
                        row.payment
                      )}
                    </TableCell>
                    <TableCell>
                      {isRowEditable ? (
                        <TextField
                          name="lessondate"
                          type="date"
                          value={editData.lessondate}
                          onChange={handleInputChange}
                        />
                      ) : (
                        row.lessondate
                      )}
                    </TableCell>
                    <TableCell>
                      {isRowEditable ? (
                        <TextField
                          name="date"
                          type="date"
                          value={editData.date}
                          onChange={handleInputChange}
                        />
                      ) : (
                        row.date
                      )}
                    </TableCell>
                    <TableCell>
                      {isRowEditable ? (
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
                      {isRowEditable ? (
                        <Button onClick={handleSaveChanges}>Save</Button>
                      ) : (
                        <Button onClick={() => handleEditClick(index)}>Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
