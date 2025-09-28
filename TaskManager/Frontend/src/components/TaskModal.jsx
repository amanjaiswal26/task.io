import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, clearError } from '../store/slices/taskSlice';

const TaskModal = ({ isOpen, onClose, task = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const { loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      });
    }
  }, [task, mode, isOpen]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      dispatch(createTask(formData));
    } else if (mode === 'edit') {
      dispatch(updateTask({ taskId: task._id, taskData: formData }));
    }

    onClose();
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  if (mode === 'view') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input value={task?.title} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={task?.description} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  value={task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                  isReadOnly
                />
              </FormControl>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Input value={task?.priority} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Input value={task?.status} isReadOnly />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;


