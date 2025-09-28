import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Button,
  Spacer,
  Text,
  Avatar,
  HStack,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { logout, getCurrentUser } from '../store/slices/authSlice';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const bg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box 
        bg="white" 
        shadow="sm" 
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="7xl">
          <Flex align="center" h={16}>
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="brand.500"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="sm">
                  T
                </Text>
              </Box>
              <Heading size="lg" color="gray.800" fontWeight="bold">
                Task.io
              </Heading>
            </HStack>
            <Spacer />
            {user && (
              <HStack spacing={4}>
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={user.name}
                    bg="brand.500"
                    color="white"
                  />
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {user.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user.email}
                    </Text>
                  </Box>
                </HStack>
                {user?.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiSettings />}
                    onClick={() => navigate('/admin')}
                    color="gray.600"
                    _hover={{
                      bg: 'gray.100',
                      color: 'gray.800',
                    }}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiLogOut />}
                  onClick={handleLogout}
                  color="gray.600"
                  _hover={{
                    bg: 'gray.100',
                    color: 'gray.800',
                  }}
                >
                  Logout
                </Button>
              </HStack>
            )}
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
