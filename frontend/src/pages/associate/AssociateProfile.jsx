import React, { useState } from 'react';
import { 
  Button, 
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  Box,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useToast
} from '@chakra-ui/react';
import { User, Phone, Mail, MapPin, Calendar, Edit, Save, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AssociateProfile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Associate User',
    email: 'associate@spcity.com',
    phone: '+91 9876543210',
    address: '123 Main Street, City, State - 400001',
    dateOfJoining: '2024-01-01',
    employeeId: 'ASC001',
    department: 'Sales',
    manager: 'Sales Manager',
    emergencyContact: '+91 9876543211',
    bankAccount: '1234567890',
    panNumber: 'ABCDE1234F',
    aadharNumber: '1234 5678 9012'
  });

  const [stats] = useState({
    totalLeads: 45,
    convertedLeads: 12,
    totalCommission: 560000,
    thisMonthCommission: 85000,
    siteVisits: 28,
    dealsCompleted: 8
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and view performance</p>
        </div>
        {!isEditing ? (
          <Button
            leftIcon={<Edit className="w-4 h-4" />}
            colorScheme=""
                className='bg-gradient-to-r from-red-600 to-black text-white'
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <HStack spacing={3}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              leftIcon={<Save className="w-4 h-4" />}
              colorScheme=""
                  className='bg-gradient-to-r from-red-600 to-black text-white'
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </HStack>
        )}
      </div>

      {/* Performance Stats */}
      <div className="card">
        <Text fontSize="lg" fontWeight="semibold" mb={4}>Performance Overview</Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Total Leads</StatLabel>
            <StatNumber color="blue.500">{stats.totalLeads}</StatNumber>
            <StatHelpText>Leads generated</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Conversion Rate</StatLabel>
            <StatNumber color="green.500">
              {((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)}%
            </StatNumber>
            <StatHelpText>{stats.convertedLeads} converted</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Commission</StatLabel>
            <StatNumber color="purple.500">{formatCurrency(stats.totalCommission)}</StatNumber>
            <StatHelpText>All time earnings</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>This Month</StatLabel>
            <StatNumber color="orange.500">{formatCurrency(stats.thisMonthCommission)}</StatNumber>
            <StatHelpText>Current month earnings</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Site Visits</StatLabel>
            <StatNumber color="teal.500">{stats.siteVisits}</StatNumber>
            <StatHelpText>Total visits conducted</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Deals Completed</StatLabel>
            <StatNumber color="red.500">{stats.dealsCompleted}</StatNumber>
            <StatHelpText>Successful closures</StatHelpText>
          </Stat>
        </SimpleGrid>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="card">
          <VStack spacing={4} align="center">
            <Box position="relative">
              <Avatar size="2xl" name={profileData.name} />
              {isEditing && (
                <Button
                  size="sm"
                  position="absolute"
                  bottom={0}
                  right={0}
                  borderRadius="full"
                  colorScheme=""
                  className='bg-gradient-to-r from-red-600 to-black text-white'
                  minW="auto"
                  h="auto"
                  p={2}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </Box>
            <VStack spacing={1} align="center">
              <Text fontSize="xl" fontWeight="bold">{profileData.name}</Text>
              <Text color="gray.500">{profileData.department}</Text>
              <Text fontSize="sm" color="gray.400">ID: {profileData.employeeId}</Text>
            </VStack>
            <Divider />
            <VStack spacing={2} align="start" w="full">
              <HStack>
                <Calendar className="w-4 h-4 text-gray-400" />
                <Text fontSize="sm">Joined: {profileData.dateOfJoining}</Text>
              </HStack>
              <HStack>
                <User className="w-4 h-4 text-gray-400" />
                <Text fontSize="sm">Manager: {profileData.manager}</Text>
              </HStack>
            </VStack>
          </VStack>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 card">
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Personal Information</Text>
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Emergency Contact</FormLabel>
                <Input
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                />
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Textarea
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
                rows={3}
              />
            </FormControl>
          </VStack>
        </div>
      </div>

      {/* Financial Information */}
      <div className="card">
        <Text fontSize="lg" fontWeight="semibold" mb={4}>Financial Information</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Bank Account Number</FormLabel>
            <Input
              value={profileData.bankAccount}
              onChange={(e) => setProfileData({...profileData, bankAccount: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
              type={isEditing ? 'text' : 'password'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>PAN Number</FormLabel>
            <Input
              value={profileData.panNumber}
              onChange={(e) => setProfileData({...profileData, panNumber: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Aadhar Number</FormLabel>
            <Input
              value={profileData.aadharNumber}
              onChange={(e) => setProfileData({...profileData, aadharNumber: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
              type={isEditing ? 'text' : 'password'}
            />
          </FormControl>
        </SimpleGrid>
      </div>
    </div>
  );
};

export default AssociateProfile;