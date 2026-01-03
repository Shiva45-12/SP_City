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
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid
} from '@chakra-ui/react';
import { Plus, DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

const AssociateAmount = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('add');
  
  const [payments, setPayments] = useState([
    {
      id: 1,
      clientName: 'John Doe',
      project: 'SP Heights',
      unitNumber: 'A-501',
      totalAmount: 7500000,
      advanceAmount: 1500000,
      paidAmount: 3000000,
      pendingAmount: 4500000,
      emiAmount: 75000,
      emiDueDate: '2024-02-01',
      paymentType: 'Advance',
      status: 'Active',
      date: '2024-01-15'
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      project: 'SP Gardens',
      unitNumber: 'B-203',
      totalAmount: 5500000,
      advanceAmount: 1100000,
      paidAmount: 2200000,
      pendingAmount: 3300000,
      emiAmount: 55000,
      emiDueDate: '2024-02-05',
      paymentType: 'EMI',
      status: 'Active',
      date: '2024-01-10'
    },
    {
      id: 3,
      clientName: 'Mike Johnson',
      project: 'SP Plaza',
      unitNumber: 'C-1001',
      totalAmount: 12000000,
      advanceAmount: 2400000,
      paidAmount: 12000000,
      pendingAmount: 0,
      emiAmount: 0,
      emiDueDate: '',
      paymentType: 'Full Payment',
      status: 'Completed',
      date: '2024-01-05'
    }
  ]);

  const [formData, setFormData] = useState({
    clientName: '',
    project: '',
    unitNumber: '',
    amount: '',
    paymentType: '',
    notes: ''
  });

  // Calculate totals
  const totals = {
    totalAmount: payments.reduce((sum, p) => sum + p.totalAmount, 0),
    advanceAmount: payments.reduce((sum, p) => sum + p.advanceAmount, 0),
    paidAmount: payments.reduce((sum, p) => sum + p.paidAmount, 0),
    pendingAmount: payments.reduce((sum, p) => sum + p.pendingAmount, 0),
    emiAmount: payments.filter(p => p.status === 'Active').reduce((sum, p) => sum + p.emiAmount, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'blue' : 'green';
  };

  const handleAddPayment = () => {
    setModalType('add');
    setFormData({
      clientName: '',
      project: '',
      unitNumber: '',
      amount: '',
      paymentType: '',
      notes: ''
    });
    onOpen();
  };

  const handleSubmit = () => {
    const newPayment = {
      ...formData,
      id: payments.length + 1,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setPayments([...payments, newPayment]);
    onClose();
  };

  const filterPaymentsByType = (type) => {
    switch (type) {
      case 'advance':
        return payments.filter(p => p.advanceAmount > 0);
      case 'pending':
        return payments.filter(p => p.pendingAmount > 0);
      case 'emi':
        return payments.filter(p => p.emiAmount > 0 && p.status === 'Active');
      default:
        return payments;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amount Management</h1>
          <p className="text-gray-600 mt-2">Track payments, advances, and EMIs</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          colorScheme=""
          className='bg-gradient-to-r from-red-600 to-black text-white'
          onClick={handleAddPayment}
        >
          Add Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
        <Box className="card">
          <Stat>
            <StatLabel>Total Amount</StatLabel>
            <StatNumber fontSize="2xl" color="purple.500">
              {formatCurrency(totals.totalAmount)}
            </StatNumber>
            <StatHelpText>All projects combined</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Advance Received</StatLabel>
            <StatNumber fontSize="2xl" color="green.500">
              {formatCurrency(totals.advanceAmount)}
            </StatNumber>
            <StatHelpText>Initial payments</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Total Paid</StatLabel>
            <StatNumber fontSize="2xl" color="blue.500">
              {formatCurrency(totals.paidAmount)}
            </StatNumber>
            <StatHelpText>Received so far</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Pending Amount</StatLabel>
            <StatNumber fontSize="2xl" color="orange.500">
              {formatCurrency(totals.pendingAmount)}
            </StatNumber>
            <StatHelpText>Outstanding balance</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Monthly EMI</StatLabel>
            <StatNumber fontSize="2xl" color="red.500">
              {formatCurrency(totals.emiAmount)}
            </StatNumber>
            <StatHelpText>Active EMIs</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <div className="card">
        <Tabs>
          <TabList>
            <Tab>All Payments ({payments.length})</Tab>
            <Tab>Advance ({filterPaymentsByType('advance').length})</Tab>
            <Tab>Pending ({filterPaymentsByType('pending').length})</Tab>
            <Tab>EMI ({filterPaymentsByType('emi').length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <PaymentTable 
                payments={payments} 
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <PaymentTable 
                payments={filterPaymentsByType('advance')} 
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <PaymentTable 
                payments={filterPaymentsByType('pending')} 
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <PaymentTable 
                payments={filterPaymentsByType('emi')} 
                formatCurrency={formatCurrency}
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
          <ModalHeader>Add Payment Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Client Name</FormLabel>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Enter client name"
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
              <FormControl isRequired>
                <FormLabel>Unit Number</FormLabel>
                <Input
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                  placeholder="e.g., A-501"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Payment Type</FormLabel>
                <Select
                  value={formData.paymentType}
                  onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="Advance">Advance</option>
                  <option value="EMI">EMI</option>
                  <option value="Partial Payment">Partial Payment</option>
                  <option value="Full Payment">Full Payment</option>
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
              <HStack spacing={4} w="full" justify="end">
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="" className='bg-gradient-to-r from-red-600 to-black text-white' onClick={handleSubmit}>
                  Add Payment
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const PaymentTable = ({ payments, formatCurrency, getStatusColor }) => (
  <Box overflowX="auto">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Client & Unit</Th>
          <Th>Project</Th>
          <Th>Total Amount</Th>
          <Th>Paid Amount</Th>
          <Th>Pending Amount</Th>
          <Th>EMI</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {payments.map((payment) => (
          <Tr key={payment.id}>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">{payment.clientName}</Text>
                <Text fontSize="sm" color="gray.500">{payment.unitNumber}</Text>
              </VStack>
            </Td>
            <Td>{payment.project}</Td>
            <Td>
              <Text fontWeight="medium">{formatCurrency(payment.totalAmount)}</Text>
            </Td>
            <Td>
              <VStack align="start" spacing={1}>
                <Text color="green.600">{formatCurrency(payment.paidAmount)}</Text>
                <Text fontSize="xs" color="gray.500">
                  Advance: {formatCurrency(payment.advanceAmount)}
                </Text>
              </VStack>
            </Td>
            <Td>
              <Text color="orange.600">{formatCurrency(payment.pendingAmount)}</Text>
            </Td>
            <Td>
              {payment.emiAmount > 0 ? (
                <VStack align="start" spacing={1}>
                  <Text>{formatCurrency(payment.emiAmount)}</Text>
                  <Text fontSize="xs" color="gray.500">Due: {payment.emiDueDate}</Text>
                </VStack>
              ) : (
                <Text color="gray.400">-</Text>
              )}
            </Td>
            <Td>
              <Badge colorScheme={getStatusColor(payment.status)}>
                {payment.status}
              </Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default AssociateAmount;