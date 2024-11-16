import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { retrieveUsers, deleteUser, updateUser, createUsers } from '../../../../services/UserClient';

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', roles: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await retrieveUsers();
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (userId) => {
    try {
        await deleteUser(userId)
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
            "roles": [editingUser.roles]
        }
        await updateUser(editingUser.id, body);
        setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
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

  const openEditDialog = (user) => setEditingUser(user);

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setIsDialogOpen(true)}
      >
        Add New User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles.includes('ADMIN') ? 'Admin' : 'User'}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => openEditDialog({ ...user, roles: user.roles[0] })}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={true} onClose={() => setEditingUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
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
                value={editingUser.roles}
                onChange={(e) => setEditingUser({ ...editingUser, roles: [e.target.value] })}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
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
              value={newUser.roles[0] || ''}
              onChange={(e) => setNewUser({ ...newUser, roles: [e.target.value] })}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserComponent;