import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import EnhancedTableHead from '../components/EnhancedTableHead';
import EnhancedTableBody from '../components/EnhancedTableBody';
import { stableSort, getComparator } from '../components/sortingUtils';

const EnhancedTable = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lessondate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const fetchData = async (page, rowsPerPage) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/get_lessons', {
        params: {
          page,
          rowsPerPage,
          monthFilter,
          yearFilter,
          nameFilter,
        },
      });
      setRows(response.data.rows);
      setTotalRows(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage, monthFilter, yearFilter, nameFilter]);

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

  const handleCancelEdit = () => {
    setEditableRow(null);
    setEditData({});
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/update_lesson/${rows[editableRow]._id}`, editData);
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

  const sortedRows = stableSort(rows, getComparator(order, orderBy));

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
        <TextField
          label="Filter by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{ m: 2, width: 200 }}
        />
        <TextField
          label="Filter by Month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          sx={{ m: 2, width: 200 }}
          type='number'
          inputProps={{ min: 1, max: 12, step: 1 }}
        />
        <TextField
          label="Filter by Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          sx={{ m: 2, width: 200 }}
          type='number'
          inputProps={{ min: 1900, max: new Date().getFullYear() }}
        />
      </div>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <EnhancedTableBody
              rows={sortedRows}
              editableRow={editableRow}
              editData={editData}
              handleEditClick={handleEditClick}
              handleInputChange={handleInputChange}
              handleSaveChanges={handleSaveChanges}
            />
          </Table>
        </TableContainer>
      )}
      {editableRow !== null && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleCancelEdit} variant="contained" color="secondary">
            Cancel
          </Button>
        </Box>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EnhancedTable;
