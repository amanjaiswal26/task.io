import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Switch,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiMoreVertical,
  FiUser,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser,
  clearError 
} from '../../store/slices/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { users, loading, error, pagination } = useSelector((state) => state.admin);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true
  });

  useEffect(() => {
    dispatch(getAllUsers({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    onOpen();
  };

  const handleUpdateUser = async () => {
    try {
      await dispatch(updateUser({ userId: editingUser._id, userData: formData })).unwrap();
      toast({
        title: 'Success',
        description: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setEditingUser(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md" color="gray.800">
            User Management
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Total: {pagination.total} users
          </Text>
        </Flex>

        {/* Search */}
        <InputGroup maxW="400px">
          <InputLeftElement color="gray.400">
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            borderRadius="lg"
          />
        </InputGroup>

        {/* Users Table */}
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last Login</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <HStack spacing={3}>
                      <Box
                        w={8}
                        h={8}
                        bg="brand.500"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="white" fontSize="xs" fontWeight="bold">
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <Text fontWeight="medium">{user.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {user.email}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.role === 'admin' ? 'purple' : 'blue'}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.isActive ? 'green' : 'red'}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(user.createdAt)}
                    </Text>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit User
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={() => handleDeleteUser(user._id)}
                          color="red.600"
                        >
                          Delete User
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Flex justify="center" align="center" gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text fontSize="sm" color="gray.600">
              Page {currentPage} of {pagination.totalPages}
            </Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>

      {/* Edit User Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Active Status</FormLabel>
                <Switch
                  isChecked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleUpdateUser}>
              Update User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;
