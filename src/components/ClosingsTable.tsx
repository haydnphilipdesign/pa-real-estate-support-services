import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Closing {
  id: string;
  mlsNumber: string;
  propertyAddress: string;
  clientNames: string;
  submissionDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ClosingsTableProps {
  closings: Closing[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: Closing['status']) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Closing['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const ClosingsTable: React.FC<ClosingsTableProps> = ({
  closings,
  onEdit,
  onView,
  onDelete,
}) => {
  if (closings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No closings found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="closings table">
        <TableHead>
          <TableRow>
            <TableCell>MLS Number</TableCell>
            <TableCell>Property Address</TableCell>
            <TableCell>Client Names</TableCell>
            <TableCell>Submission Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {closings.map((closing) => (
            <TableRow
              key={closing.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {closing.mlsNumber}
              </TableCell>
              <TableCell>{closing.propertyAddress}</TableCell>
              <TableCell>{closing.clientNames}</TableCell>
              <TableCell>{closing.submissionDate}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(closing.status)}
                  color={getStatusColor(closing.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="view"
                  size="small"
                  onClick={() => onView(closing.id)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={() => onEdit(closing.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => onDelete(closing.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClosingsTable; 