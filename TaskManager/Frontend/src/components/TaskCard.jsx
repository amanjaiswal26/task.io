import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Switch,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateTaskStatus, deleteTask } from '../store/slices/taskSlice';
import TaskModal from './TaskModal';

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleStatusChange = (e) => {
    const newStatus = e.target.checked ? 'completed' : 'pending';
    dispatch(updateTaskStatus({ taskId: task._id, status: newStatus }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id));
    }
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending';

  return (
    <>
      <Card
        size="sm"
        variant="outline"
        borderLeft="4px"
        borderLeftColor={`${getPriorityColor(task.priority)}.400`}
        opacity={task.status === 'completed' ? 0.7 : 1}
        _hover={{ 
          shadow: 'lg',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }}
        transition="all 0.2s ease-in-out"
        bg="white"
        borderRadius="xl"
      >
        <CardBody p={4}>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2} flex={1}>
                <Heading 
                  size="sm" 
                  noOfLines={2}
                  color="gray.800"
                  fontWeight="semibold"
                >
                  {task.title}
                </Heading>
                {task.description && (
                  <Text 
                    fontSize="sm" 
                    color="gray.600" 
                    noOfLines={2}
                    lineHeight="1.4"
                  >
                    {task.description}
                  </Text>
                )}
              </VStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                  color="gray.500"
                  _hover={{ 
                    bg: 'gray.100',
                    color: 'gray.700'
                  }}
                />
                <MenuList borderRadius="lg" boxShadow="lg">
                  <MenuItem 
                    icon={<FiEdit />} 
                    onClick={() => onEdit(task)}
                    _hover={{ bg: 'blue.50' }}
                  >
                    Edit Task
                  </MenuItem>
                  <MenuItem 
                    icon={<FiTrash2 />} 
                    onClick={handleDelete}
                    _hover={{ bg: 'red.50' }}
                    color="red.600"
                  >
                    Delete Task
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <Text 
                  fontSize="xs" 
                  color="gray.500"
                  fontWeight="medium"
                >
                  Due: {formatDate(task.dueDate)}
                </Text>
                <Badge 
                  colorScheme={getPriorityColor(task.priority)} 
                  size="sm"
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontWeight="medium"
                >
                  {task.priority}
                </Badge>
              </VStack>
              <VStack align="end" spacing={2}>
                <Switch
                  isChecked={task.status === 'completed'}
                  onChange={handleStatusChange}
                  colorScheme="green"
                  size="md"
                />
                <Text 
                  fontSize="xs" 
                  color="gray.500"
                  fontWeight="medium"
                  textTransform="capitalize"
                >
                  {task.status}
                </Text>
              </VStack>
            </HStack>

            {isOverdue && (
              <Badge 
                colorScheme="red" 
                size="sm" 
                alignSelf="start"
                borderRadius="full"
                px={2}
                py={1}
                fontWeight="medium"
              >
                ⚠️ Overdue
              </Badge>
            )}
          </VStack>
        </CardBody>
      </Card>

      <TaskModal
        isOpen={isOpen}
        onClose={onClose}
        task={task}
        mode="view"
      />
    </>
  );
};

export default TaskCard;
