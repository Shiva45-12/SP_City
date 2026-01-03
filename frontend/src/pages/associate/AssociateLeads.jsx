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
import { Plus, Phone, Mail, Calendar, User, MapPin, Edit, Eye } from 'lucide-react';

const AssociateLeads = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view, followup
  
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      project: 'SP Heights',
      status: 'New',
      source: 'Website',
      budget: '50-75 Lakhs',
      createdAt: '2024-01-15',
      lastFollowup: '2024-01-20',
      nextFollowup: '2024-01-25',
      notes: 'Interested in 3BHK apartment'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+91 9876543211',
      email: 'jane@example.com',
      project: 'SP Gardens',
      status: 'Follow Up',
      source: 'Referral',
      budget: '75-1 Crore',
      createdAt: '2024-01-10',
      lastFollowup: '2024-01-22',
      nextFollowup: '2024-01-27',
      notes: 'Looking for ground floor unit'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      phone: '+91 9876543212',
      email: 'mike@example.com',
      project: 'SP Plaza',
      status: 'Site Visit',
      source: 'Walk-in',
      budget: '1-1.5 Crore',
      createdAt: '2024-01-05',
      lastFollowup: '2024-01-23',
      nextFollowup: '2024-01-28',
      notes: 'Scheduled site visit for weekend'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    source: '',
    budget: '',
    notes: '',
    nextFollowup: ''
  });

  const getStatusColor = (status) => {
    const colors = {
      'New': 'blue',
      'Follow Up': 'yellow',
      'Site Visit': 'purple',
      'Negotiation': 'orange',
      'Deal Done': 'green',
      'Lost': 'red'
    };
    return colors[status] || 'gray';
  };

  const handleAddLead = () => {
    setModalType('add');
    setFormData({
      name: '',
      phone: '',
      email: '',
      project: '',
      source: '',
      budget: '',
      notes: '',
      nextFollowup: ''
    });
    onOpen();
  };

  const handleEditLead = (lead) => {
    setModalType('edit');
    setSelectedLead(lead);
    setFormData(lead);
    onOpen();
  };

  const handleViewLead = (lead) => {
    setModalType('view');
    setSelectedLead(lead);
    onOpen();
  };

  const handleFollowup = (lead) => {
    setModalType('followup');
    setSelectedLead(lead);
    setFormData({
      ...lead,
      followupNotes: '',
      nextFollowup: '',
      status: lead.status
    });
    onOpen();
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      const newLead = {
        ...formData,
        id: leads.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'New'
      };
      setLeads([...leads, newLead]);
    } else if (modalType === 'edit') {
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id ? { ...lead, ...formData } : lead
      ));
    } else if (modalType === 'followup') {
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { 
              ...lead, 
              status: formData.status,
              lastFollowup: new Date().toISOString().split('T')[0],
              nextFollowup: formData.nextFollowup,
              notes: lead.notes + '\n' + formData.followupNotes
            } 
          : lead
      ));
    }
    onClose();
  };

  const filterLeadsByStatus = (status) => {
    if (status === 'all') return leads;
    return leads.filter(lead => lead.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">Manage your leads and track their progress</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          colorScheme=""
          className="bg-gradient-to-r from-red-600 to-black text-white"
          onClick={handleAddLead}
        >
          Add New Lead
        </Button>
      </div>

      <div className="card">
        <Tabs>
          <TabList>
            <Tab>All Leads ({leads.length})</Tab>
            <Tab>New ({filterLeadsByStatus('New').length})</Tab>
            <Tab>Follow Up ({filterLeadsByStatus('Follow Up').length})</Tab>
            <Tab>Site Visit ({filterLeadsByStatus('Site Visit').length})</Tab>
            <Tab>Final ({filterLeadsByStatus('Deal Done').length + filterLeadsByStatus('Lost').length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <LeadTable 
                leads={leads} 
                onEdit={handleEditLead}
                onView={handleViewLead}
                onFollowup={handleFollowup}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <LeadTable 
                leads={filterLeadsByStatus('New')} 
                onEdit={handleEditLead}
                onView={handleViewLead}
                onFollowup={handleFollowup}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <LeadTable 
                leads={filterLeadsByStatus('Follow Up')} 
                onEdit={handleEditLead}
                onView={handleViewLead}
                onFollowup={handleFollowup}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <LeadTable 
                leads={filterLeadsByStatus('Site Visit')} 
                onEdit={handleEditLead}
                onView={handleViewLead}
                onFollowup={handleFollowup}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <LeadTable 
                leads={[...filterLeadsByStatus('Deal Done'), ...filterLeadsByStatus('Lost')]} 
                onEdit={handleEditLead}
                onView={handleViewLead}
                onFollowup={handleFollowup}
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
            {modalType === 'add' && 'Add New Lead'}
            {modalType === 'edit' && 'Edit Lead'}
            {modalType === 'view' && 'Lead Details'}
            {modalType === 'followup' && 'Follow Up'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalType === 'view' ? (
              <VStack align="start" spacing={4}>
                <HStack>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{selectedLead?.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Phone:</Text>
                  <Text>{selectedLead?.phone}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedLead?.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Project:</Text>
                  <Text>{selectedLead?.project}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={getStatusColor(selectedLead?.status)}>
                    {selectedLead?.status}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Budget:</Text>
                  <Text>{selectedLead?.budget}</Text>
                </HStack>
                <VStack align="start">
                  <Text fontWeight="bold">Notes:</Text>
                  <Text>{selectedLead?.notes}</Text>
                </VStack>
              </VStack>
            ) : (
              <VStack spacing={4}>
                {modalType === 'followup' ? (
                  <>
                    <FormControl>
                      <FormLabel>Update Status</FormLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="New">New</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Deal Done">Deal Done</option>
                        <option value="Lost">Lost</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Follow Up Notes</FormLabel>
                      <Textarea
                        value={formData.followupNotes}
                        onChange={(e) => setFormData({...formData, followupNotes: e.target.value})}
                        placeholder="Add follow up notes..."
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Next Follow Up Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.nextFollowup}
                        onChange={(e) => setFormData({...formData, nextFollowup: e.target.value})}
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 9876543210"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Project Interest</FormLabel>
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
                    <FormControl>
                      <FormLabel>Source</FormLabel>
                      <Select
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                      >
                        <option value="">Select Source</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Advertisement">Advertisement</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Budget Range</FormLabel>
                      <Select
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      >
                        <option value="">Select Budget</option>
                        <option value="25-50 Lakhs">25-50 Lakhs</option>
                        <option value="50-75 Lakhs">50-75 Lakhs</option>
                        <option value="75-1 Crore">75 Lakhs - 1 Crore</option>
                        <option value="1-1.5 Crore">1-1.5 Crore</option>
                        <option value="1.5+ Crore">1.5+ Crore</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Notes</FormLabel>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Additional notes..."
                      />
                    </FormControl>
                  </>
                )}
                <HStack spacing={4} w="full" justify="end">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button colorScheme="" className='bg-gradient-to-r from-red-600 to-black text-white' onClick={handleSubmit}>
                    {modalType === 'add' ? 'Add Lead' : modalType === 'edit' ? 'Update' : 'Save Follow Up'}
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const LeadTable = ({ leads, onEdit, onView, onFollowup, getStatusColor }) => (
  <Box overflowX="auto">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Contact</Th>
          <Th>Project</Th>
          <Th>Status</Th>
          <Th>Budget</Th>
          <Th>Next Follow Up</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {leads.map((lead) => (
          <Tr key={lead.id}>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">{lead.name}</Text>
                <Text fontSize="sm" color="gray.500">{lead.source}</Text>
              </VStack>
            </Td>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">{lead.phone}</Text>
                <Text fontSize="sm" color="gray.500">{lead.email}</Text>
              </VStack>
            </Td>
            <Td>{lead.project}</Td>
            <Td>
              <Badge colorScheme={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
            </Td>
            <Td>{lead.budget}</Td>
            <Td>{lead.nextFollowup}</Td>
            <Td>
              <HStack spacing={2}>
                <Button size="sm" variant="ghost" onClick={() => onView(lead)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onEdit(lead)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" colorScheme="blue" onClick={() => onFollowup(lead)}>
                  Follow Up
                </Button>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default AssociateLeads;