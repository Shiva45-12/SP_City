import React, { useState } from 'react';
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Box,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';
import { Plus, Calendar, MapPin, Clock, User, CheckCircle } from 'lucide-react';

const AssociateSiteVisits = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalType, setModalType] = useState('schedule');
  
  const [visits, setVisits] = useState([
    {
      id: 1,
      clientName: 'John Doe',
      clientPhone: '+91 9876543210',
      project: 'SP Heights',
      date: '2024-01-28',
      time: '10:00 AM',
      status: 'Planned',
      notes: 'Interested in 3BHK on 5th floor',
      feedback: '',
      outcome: ''
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      clientPhone: '+91 9876543211',
      project: 'SP Gardens',
      date: '2024-01-25',
      time: '2:00 PM',
      status: 'Completed',
      notes: 'Looking for ground floor unit',
      feedback: 'Very impressed with amenities',
      outcome: 'Interested to proceed'
    },
    {
      id: 3,
      clientName: 'Mike Johnson',
      clientPhone: '+91 9876543212',
      project: 'SP Plaza',
      date: '2024-01-30',
      time: '11:00 AM',
      status: 'Planned',
      notes: 'Premium apartment seeker',
      feedback: '',
      outcome: ''
    }
  ]);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    project: '',
    date: '',
    time: '',
    notes: '',
    feedback: '',
    outcome: ''
  });

  const getStatusColor = (status) => {
    return status === 'Planned' ? 'blue' : 'green';
  };

  const handleScheduleVisit = () => {
    setModalType('schedule');
    setFormData({
      clientName: '',
      clientPhone: '',
      project: '',
      date: '',
      time: '',
      notes: '',
      feedback: '',
      outcome: ''
    });
    onOpen();
  };

  const handleCompleteVisit = (visit) => {
    setModalType('complete');
    setSelectedVisit(visit);
    setFormData({
      ...visit,
      feedback: '',
      outcome: ''
    });
    onOpen();
  };

  const handleSubmit = () => {
    if (modalType === 'schedule') {
      const newVisit = {
        ...formData,
        id: visits.length + 1,
        status: 'Planned'
      };
      setVisits([...visits, newVisit]);
    } else if (modalType === 'complete') {
      setVisits(visits.map(visit => 
        visit.id === selectedVisit.id 
          ? { 
              ...visit, 
              status: 'Completed',
              feedback: formData.feedback,
              outcome: formData.outcome
            } 
          : visit
      ));
    }
    onClose();
  };

  const filterVisitsByStatus = (status) => {
    return visits.filter(visit => visit.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Visits</h1>
          <p className="text-gray-600 mt-2">Manage planned and completed site visits</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          colorScheme="red"
          onClick={handleScheduleVisit}
        >
          Schedule Visit
        </Button>
      </div>

      <div className="card">
        <Tabs>
          <TabList>
            <Tab>All Visits ({visits.length})</Tab>
            <Tab>Planned ({filterVisitsByStatus('Planned').length})</Tab>
            <Tab>Completed ({filterVisitsByStatus('Completed').length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <VisitTable 
                visits={visits} 
                onComplete={handleCompleteVisit}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <VisitTable 
                visits={filterVisitsByStatus('Planned')} 
                onComplete={handleCompleteVisit}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <VisitTable 
                visits={filterVisitsByStatus('Completed')} 
                onComplete={handleCompleteVisit}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'schedule' ? 'Schedule Site Visit' : 'Complete Site Visit'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              {modalType === 'schedule' ? (
                <>
                  <FormControl isRequired>
                    <FormLabel>Client Name</FormLabel>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      placeholder="Enter client name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Client Phone</FormLabel>
                    <Input
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                      placeholder="+91 9876543210"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Project</FormLabel>
                    <Select
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                    >
                      <option value="">Select Project</option>
                      <option value="SP Heights">SP Heights</option>
                      <option value="SP Gardens">SP Gardens</option>
                      <option value="SP Plaza">SP Plaza</option>
                    </Select>
                  </FormControl>
                  <HStack w="full">
                    <FormControl isRequired>
                      <FormLabel>Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Time</FormLabel>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </FormControl>
                  </HStack>
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Special requirements or notes..."
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <VStack align="start" w="full" spacing={2}>
                    <Text><strong>Client:</strong> {selectedVisit?.clientName}</Text>
                    <Text><strong>Project:</strong> {selectedVisit?.project}</Text>
                    <Text><strong>Date & Time:</strong> {selectedVisit?.date} at {selectedVisit?.time}</Text>
                  </VStack>
                  <FormControl isRequired>
                    <FormLabel>Client Feedback</FormLabel>
                    <Textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                      placeholder="What did the client think about the property?"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Visit Outcome</FormLabel>
                    <Select
                      value={formData.outcome}
                      onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                    >
                      <option value="">Select Outcome</option>
                      <option value="Very Interested">Very Interested</option>
                      <option value="Interested">Interested</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Booking Initiated">Booking Initiated</option>
                    </Select>
                  </FormControl>
                </>
              )}
              <HStack spacing={4} w="full" justify="end">
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="red" onClick={handleSubmit}>
                  {modalType === 'schedule' ? 'Schedule Visit' : 'Complete Visit'}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const VisitTable = ({ visits, onComplete, getStatusColor }) => (
  <Box overflowX="auto">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Client</Th>
          <Th>Project</Th>
          <Th>Date & Time</Th>
          <Th>Status</Th>
          <Th>Notes</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {visits.map((visit) => (
          <Tr key={visit.id}>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">{visit.clientName}</Text>
                <Text fontSize="sm" color="gray.500">{visit.clientPhone}</Text>
              </VStack>
            </Td>
            <Td>{visit.project}</Td>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">{visit.date}</Text>
                <Text fontSize="sm" color="gray.500">{visit.time}</Text>
              </VStack>
            </Td>
            <Td>
              <Badge colorScheme={getStatusColor(visit.status)}>
                {visit.status}
              </Badge>
            </Td>
            <Td>
              <Text fontSize="sm" noOfLines={2}>{visit.notes}</Text>
              {visit.feedback && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Feedback: {visit.feedback}
                </Text>
              )}
            </Td>
            <Td>
              {visit.status === 'Planned' && (
                <Button size="sm" colorScheme="green" onClick={() => onComplete(visit)}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              )}
              {visit.status === 'Completed' && (
                <Badge colorScheme="green">Completed</Badge>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default AssociateSiteVisits;