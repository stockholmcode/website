import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const DateRangeSelector = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

const EarningsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const EarningsCard = styled.div<{ variant?: 'primary' | 'success' | 'warning' | 'info' }>`
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid ${props => {
    switch (props.variant) {
      case 'primary': return '#007bff';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const EarningsValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const EarningsLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const EarningsSubtext = styled.div`
  color: #999;
  font-size: 0.75rem;
`;

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 2px solid #ddd;
  position: relative;
`;

const ChartBar = styled.div<{ height: number; color?: string }>`
  background: ${props => props.color || '#007bff'};
  width: 100%;
  max-width: 60px;
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const ChartValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: #333;
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const PayoutSection = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PayoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PayoutTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const RequestPayoutButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const PayoutInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const PayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PayoutItem = styled.div`
  text-align: center;
`;

const PayoutItemValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
`;

const PayoutItemLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const TransactionHistory = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
`;

const TransactionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #28a745;
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionType = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const TransactionDate = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const TransactionAmount = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #28a745;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  thisWeek: number;
  availableForPayout: number;
  platformFeeRate: number;
  totalSessions: number;
  averageSessionPrice: number;
  monthlyData: {
    month: string;
    earnings: number;
  }[];
  recentTransactions: {
    id: string;
    type: 'session' | 'payout' | 'bonus';
    description: string;
    amount: number;
    date: string;
  }[];
}

interface TeacherEarningsProps {
  teacherId: string;
}

const TeacherEarnings: React.FC<TeacherEarningsProps> = ({ teacherId }) => {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [timeRange, setTimeRange] = useState('last6months');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const loadEarningsData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: EarningsData = {
          totalEarnings: 1580,
          thisMonth: 420,
          thisWeek: 135,
          availableForPayout: 285,
          platformFeeRate: 0.1, // 10% platform fee
          totalSessions: 35,
          averageSessionPrice: 50,
          monthlyData: [
            { month: 'Aug', earnings: 180 },
            { month: 'Sep', earnings: 320 },
            { month: 'Oct', earnings: 410 },
            { month: 'Nov', earnings: 390 },
            { month: 'Dec', earnings: 280 },
            { month: 'Jan', earnings: 420 }
          ],
          recentTransactions: [
            {
              id: '1',
              type: 'session',
              description: 'Guitar lesson with Alex Johnson',
              amount: 45,
              date: '2024-01-18T14:30:00'
            },
            {
              id: '2',
              type: 'session',
              description: 'Guitar lesson with Sarah Wilson',
              amount: 45,
              date: '2024-01-16T15:00:00'
            },
            {
              id: '3',
              type: 'payout',
              description: 'Weekly payout to bank account',
              amount: -240,
              date: '2024-01-15T10:00:00'
            },
            {
              id: '4',
              type: 'session',
              description: 'Guitar lesson with Mike Chen',
              amount: 45,
              date: '2024-01-12T11:00:00'
            },
            {
              id: '5',
              type: 'bonus',
              description: 'New teacher bonus',
              amount: 50,
              date: '2024-01-10T09:00:00'
            }
          ]
        };
        setEarningsData(mockData);
        setLoading(false);
      }, 800);
    };
    
    loadEarningsData();
  }, [teacherId, timeRange]);

  const handleRequestPayout = () => {
    alert('Payout request functionality would be implemented here. Funds would be transferred to your connected bank account.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const maxEarnings = earningsData ? Math.max(...earningsData.monthlyData.map(d => d.earnings)) : 0;

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div>💰 Loading your earnings data...</div>
        </LoadingState>
      </Container>
    );
  }

  if (!earningsData) {
    return (
      <Container>
        <div>Error loading earnings data</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Earnings & Analytics</Title>
        <DateRangeSelector>
          <label>Time Period:</label>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="lastyear">Last Year</option>
            <option value="alltime">All Time</option>
          </Select>
        </DateRangeSelector>
      </Header>

      <EarningsGrid>
        <EarningsCard variant="success">
          <EarningsValue>${earningsData.totalEarnings}</EarningsValue>
          <EarningsLabel>Total Earnings</EarningsLabel>
          <EarningsSubtext>From {earningsData.totalSessions} sessions</EarningsSubtext>
        </EarningsCard>
        
        <EarningsCard variant="primary">
          <EarningsValue>${earningsData.thisMonth}</EarningsValue>
          <EarningsLabel>This Month</EarningsLabel>
          <EarningsSubtext>↗️ +15% from last month</EarningsSubtext>
        </EarningsCard>
        
        <EarningsCard variant="info">
          <EarningsValue>${earningsData.thisWeek}</EarningsValue>
          <EarningsLabel>This Week</EarningsLabel>
          <EarningsSubtext>3 sessions completed</EarningsSubtext>
        </EarningsCard>
        
        <EarningsCard variant="warning">
          <EarningsValue>${earningsData.averageSessionPrice}</EarningsValue>
          <EarningsLabel>Avg. Session Price</EarningsLabel>
          <EarningsSubtext>Your hourly rate</EarningsSubtext>
        </EarningsCard>
      </EarningsGrid>

      <ChartContainer>
        <ChartTitle>Monthly Earnings Trend</ChartTitle>
        <SimpleChart>
          {earningsData.monthlyData.map((data, index) => (
            <ChartBar
              key={index}
              height={(data.earnings / maxEarnings) * 100}
              color={index === earningsData.monthlyData.length - 1 ? '#28a745' : '#007bff'}
            >
              <ChartValue>${data.earnings}</ChartValue>
            </ChartBar>
          ))}
        </SimpleChart>
        <ChartLabels>
          {earningsData.monthlyData.map((data, index) => (
            <div key={index}>{data.month}</div>
          ))}
        </ChartLabels>
      </ChartContainer>

      <PayoutSection>
        <PayoutHeader>
          <PayoutTitle>Payout Information</PayoutTitle>
          <RequestPayoutButton 
            onClick={handleRequestPayout}
            disabled={earningsData.availableForPayout < 50}
          >
            Request Payout
          </RequestPayoutButton>
        </PayoutHeader>
        
        <PayoutInfo>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
            💡 <strong>Payout Policy:</strong> Minimum payout amount is $50. Payouts are processed within 2-3 business days.
            Platform fee: {(earningsData.platformFeeRate * 100)}%
          </div>
        </PayoutInfo>

        <PayoutGrid>
          <PayoutItem>
            <PayoutItemValue>${earningsData.availableForPayout}</PayoutItemValue>
            <PayoutItemLabel>Available for Payout</PayoutItemLabel>
          </PayoutItem>
          <PayoutItem>
            <PayoutItemValue>${Math.round(earningsData.totalEarnings * earningsData.platformFeeRate)}</PayoutItemValue>
            <PayoutItemLabel>Platform Fees Paid</PayoutItemLabel>
          </PayoutItem>
          <PayoutItem>
            <PayoutItemValue>2-3</PayoutItemValue>
            <PayoutItemLabel>Business Days</PayoutItemLabel>
          </PayoutItem>
          <PayoutItem>
            <PayoutItemValue>$50</PayoutItemValue>
            <PayoutItemLabel>Minimum Payout</PayoutItemLabel>
          </PayoutItem>
        </PayoutGrid>
      </PayoutSection>

      <TransactionHistory>
        <TransactionTitle>Recent Transactions</TransactionTitle>
        <TransactionList>
          {earningsData.recentTransactions.map(transaction => (
            <TransactionItem key={transaction.id}>
              <TransactionInfo>
                <TransactionType>
                  {transaction.type === 'session' && '💰'} 
                  {transaction.type === 'payout' && '🏦'} 
                  {transaction.type === 'bonus' && '🎉'} 
                  {' '}
                  {transaction.description}
                </TransactionType>
                <TransactionDate>{formatDate(transaction.date)}</TransactionDate>
              </TransactionInfo>
              <TransactionAmount style={{
                color: transaction.amount > 0 ? '#28a745' : '#dc3545'
              }}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
              </TransactionAmount>
            </TransactionItem>
          ))}
        </TransactionList>
      </TransactionHistory>
    </Container>
  );
};

export default TeacherEarnings;