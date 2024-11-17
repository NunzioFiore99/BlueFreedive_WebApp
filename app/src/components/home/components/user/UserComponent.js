import React, { useState, useEffect } from 'react';
import './UserComponent.css';
import { 
  Box, 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  OutlinedInput,
  Typography 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { retrieveUsers, deleteUser, updateUser, createUsers } from '../../../../services/UserClient';
import { useAuth } from '../../../../context/AuthContext';

const UserComponent = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', roles: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await retrieveUsers()
        const usersWithoutMe = response.filter(u => u.id !== user.id );
        setUsers(usersWithoutMe);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Update a user
  const handleUpdate = async () => {
    try {
      const body = {
        "username": editingUser.username,
        "email": editingUser.email,
        "password": editingUser.password,
        "roles": editingUser.roles
      };
      const response = await updateUser(editingUser.id, body);
      setUsers(users.map((user) => (user.id === response.id ? response : user)));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Add a new user
  const handleAddUser = async () => {
    try {
      const response = await createUsers([newUser]);
      setUsers([...users, response.users[0]]);
      setNewUser({ username: '', email: '', roles: [] });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const openEditDialog = (user) => {
    const userToUpdate = {
      "id": user.id,
      "username": user.username,
      "email": user.email,
      "password": user.password,
      "roles": [user.roles]
    }
    setEditingUser(userToUpdate);};

  const columns = [
    { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center', align: 'center', headerClassName: 'header-table' },
    {
      field: 'roles',
      headerName: 'Role',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header-table',
      valueGetter: (params) => (params.includes('ADMIN') ? 'Admin' : 'User'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header-table',
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => openEditDialog({ ...params.row, roles: params.row.roles[0] })}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, mt: 2 }}
        onClick={() => setIsDialogOpen(true)}
      >
        Add New User
      </Button>

      {/* DataGrid for displaying users */}
      <Box sx={{ height: 400, width: '100%', mb: 4 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
        />
      </Box>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={true} onClose={() => setEditingUser(null)}>
          <DialogTitle style={{ background: "lightBlue", fontWeight: "bold", marginBottom: "2rem" }}>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              value={editingUser.username}
              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Password"
              type="password"
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              fullWidth
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                input={<OutlinedInput label="Role" />}
                value={editingUser.roles}
                onChange={(e) => setEditingUser({ ...editingUser, roles: [e.target.value] })}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions style={{marginBottom: "1rem", paddingRight: "1rem"}}>
            <Button variant="outlined" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle style={{ background: "lightBlue", fontWeight: "bold", marginBottom: "2rem" }}>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              input={<OutlinedInput label="Role" />}
              value={newUser.roles[0] || ''}
              onChange={(e) => setNewUser({ ...newUser, roles: [e.target.value] })}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions style={{marginBottom: "1rem", paddingRight: "1rem"}}>
          <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserComponent;