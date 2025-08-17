import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Paper
} from '@mui/material';
import {
  Security,
  Shield,
  Warning,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Refresh,
  MoreVert,
  Error,
  Assessment,
  Speed,
  Notifications,
  History
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

// Sample data for charts (in production, this would come from API)
const threatTrendData = [
  { name: 'Mon', threats: 12, blocked: 8 },
  { name: 'Tue', threats: 19, blocked: 15 },
  { name: 'Wed', threats: 8, blocked: 6 },
  { name: 'Thu', threats: 25, blocked: 20 },
  { name: 'Fri', threats: 15, blocked: 12 },
  { name: 'Sat', threats: 7, blocked: 5 },
  { name: 'Sun', threats: 10, blocked: 8 }
];

const vulnerabilityData = [
  { name: 'Critical', value: 3, color: '#EF4444' },
  { name: 'High', value: 8, color: '#F59E0B' },
  { name: 'Medium', value: 15, color: '#3B82F6' },
  { name: 'Low', value: 24, color: '#10B981' }
];

const complianceData = [
  { name: 'PCI-DSS', score: 92, color: '#10B981' },
  { name: 'GDPR', score: 88, color: '#3B82F6' },
  { name: 'SOC2', score: 95, color: '#8B5CF6' },
  { name: 'HIPAA', score: 85, color: '#F59E0B' }
];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connected, realTimeData } = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/overview');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data for demo
      setDashboardData({
        securityScore: 87,
        activeThreats: 3,
        vulnerabilities: 50,
        scansToday: 12,
        lastScanTime: new Date().toISOString(),
        systemStatus: 'operational'
      });
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon, color, suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            borderColor: color + '40'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: color + '20',
                color: color,
                width: 48,
                height: 48
              }}
            >
              {icon}
            </Avatar>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <MoreVert />
            </IconButton>
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            {value}{suffix}
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {title}
          </Typography>
          
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {change.trend === 'up' ? (
                <TrendingUp sx={{ color: change.positive ? '#10B981' : '#EF4444', mr: 0.5, fontSize: '1rem' }} />
              ) : (
                <TrendingDown sx={{ color: change.positive ? '#10B981' : '#EF4444', mr: 0.5, fontSize: '1rem' }} />
              )}
              <Typography
                variant="caption"
                sx={{ 
                  color: change.positive ? '#10B981' : '#EF4444',
                  fontWeight: 600
                }}
              >
                {change.value}% from yesterday
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const SecurityScoreCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(17, 17, 17, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 3,
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Security Score
            </Typography>
            <Tooltip title="Refresh Score">
              <IconButton onClick={fetchDashboardData} sx={{ color: 'primary.main' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <ResponsiveContainer width={160} height={160}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={[{ value: dashboardData?.securityScore || 87 }]}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="#8B5CF6"
                    background={{ fill: '#1a1a1a' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                  {dashboardData?.securityScore || 87}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  / 100
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ space: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Threat Protection
              </Typography>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                95%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={95} 
              sx={{ 
                mb: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' }
              }} 
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Vulnerability Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                78%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={78} 
              sx={{ 
                mb: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                '& .MuiLinearProgress-bar': { backgroundColor: '#F59E0B' }
              }} 
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Compliance Status
              </Typography>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                90%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={90} 
              sx={{ 
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' }
              }} 
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ThreatTrendsChart = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        sx={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Threat Activity (7 Days)
            </Typography>
            <Chip
              label="Real-time"
              size="small"
              color={connected ? 'success' : 'default'}
              sx={{ ml: 'auto' }}
            />
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="threats"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );

  const VulnerabilityBreakdown = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card
        sx={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
            Vulnerabilities by Severity
          </Typography>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 2 }}>
            {vulnerabilityData.map((item) => (
              <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    mr: 2
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const RecentAlerts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card
        sx={{
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Recent Security Alerts
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 'auto' }}
              endIcon={<History />}
            >
              View All
            </Button>
          </Box>

          <List>
            {[
              { severity: 'critical', title: 'Malware detected on endpoint DEV-001', time: '2 minutes ago', icon: <Error sx={{ color: '#EF4444' }} /> },
              { severity: 'high', title: 'Suspicious login from unknown location', time: '15 minutes ago', icon: <Warning sx={{ color: '#F59E0B' }} /> },
              { severity: 'medium', title: 'Vulnerability scan completed with findings', time: '1 hour ago', icon: <Security sx={{ color: '#3B82F6' }} /> },
              { severity: 'low', title: 'System backup completed successfully', time: '2 hours ago', icon: <CheckCircle sx={{ color: '#10B981' }} /> }
            ].map((alert, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {alert.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.title}
                    secondary={alert.time}
                    primaryTypographyProps={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary',
                      fontSize: '0.8rem'
                    }}
                  />
                </ListItem>
                {index < 3 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
          Loading Dashboard...
        </Typography>
        <LinearProgress sx={{ mb: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Shield sx={{ color: 'primary.main' }} />
            Security Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Real-time security monitoring and threat intelligence overview
          </Typography>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Threats"
            value={dashboardData?.activeThreats || 3}
            change={{ trend: 'down', value: 25, positive: true }}
            icon={<Warning />}
            color="#EF4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Vulnerabilities"
            value={dashboardData?.vulnerabilities || 50}
            change={{ trend: 'up', value: 12, positive: false }}
            icon={<Security />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Scans Today"
            value={dashboardData?.scansToday || 12}
            change={{ trend: 'up', value: 8, positive: true }}
            icon={<Assessment />}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Security Score"
            value={dashboardData?.securityScore || 87}
            change={{ trend: 'up', value: 5, positive: true }}
            icon={<Shield />}
            color="#8B5CF6"
            suffix="%"
          />
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <SecurityScoreCard />
        </Grid>
        <Grid item xs={12} md={8}>
          <ThreatTrendsChart />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <VulnerabilityBreakdown />
        </Grid>
        <Grid item xs={12} md={8}>
          <RecentAlerts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;