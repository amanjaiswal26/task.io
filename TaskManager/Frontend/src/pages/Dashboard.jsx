import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  useDisclosure,
  Container,
  Grid,
  GridItem,
  Badge,
  Select,
  Spinner,
  Center,
  useToast,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import { fetchTasks } from '../store/slices/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });

  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleEditTask = (task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    onClose();
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    onOpen();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter((task) => task.priority === priority);
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

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const highPriority = tasks.filter(task => task.priority === 'High' && task.status === 'pending').length;
    
    return { total, completed, pending, highPriority };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" color="gray.800" fontWeight="bold" mb={2}>
              Welcome back, {user?.name}! 👋
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Here's what's happening with your tasks today
            </Text>
          </Box>

          {/* Stats Cards */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
            <Card>
              <CardBody>
                <Stat>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <StatLabel color="gray.600">Total Tasks</StatLabel>
                      <StatNumber color="gray.800">{stats.total}</StatNumber>
                    </Box>
                    <Icon as={FiTrendingUp} w={8} h={8} color="brand.500" />
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <StatLabel color="gray.600">Completed</StatLabel>
                      <StatNumber color="green.500">{stats.completed}</StatNumber>
                    </Box>
                    <Icon as={FiCheckCircle} w={8} h={8} color="green.500" />
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <StatLabel color="gray.600">Pending</StatLabel>
                      <StatNumber color="orange.500">{stats.pending}</StatNumber>
                    </Box>
                    <Icon as={FiClock} w={8} h={8} color="orange.500" />
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <Stat>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <StatLabel color="gray.600">High Priority</StatLabel>
                      <StatNumber color="red.500">{stats.highPriority}</StatNumber>
                    </Box>
                    <Icon as={FiTrendingUp} w={8} h={8} color="red.500" />
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Controls */}
          <Card>
            <CardBody>
              <Flex 
                direction={{ base: "column", md: "row" }} 
                align={{ base: "stretch", md: "center" }} 
                justify="space-between" 
                gap={4}
              >
                <HStack spacing={4} wrap="wrap">
                  <Select
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    width="200px"
                    borderRadius="lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Select>
                  <Select
                    placeholder="Filter by priority"
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    width="200px"
                    borderRadius="lg"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </HStack>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="brand"
                  onClick={handleCreateTask}
                  size="lg"
                  borderRadius="lg"
                  fontWeight="medium"
                >
                  Add New Task
                </Button>
              </Flex>
            </CardBody>
          </Card>

          {/* Task Columns */}
          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
            {['High', 'Medium', 'Low'].map((priority) => (
              <GridItem key={priority}>
                <Card h="fit-content">
                  <CardBody>
                    <VStack align="stretch" spacing={6}>
                      <HStack justify="space-between" align="center">
                        <Heading 
                          size="md" 
                          color={`${getPriorityColor(priority)}.500`}
                          fontWeight="bold"
                        >
                          {priority} Priority
                        </Heading>
                        <Badge
                          colorScheme={getPriorityColor(priority)}
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {getTasksByPriority(priority).length}
                        </Badge>
                      </HStack>
                      <VStack spacing={4} align="stretch" minH="200px">
                        {getTasksByPriority(priority).map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={handleEditTask}
                          />
                        ))}
                        {getTasksByPriority(priority).length === 0 && (
                          <Box
                            p={8}
                            border="2px dashed"
                            borderColor="gray.200"
                            borderRadius="xl"
                            textAlign="center"
                            bg="gray.50"
                          >
                            <Text color="gray.500" fontSize="sm" fontWeight="medium">
                              No {priority.toLowerCase()} priority tasks
                            </Text>
                            <Text color="gray.400" fontSize="xs" mt={1}>
                              Create a new task to get started
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        {/* Task Modal */}
        <TaskModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          task={editingTask}
          mode={editingTask ? 'edit' : 'create'}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
