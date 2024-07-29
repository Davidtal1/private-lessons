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
  { id: 'lessonDate', label: 'Lesson Date' },
  { id: 'date', label: 'Date of payment' },
  { id: 'payment_method', label: 'Method pay' },
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
  const [originalRows, setOriginalRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_lessons');
        setOriginalRows(response.data); // Store the original data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Compute filtered and sorted data based on current state
    const filteredRows = originalRows.filter(row => {
      if (!monthFilter && !yearFilter) return true;
      const lessonDate = new Date(row.lessondate);
      const filterDate = new Date(`${yearFilter}-${monthFilter}-01`);
      const matchesMonth = !monthFilter || lessonDate.getMonth() === filterDate.getMonth();
      const matchesYear = !yearFilter || lessonDate.getFullYear() === filterDate.getFullYear();
      return matchesMonth && matchesYear;
    });

    const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
    setRows(sortedRows);
  }, [originalRows, order, orderBy, monthFilter, yearFilter]);

  // Slice the rows for pagination
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleEditClick = (index) => {
    console.log(rows)
    setEditableRow(index);
    setEditData({ ...paginatedRows[index] }); // Sync editData with displayed row
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
      await axios.put(`http://localhost:5000/update_lesson/${paginatedRows[editableRow]._id}`, editData);
  
      // Update rows with the new data
      const updatedRows = rows.map((row, index) =>
        index === editableRow ? { ...editData } : row
      );
      setOriginalRows(updatedRows);
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
        sx={{ m: 2, width: 200}}
        type='number'
        inputProps={{ min: 1, max: 12, step: 1 }} // Restrict month filter input
      />
      <TextField
        label="Filter by Year"
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
        sx={{ m: 2 , width: 200}}
        type='number'
        inputProps={{ min: 1900, max: new Date().getFullYear() }} // Restrict year filter input
      />
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
         <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow hover key={row._id}> {/* Use row._id as key */}
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
