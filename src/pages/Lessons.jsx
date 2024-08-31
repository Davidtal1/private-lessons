import React, { useState, useEffect } from 'react';
import { Paper, TextField, TableContainer, Table, TablePagination } from '@mui/material';
import axios from 'axios';
import EnhancedTableHead from '../components/EnhancedTableHead';
import EnhancedTableBody from '../components/EnhancedTableBody';
import { stableSort, getComparator } from '../components/sortingUtils';
import dayjs from 'dayjs';
import Filters from '../components/Filters';

const EnhancedTable = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('lesson_date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
        const response = await axios.get('http://localhost:5000/lessons');
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

  const handleCancelClick = () => {
    setEditableRow(null);
    setEditData({});
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
      const formattedData = {
        ...editData,
        lesson_date: editData.lesson_date ? new Date(dayjs(editData.lesson_date).format('YYYY-MM-DD')) : null,
        payment_date: editData.payment_date ? new Date(dayjs(editData.payment_date).format('YYYY-MM-DD')) : null,
      };
      await axios.put(`http://localhost:5000/lessons/${paginatedRows[editableRow]._id}`, formattedData);
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
      <Filters
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />
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
            handleCancelClick={handleCancelClick}
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
};

export default EnhancedTable;
