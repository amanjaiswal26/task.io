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
  useToast,
  Flex,
  Spinner,
  Center,
  Avatar,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiUser,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import { 
  getAllTasks,
  clearError 
} from '../../store/slices/adminSlice';

const TaskManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { tasks, loading, error, pagination } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = {
      page: currentPage,
      ...(statusFilter && { status: statusFilter }),
      ...(priorityFilter && { priority: priorityFilter })
    };
    dispatch(getAllTasks(params));
  }, [dispatch, currentPage, statusFilter, priorityFilter]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
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
            Task Management
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Total: {pagination.total} tasks
          </Text>
        </Flex>

        {/* Filters */}
        <HStack spacing={4} wrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement color="gray.400">
              <FiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              borderRadius="lg"
            />
          </InputGroup>
          
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            width="200px"
            borderRadius="lg"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
          
          <Select
            placeholder="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            width="200px"
            borderRadius="lg"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </HStack>

        {/* Tasks Table */}
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Task</Th>
                <Th>User</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
                <Th>Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task._id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium" fontSize="sm">
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text fontSize="xs" color="gray.600" noOfLines={1}>
                          {task.description}
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Avatar
                        size="xs"
                        name={task.user?.name}
                        bg="brand.500"
                        color="white"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {task.user?.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {task.user?.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={getPriorityColor(task.priority)}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {task.priority}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={getStatusColor(task.status)}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {task.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(task.dueDate)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(task.createdAt)}
                    </Text>
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
    </Box>
  );
};

export default TaskManagement;
