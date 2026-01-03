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
  SimpleGrid,
  Progress
} from '@chakra-ui/react';
import { Plus, DollarSign, TrendingUp, Download, History, Wallet } from 'lucide-react';

const AssociateCommission = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('withdraw');
  
  const [commissions, setCommissions] = useState([
    {
      id: 1,
      clientName: 'John Doe',
      project: 'SP Heights',
      unitNumber: 'A-501',
      saleAmount: 7500000,
      commissionRate: 2,
      commissionAmount: 150000,
      status: 'Earned',
      earnedDate: '2024-01-15',
      type: 'Sale Commission'
    },
    {
      id: 2,
      clientName: 'Jane Smith',
      project: 'SP Gardens',
      unitNumber: 'B-203',
      saleAmount: 5500000,
      commissionRate: 2,
      commissionAmount: 110000,
      status: 'Earned',
      earnedDate: '2024-01-10',
      type: 'Sale Commission'
    },
    {
      id: 3,
      clientName: 'Mike Johnson',
      project: 'SP Plaza',
      unitNumber: 'C-1001',
      saleAmount: 12000000,
      commissionRate: 2.5,
      commissionAmount: 300000,
      status: 'Earned',
      earnedDate: '2024-01-05',
      type: 'Premium Sale Commission'
    }
  ]);

  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      amount: 100000,
      date: '2024-01-20',
      status: 'Completed',
      method: 'Bank Transfer',
      reference: 'TXN123456789'
    },
    {
      id: 2,
      amount: 50000,
      date: '2024-01-18',
      status: 'Pending',
      method: 'Bank Transfer',
      reference: 'TXN123456788'
    }
  ]);

  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    accountDetails: '',
    notes: ''
  });

  // Calculate totals
  const totalEarned = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status === 'Completed').reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawal = withdrawals.filter(w => w.status === 'Pending').reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = totalEarned - totalWithdrawn - pendingWithdrawal;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Earned': 'green',
      'Pending': 'yellow',
      'Completed': 'green',
      'Failed': 'red'
    };
    return colors[status] || 'gray';
  };

  const handleWithdraw = () => {
    setModalType('withdraw');
    setFormData({
      amount: '',
      method: 'Bank Transfer',
      accountDetails: '',
      notes: ''
    });
    onOpen();
  };

  const handleSubmit = () => {
    if (modalType === 'withdraw') {
      const newWithdrawal = {
        id: withdrawals.length + 1,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        method: formData.method,
        reference: `TXN${Date.now()}`,
        notes: formData.notes
      };
      setWithdrawals([...withdrawals, newWithdrawal]);
    }
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
          <p className="text-gray-600 mt-2">Track your earnings and manage withdrawals</p>
        </div>
        <Button
          leftIcon={<Download className="w-4 h-4" />}
          colorScheme=""
          className='bg-gradient-to-r from-red-600 to-black text-white'
          onClick={handleWithdraw}
          isDisabled={availableBalance <= 0}
        >
          Request Withdrawal
        </Button>
      </div>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Box className="card">
          <Stat>
            <StatLabel>Total Earned</StatLabel>
            <StatNumber fontSize="2xl" color="green.500">
              {formatCurrency(totalEarned)}
            </StatNumber>
            <StatHelpText>
              <TrendingUp className="w-4 h-4 inline mr-1" />
              All time earnings
            </StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Total Withdrawn</StatLabel>
            <StatNumber fontSize="2xl" color="blue.500">
              {formatCurrency(totalWithdrawn)}
            </StatNumber>
            <StatHelpText>Successfully withdrawn</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Pending Withdrawal</StatLabel>
            <StatNumber fontSize="2xl" color="orange.500">
              {formatCurrency(pendingWithdrawal)}
            </StatNumber>
            <StatHelpText>Under processing</StatHelpText>
          </Stat>
        </Box>
        <Box className="card">
          <Stat>
            <StatLabel>Available Balance</StatLabel>
            <StatNumber fontSize="2xl" color="purple.500">
              {formatCurrency(availableBalance)}
            </StatNumber>
            <StatHelpText>Ready to withdraw</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Progress Bar */}
      <Box className="card">
        <VStack align="start" spacing={3}>
          <Text fontWeight="semibold">Commission Progress</Text>
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm">Withdrawn</Text>
              <Text fontSize="sm">{((totalWithdrawn / totalEarned) * 100).toFixed(1)}%</Text>
            </HStack>
            <Progress 
              value={(totalWithdrawn / totalEarned) * 100} 
              colorScheme="green" 
              size="lg" 
              borderRadius="md"
            />
          </Box>
        </VStack>
      </Box>

      <div className="card">
        <Tabs>
          <TabList>
            <Tab>Commission History ({commissions.length})</Tab>
            <Tab>Withdrawal History ({withdrawals.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <CommissionTable 
                commissions={commissions} 
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
              />
            </TabPanel>
            <TabPanel p={0}>
              <WithdrawalTable 
                withdrawals={withdrawals} 
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
          <ModalHeader>Request Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full" p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" color="blue.700">
                  Available Balance: <strong>{formatCurrency(availableBalance)}</strong>
                </Text>
              </Box>
              <FormControl isRequired>
                <FormLabel>Withdrawal Amount</FormLabel>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Enter amount to withdraw"
                  max={availableBalance}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Withdrawal Method</FormLabel>
                <Select
                  value={formData.method}
                  onChange={(e) => setFormData({...formData, method: e.target.value})}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Account Details</FormLabel>
                <Textarea
                  value={formData.accountDetails}
                  onChange={(e) => setFormData({...formData, accountDetails: e.target.value})}
                  placeholder="Enter bank account details or UPI ID"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes (optional)"
                />
              </FormControl>
              <HStack spacing={4} w="full" justify="end">
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                  colorScheme="" 
                  onClick={handleSubmit}
                      className='bg-gradient-to-r from-red-600 to-black text-white'
                  isDisabled={!formData.amount || parseFloat(formData.amount) > availableBalance}
                >
                  Request Withdrawal
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const CommissionTable = ({ commissions, formatCurrency, getStatusColor }) => (
  <Box overflowX="auto">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Client & Unit</Th>
          <Th>Project</Th>
          <Th>Sale Amount</Th>
          <Th>Commission Rate</Th>
          <Th>Commission Amount</Th>
          <Th>Date Earned</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {commissions.map((commission) => (
          <Tr key={commission.id}>
            <Td>
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">{commission.clientName}</Text>
                <Text fontSize="sm" color="gray.500">{commission.unitNumber}</Text>
              </VStack>
            </Td>
            <Td>{commission.project}</Td>
            <Td>{formatCurrency(commission.saleAmount)}</Td>
            <Td>{commission.commissionRate}%</Td>
            <Td>
              <Text fontWeight="medium" color="green.600">
                {formatCurrency(commission.commissionAmount)}
              </Text>
            </Td>
            <Td>{commission.earnedDate}</Td>
            <Td>
              <Badge colorScheme={getStatusColor(commission.status)}>
                {commission.status}
              </Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

const WithdrawalTable = ({ withdrawals, formatCurrency, getStatusColor }) => (
  <Box overflowX="auto">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Amount</Th>
          <Th>Date</Th>
          <Th>Method</Th>
          <Th>Reference</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {withdrawals.map((withdrawal) => (
          <Tr key={withdrawal.id}>
            <Td>
              <Text fontWeight="medium">{formatCurrency(withdrawal.amount)}</Text>
            </Td>
            <Td>{withdrawal.date}</Td>
            <Td>{withdrawal.method}</Td>
            <Td>
              <Text fontSize="sm" fontFamily="mono">{withdrawal.reference}</Text>
            </Td>
            <Td>
              <Badge colorScheme={getStatusColor(withdrawal.status)}>
                {withdrawal.status}
              </Badge>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default AssociateCommission;