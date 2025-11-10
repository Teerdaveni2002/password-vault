import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { PendingActions, CheckCircle, Cancel } from '@mui/icons-material';
import { usePasswordManager } from '../../hooks/usePasswordManager';
import Loading from '../common/Loading';
import RequestApproval from './RequestApproval';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard: React.FC = () => {
  const { requests, isLoading, fetchRequests } = usePasswordManager();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');

  if (isLoading && requests.length === 0) {
    return <Loading message="Loading admin dashboard..." />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab
              icon={
                <Badge badgeContent={pendingRequests.length} color="error">
                  <PendingActions />
                </Badge>
              }
              label="Pending Requests"
              iconPosition="start"
            />
            <Tab
              icon={
                <Badge badgeContent={approvedRequests.length} color="success">
                  <CheckCircle />
                </Badge>
              }
              label="Approved"
              iconPosition="start"
            />
            <Tab
              icon={
                <Badge badgeContent={rejectedRequests.length} color="default">
                  <Cancel />
                </Badge>
              }
              label="Rejected"
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {pendingRequests.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No pending requests
              </Typography>
            ) : (
              <RequestApproval requests={pendingRequests} />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {approvedRequests.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No approved requests
              </Typography>
            ) : (
              <RequestApproval requests={approvedRequests} readOnly />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {rejectedRequests.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No rejected requests
              </Typography>
            ) : (
              <RequestApproval requests={rejectedRequests} readOnly />
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
