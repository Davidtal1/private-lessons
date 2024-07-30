import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('lessondate'); // Default sorting by lesson date
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [originalRows, setOriginalRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    name: ''
  });

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
    filterAndSortRows();
  }, [originalRows, order, orderBy, filters]);

  const filterAndSortRows = () => {
    const filteredRows = originalRows.filter(row => {
      if (!filters.month && !filters.year && !filters.name) return true;
      const lessonDate = new Date(row.lessondate);
      const filterDate = new Date(`${filters.year}-${filters.month}-01`);
      const matchesMonth = !filters.month || lessonDate.getMonth() === filterDate.getMonth();
      const matchesYear = !filters.year || lessonDate.getFullYear() === filterDate.getFullYear();
      const matchesName = !filters.name || row.name.toLowerCase().includes(filters.name.toLowerCase());
      return matchesMonth && matchesYear && matchesName;
    });

    const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
    setRows(sortedRows);
  };

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

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/update_lesson/${rows[editableRow]._id}`, editData);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <FilterFields filters={filters} onFilterChange={handleFilterChange} />
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

const FilterFields = ({ filters, onFilterChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
    <TextField
      label="Filter by Name"
      name="name"
      value={filters.name}
      onChange={onFilterChange}
      sx={{ m: 2, width: 200 }}
    />
    <TextField
      label="Filter by Month"
      name="month"
      value={filters.month}
      onChange={onFilterChange}
      type="number"
      inputProps={{ min: 1, max: 12, step: 1 }}
      sx={{ m: 2, width: 200 }}
    />
    <TextField
      label="Filter by Year"
      name="year"
      value={filters.year}
      onChange={onFilterChange}
      type="number"
      inputProps={{ min: 1900, max: new Date().getFullYear() }}
      sx={{ m: 2, width: 200 }}
    />
  </div>
);

FilterFields.propTypes = {
  filters: PropTypes.shape({
    month: PropTypes.string,
    year: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default EnhancedTable;
