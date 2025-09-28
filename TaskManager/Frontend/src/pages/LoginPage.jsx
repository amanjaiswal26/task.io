import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  Card,
  CardBody,
  HStack,
  Divider,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { loginUser, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Logo and Branding */}
          <VStack spacing={4}>
            <Box
              w={16}
              h={16}
              bg="brand.500"
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Text color="white" fontWeight="bold" fontSize="2xl">
                T
              </Text>
            </Box>
            <VStack spacing={2}>
              <Heading size="xl" color="gray.800" fontWeight="bold">
                Welcome back
              </Heading>
              <Text textAlign="center" color="gray.600" fontSize="lg">
                Sign in to your TaskFlow account
              </Text>
            </VStack>
          </VStack>

          {/* Login Form */}
          <Card w="100%" maxW="md" boxShadow="xl" borderRadius="2xl">
            <CardBody p={8}>
              {error && (
                <Alert status="error" borderRadius="lg" mb={6}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium">Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement color="gray.400">
                        <FiMail />
                      </InputLeftElement>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px #0066cc',
                        }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement color="gray.400">
                        <FiLock />
                      </InputLeftElement>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px #0066cc',
                        }}
                      />
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="100%"
                    isLoading={loading}
                    loadingText="Signing in..."
                    rightIcon={<FiArrowRight />}
                    borderRadius="lg"
                    fontWeight="medium"
                    py={6}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              <Divider my={6} />

              <HStack justify="center" spacing={1}>
                <Text color="gray.600">Don't have an account?</Text>
                <Link to="/register">
                  <Button 
                    variant="link" 
                    color="brand.500"
                    fontWeight="medium"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Sign up
                  </Button>
                </Link>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;
