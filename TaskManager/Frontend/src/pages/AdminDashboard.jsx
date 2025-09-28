import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp,
  FiBarChart,
  FiSettings,
  FiUserCheck,
  FiUserMinus
} from 'react-icons/fi';
import { getAnalytics } from '../store/slices/adminSlice';
import UserManagement from '../components/admin/UserManagement';
import TaskManagement from '../components/admin/TaskManagement';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { analytics, loading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  // Show loading only if we're fetching analytics and don't have data yet
  if (loading && !analytics) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading admin dashboard...</Text>
        </VStack>
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
              Admin Dashboard 👨‍💼
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Welcome back, {user?.name}! Manage your platform
            </Text>
          </Box>

          {/* Analytics Cards */}
          {analytics && (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">Total Users</StatLabel>
                        <StatNumber color="blue.500">{analytics.users.total}</StatNumber>
                        <StatHelpText>
                          <Text color="green.500" fontSize="sm">
                            +{analytics.users.recent} this week
                          </Text>
                        </StatHelpText>
                      </Box>
                      <Icon as={FiUsers} w={8} h={8} color="blue.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">Active Users</StatLabel>
                        <StatNumber color="green.500">{analytics.users.active}</StatNumber>
                        <StatHelpText>
                          <Text color="gray.500" fontSize="sm">
                            {Math.round((analytics.users.active / analytics.users.total) * 100)}% of total
                          </Text>
                        </StatHelpText>
                      </Box>
                      <Icon as={FiUserCheck} w={8} h={8} color="green.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">Total Tasks</StatLabel>
                        <StatNumber color="purple.500">{analytics.tasks.total}</StatNumber>
                        <StatHelpText>
                          <Text color="green.500" fontSize="sm">
                            +{analytics.tasks.recent} this week
                          </Text>
                        </StatHelpText>
                      </Box>
                      <Icon as={FiBarChart} w={8} h={8} color="purple.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">Completed Tasks</StatLabel>
                        <StatNumber color="green.500">{analytics.tasks.completed}</StatNumber>
                        <StatHelpText>
                          <Text color="gray.500" fontSize="sm">
                            {Math.round((analytics.tasks.completed / analytics.tasks.total) * 100)}% completion rate
                          </Text>
                        </StatHelpText>
                      </Box>
                      <Icon as={FiCheckCircle} w={8} h={8} color="green.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          )}

          {/* Priority Breakdown */}
          {analytics && (
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">High Priority</StatLabel>
                        <StatNumber color="red.500">{analytics.tasks.priority.high}</StatNumber>
                      </Box>
                      <Icon as={FiTrendingUp} w={8} h={8} color="red.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <StatLabel color="gray.600">Medium Priority</StatLabel>
                        <StatNumber color="orange.500">{analytics.tasks.priority.medium}</StatNumber>
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
                        <StatLabel color="gray.600">Low Priority</StatLabel>
                        <StatNumber color="green.500">{analytics.tasks.priority.low}</StatNumber>
                      </Box>
                      <Icon as={FiCheckCircle} w={8} h={8} color="green.500" />
                    </Flex>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          )}

          {/* Management Tabs */}
          <Card>
            <CardBody>
              <Tabs variant="enclosed" colorScheme="brand">
                <TabList>
                  <Tab>User Management</Tab>
                  <Tab>Task Management</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <UserManagement />
                  </TabPanel>
                  <TabPanel px={0}>
                    <TaskManagement />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
