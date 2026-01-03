import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  InputGroup,
  InputLeftElement,
  HStack,
  VStack,
  Text,
  IconButton,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup
} from '@chakra-ui/react';
import { MapPin, Plus, Edit, Trash2, Eye, Calendar, Ruler, Home, Search, MoreVertical, Building, Grid, List } from 'lucide-react';

const SiteManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    totalArea: '',
    availableArea: '',
    pricePerSqFt: '',
    amenities: '',
    nearbyFacilities: '',
    connectivity: '',
    legalStatus: '',
    possession: '',
    description: '',
    image: null,
    imagePreview: null
  });

  const sites = [
    {
      id: 1,
      name: 'SP Heights Site',
      location: 'Sector 15, Gurgaon',
      address: 'Plot No. 123, Sector 15, Gurgaon, Haryana - 122001',
      totalArea: '5.2 Acres',
      availableArea: '3.8 Acres',
      pricePerSqFt: '₹8,500',
      amenities: 'Club House, Swimming Pool, Gym, Garden',
      nearbyFacilities: 'Metro Station (2km), Hospital (1km), School (500m)',
      connectivity: 'NH-8, Dwarka Expressway',
      legalStatus: 'Approved',
      possession: 'Ready to Move',
      status: 'Active',
      projects: 2,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'SP Gardens Site',
      location: 'Sector 22, Noida',
      address: 'Plot No. 456, Sector 22, Noida, UP - 201301',
      totalArea: '8.5 Acres',
      availableArea: '6.2 Acres',
      pricePerSqFt: '₹6,200',
      amenities: 'Park, Playground, Community Hall, Security',
      nearbyFacilities: 'Metro Station (1.5km), Mall (2km), School (800m)',
      connectivity: 'Noida Expressway, DND Flyway',
      legalStatus: 'Approved',
      possession: 'Under Construction',
      status: 'Active',
      projects: 1
    },
    {
      id: 3,
      name: 'SP Plaza Site',
      location: 'MG Road, Delhi',
      address: 'Plot No. 789, MG Road, Connaught Place, Delhi - 110001',
      totalArea: '2.1 Acres',
      availableArea: '0.5 Acres',
      pricePerSqFt: '₹25,000',
      amenities: 'Parking, Elevators, Power Backup, CCTV',
      nearbyFacilities: 'Metro Station (200m), Airport (15km), Railway (5km)',
      connectivity: 'Ring Road, Rajpath',
      legalStatus: 'Approved',
      possession: 'Ready to Move',
      status: 'Sold Out',
      projects: 1
    }
  ];

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Sold Out': return 'blue';
      case 'On Hold': return 'yellow';
      default: return 'gray';
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Site Added Successfully',
      description: `${formData.name} has been added to sites.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setFormData({
      name: '',
      location: '',
      address: '',
      totalArea: '',
      availableArea: '',
      pricePerSqFt: '',
      amenities: '',
      nearbyFacilities: '',
      connectivity: '',
      legalStatus: '',
      possession: '',
      description: ''
    });
    onClose();
  };

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                Site Management
              </Text>
              <Text color="gray.600" mt={2}>
                Manage all real estate sites and their details
              </Text>
            </Box>
            <Button
              leftIcon={<Plus size={20} />}
              colorScheme=""
              className='bg-gradient-to-r from-red-600 to-black text-white'
              onClick={onOpen}
              size="lg"
            >
              Add Site
            </Button>
          </HStack>
        </Box>

        {/* Search and View Toggle */}
        <HStack justify="space-between" align="center">
          <InputGroup maxW="md">
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? 'bg-gradient-to-r from-red-600 to-black text-white' : ''}
              leftIcon={<Grid size={16} />}
            >
            
            </Button>
            <Button
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-gradient-to-r from-red-600 to-black text-white' : ''}
              leftIcon={<List size={16} />}
            >
             
            </Button>
          </ButtonGroup>
        </HStack>

        {/* Sites Cards - Show only when viewMode is 'cards' */}
        {viewMode === 'cards' && (
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
            {filteredSites.map((site) => (
              <Card key={site.id}>
                <CardBody>
                  <VStack spacing={4}>
                    <Box position="relative" w="full" h="48" bg="gray.200" rounded="xl" overflow="hidden">
                      {site.image ? (
                        <img 
                          src={site.image} 
                          alt={site.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" h="full">
                          <Building size={64} color="gray" />
                        </Box>
                      )}
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme={getStatusColor(site.status)}
                        variant="solid"
                      >
                        {site.status}
                      </Badge>
                    </Box>

                    <VStack spacing={3} w="full" align="start">
                      <Box>
                        <Text fontSize="xl" fontWeight="bold">{site.name}</Text>
                        <HStack spacing={2} mt={1}>
                          <MapPin size={16} />
                          <Text fontSize="sm" color="gray.600">{site.location}</Text>
                        </HStack>
                      </Box>

                      <Box w="full">
                        <Text fontSize="sm" color="gray.500" mb={2}>Address:</Text>
                        <Text fontSize="sm">{site.address}</Text>
                      </Box>

                      <SimpleGrid columns={2} spacing={4} w="full">
                        <Box textAlign="center" p={3} bg="blue.50" rounded="lg">
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">{site.totalArea}</Text>
                          <Text fontSize="xs" color="gray.600">Total Area</Text>
                        </Box>
                        <Box textAlign="center" p={3} bg="green.50" rounded="lg">
                          <Text fontSize="lg" fontWeight="bold" color="green.600">{site.availableArea}</Text>
                          <Text fontSize="xs" color="gray.600">Available</Text>
                        </Box>
                      </SimpleGrid>

                      <Box w="full">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.500">Price/Sq.Ft:</Text>
                          <Text fontSize="sm" fontWeight="bold" color="red.600">{site.pricePerSqFt}</Text>
                        </HStack>
                        <HStack justify="space-between" mt={1}>
                          <Text fontSize="sm" color="gray.500">Projects:</Text>
                          <Text fontSize="sm" fontWeight="bold">{site.projects}</Text>
                        </HStack>
                      </Box>

                      <Box w="full">
                        <Text fontSize="sm" color="gray.500" mb={1}>Legal Status:</Text>
                        <Badge colorScheme="green" variant="subtle">{site.legalStatus}</Badge>
                      </Box>

                      <HStack spacing={2} w="full" pt={2}>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                          variant="solid" 
                          flex={1} 
                          leftIcon={<Eye size={16} />}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                          variant="solid" 
                          flex={1} 
                          leftIcon={<Edit size={16} />}
                        >
                          Edit
                        </Button>
                        <IconButton
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                          variant="solid"
                          icon={<Trash2 size={16} />}
                        />
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Sites Table - Show only when viewMode is 'table' */}
        {viewMode === 'table' && (
          <Box bg="white" rounded="xl" shadow="lg" border="1px" borderColor="gray.100">
            <TableContainer>
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Site Details</Th>
                    <Th>Location</Th>
                    <Th>Area Details</Th>
                    <Th>Price/Sq.Ft</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSites.map((site) => (
                    <Tr key={site.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <HStack spacing={3}>
                          <Box w={10} h={10} bg="gray.200" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                            <Building size={20} />
                          </Box>
                          <Box>
                            <Text fontWeight="medium">{site.name}</Text>
                            <Text fontSize="sm" color="gray.500">{site.projects} projects</Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <MapPin size={16} />
                            <Text fontSize="sm">{site.location}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">{site.address}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">Total: {site.totalArea}</Text>
                          <Text fontSize="sm" color="green.600">Available: {site.availableArea}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontWeight="bold" color="red.600">{site.pricePerSqFt}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(site.status)} variant="subtle">
                          {site.status}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<Eye size={16} />}
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                            variant="solid"
                          />
                          <IconButton
                            icon={<Edit size={16} />}
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                            variant="solid"
                          />
                          <IconButton
                            icon={<MoreVertical size={16} />}
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                            variant="solid"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </VStack>

      {/* Add Site Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Site</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Site Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter site name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Sector, City"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Site Image</FormLabel>
                  <VStack spacing={4}>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      p={1}
                    />
                    {formData.imagePreview && (
                      <Box w="full" maxW="200px">
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                    )}
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Complete Address</FormLabel>
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address with pincode"
                    rows={2}
                  />
                </FormControl>
                
                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Total Area</FormLabel>
                    <Input
                      name="totalArea"
                      value={formData.totalArea}
                      onChange={handleInputChange}
                      placeholder="e.g., 5.2 Acres"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Available Area</FormLabel>
                    <Input
                      name="availableArea"
                      value={formData.availableArea}
                      onChange={handleInputChange}
                      placeholder="e.g., 3.8 Acres"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Price per Sq.Ft</FormLabel>
                    <Input
                      name="pricePerSqFt"
                      value={formData.pricePerSqFt}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹8,500"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Amenities</FormLabel>
                  <Textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="Club House, Swimming Pool, Gym, Garden..."
                    rows={2}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nearby Facilities</FormLabel>
                  <Textarea
                    name="nearbyFacilities"
                    value={formData.nearbyFacilities}
                    onChange={handleInputChange}
                    placeholder="Metro Station, Hospital, School, Mall..."
                    rows={2}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Connectivity</FormLabel>
                  <Input
                    name="connectivity"
                    value={formData.connectivity}
                    onChange={handleInputChange}
                    placeholder="NH-8, Expressway, Metro Line..."
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Legal Status</FormLabel>
                    <Select
                      name="legalStatus"
                      value={formData.legalStatus}
                      onChange={handleInputChange}
                      placeholder="Select Status"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Possession</FormLabel>
                    <Select
                      name="possession"
                      value={formData.possession}
                      onChange={handleInputChange}
                      placeholder="Select Possession"
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Upcoming">Upcoming</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Additional site description..."
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="" 
              className='bg-gradient-to-r from-red-600 to-black text-white'
              type="submit">
                Add Site
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SiteManagement;