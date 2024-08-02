import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  Paper,
  TextField,
  TablePagination
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
  const [originalRows, setOriginalRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_lessons');
        setOriginalRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredRows = originalRows.filter(row => {
      if (!monthFilter && !yearFilter && !nameFilter) return true;
      const lessonDate = new Date(row.lessondate);
      const filterDate = new Date(`${yearFilter}-${monthFilter}-01`);
      const matchesMonth = !monthFilter || lessonDate.getMonth() === filterDate.getMonth();
      const matchesYear = !yearFilter || lessonDate.getFullYear() === filterDate.getFullYear();
      const matchesName = !nameFilter || row.name.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesMonth && matchesYear && matchesName;
    });

    const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
    setRows(sortedRows);
  }, [originalRows, order, orderBy, nameFilter, monthFilter, yearFilter]);

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
    setPage(0);
  };

  const handleEditClick = (index) => {
    setEditableRow(index);
    setEditData({ ...paginatedRows[index] });
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
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <EnhancedTableBody
            rows={paginatedRows}
            editableRow={editableRow}
            editData={editData}
            handleEditClick={handleEditClick}
            handleInputChange={handleInputChange}
            handleSaveChanges={handleSaveChanges}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
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

export default EnhancedTable;