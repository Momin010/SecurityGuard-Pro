import React, { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
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

// Particle Burst Component
const ParticleBurst = ({ trigger, color = '#8B5CF6' }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        angle: Math.random() * 360,
        speed: Math.random() * 100 + 50,
        size: Math.random() * 6 + 2,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
    }
  }, [trigger]);

  return (
    <>
      <style>
        {`
          @keyframes particleExplode {
            0% { 
              transform: scale(1) translate(0, 0); 
              opacity: 1; 
            }
            100% { 
              transform: scale(0) translate(var(--tx), var(--ty)); 
              opacity: 0; 
            }
          }
        `}
      </style>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: color,
              borderRadius: '50%',
              animation: 'particleExplode 1.5s ease-out forwards',
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
              '--tx': `${Math.cos(particle.angle * Math.PI / 180) * particle.speed}px`,
              '--ty': `${Math.sin(particle.angle * Math.PI / 180) * particle.speed}px`,
            }}
          />
        ))}
      </Box>
    </>
  );
};

// Glitch Text Component
const GlitchText = ({ children, intensity = 'low' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchChance = intensity === 'high' ? 0.98 : intensity === 'medium' ? 0.96 : 0.99;
    const interval = setInterval(() => {
      if (Math.random() > glitchChance) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <>
      <style>
        {`
          .dashboard-glitch {
            position: relative;
            display: inline-block;
          }
          
          .dashboard-glitch.active::before,
          .dashboard-glitch.active::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          }
          
          .dashboard-glitch.active::before {
            animation: dashboardGlitch 0.2s infinite;
            color: #ff0040;
            z-index: -1;
          }
          
          .dashboard-glitch.active::after {
            animation: dashboardGlitch 0.2s infinite reverse;
            color: #00ffff;
            z-index: -2;
          }
          
          @keyframes dashboardGlitch {
            0% { transform: translate(0); }
            20% { transform: translate(-1px, 1px); }
            40% { transform: translate(-1px, -1px); }
            60% { transform: translate(1px, 1px); }
            80% { transform: translate(1px, -1px); }
            100% { transform: translate(0); }
          }
        `}
      </style>
      <span 
        className={`dashboard-glitch ${isGlitching ? 'active' : ''}`}
        data-text={children}
      >
        {children}
      </span>
    </>
  );
};

// Holographic Card Component
const HolographicCard = ({ children, ...props }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes holoScan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(300%); opacity: 0; }
          }
          
          @keyframes holoGlow {
            0%, 100% { 
              box-shadow: 0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1);
            }
            50% { 
              box-shadow: 0 0 50px rgba(139, 92, 246, 0.6), inset 0 0 50px rgba(139, 92, 246, 0.2);
            }
          }
        `}
      </style>
      <Card
        ref={cardRef}
        onMouseMove={handleMouseMove}
        sx={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(139, 92, 246, 0.2) 0%, 
              rgba(17, 17, 17, 0.9) 40%, 
              rgba(10, 10, 10, 0.95) 100%)
          `,
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          animation: 'holoGlow 4s ease-in-out infinite',
          '&:hover': {
            transform: 'translateY(-5px) rotateX(2deg)',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
            border: '2px solid rgba(139, 92, 246, 0.6)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
            animation: 'holoScan 3s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(139, 92, 246, 0.03) 1px,
                transparent 2px,
                transparent 4px
              )
            `,
            pointerEvents: 'none',
          }
        }}
        {...props}
      >
        {children}
      </Card>
    </>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [particlesTrigger, setParticlesTrigger] = useState(0);
  const { connected, realTimeData } = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/overview');
      setDashboardData(response.data);
      setParticlesTrigger(prev => prev + 1);
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
      setParticlesTrigger(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon, color, suffix = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCounter(prev => {
          if (prev < value) return prev + 1;
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }, [value]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        whileHover={{ 
          scale: 1.05, 
          rotateY: 5,
          transition: { type: "spring", stiffness: 300 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <HolographicCard>
          <CardContent sx={{ p: 3, position: 'relative' }}>
            <ParticleBurst trigger={isHovered} color={color} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 360] : 0,
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.8 }}
              >
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${color}40 0%, ${color}80 100%)`,
                    color: color,
                    width: 56,
                    height: 56,
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 30px ${color}40`,
                  }}
                >
                  {icon}
                </Avatar>
              </motion.div>
              <IconButton 
                size="small" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: color,
                    transform: 'rotate(90deg)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                color: 'white', 
                mb: 1,
                fontSize: '3rem',
                textShadow: `0 0 20px ${color}`,
                fontFamily: 'monospace'
              }}
            >
              <GlitchText intensity="medium">
                {counter}{suffix}
              </GlitchText>
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              <GlitchText>{title}</GlitchText>
            </Typography>
            
            {change && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <motion.div
                    animate={{
                      y: change.trend === 'up' ? [-2, 2, -2] : [2, -2, 2],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {change.trend === 'up' ? (
                      <TrendingUp sx={{ 
                        color: change.positive ? '#10B981' : '#EF4444', 
                        mr: 0.5, 
                        fontSize: '1.5rem',
                        filter: `drop-shadow(0 0 10px ${change.positive ? '#10B981' : '#EF4444'})` 
                      }} />
                    ) : (
                      <TrendingDown sx={{ 
                        color: change.positive ? '#10B981' : '#EF4444', 
                        mr: 0.5, 
                        fontSize: '1.5rem',
                        filter: `drop-shadow(0 0 10px ${change.positive ? '#10B981' : '#EF4444'})` 
                      }} />
                    )}
                  </motion.div>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: change.positive ? '#10B981' : '#EF4444',
                      fontWeight: 700,
                      fontSize: '1rem',
                      textShadow: `0 0 10px ${change.positive ? '#10B981' : '#EF4444'}`,
                    }}
                  >
                    <GlitchText>{change.value}% from yesterday</GlitchText>
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
        </HolographicCard>
      </motion.div>
    );
  };

  const SecurityScoreCard = () => {
    const [score, setScore] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setScore(prev => {
          if (prev < (dashboardData?.securityScore || 87)) return prev + 1;
          return prev;
        });
      }, 30);
      return () => clearInterval(interval);
    }, [dashboardData]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HolographicCard sx={{ height: '100%' }}>
          <CardContent sx={{ p: 4, height: '100%', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                  fontSize: '1.8rem'
                }}
              >
                <GlitchText intensity="medium">SECURITY SCORE</GlitchText>
              </Typography>
              <Tooltip title="Refresh Score">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconButton 
                    onClick={fetchDashboardData} 
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <ResponsiveContainer width={200} height={200}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    data={[{ value: score }]}
                    startAngle={90}
                    endAngle={450}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={20}
                      fill="url(#scoreGradient)"
                      background={{ fill: '#1a1a1a' }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
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
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        '0 0 20px #8B5CF6',
                        '0 0 40px #8B5CF6',
                        '0 0 20px #8B5CF6'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#8B5CF6',
                        fontSize: '4rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      <GlitchText intensity="high">{score}</GlitchText>
                    </Typography>
                  </motion.div>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem' }}>
                    / 100
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Security Metrics */}
            <Box sx={{ space: 2 }}>
              {[
                { label: 'Threat Protection', value: 95, color: '#10B981' },
                { label: 'Vulnerability Management', value: 78, color: '#F59E0B' },
                { label: 'Compliance Status', value: 90, color: '#10B981' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      <GlitchText>{metric.label}</GlitchText>
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: metric.color, 
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textShadow: `0 0 10px ${metric.color}`
                      }}
                    >
                      {metric.value}%
                    </Typography>
                  </Box>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1 + index * 0.2, duration: 1 }}
                  >
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.value} 
                      sx={{ 
                        mb: 3,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${metric.color}20`,
                        boxShadow: `0 0 20px ${metric.color}30`,
                        '& .MuiLinearProgress-bar': { 
                          background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}CC 100%)`,
                          borderRadius: 4,
                          boxShadow: `0 0 10px ${metric.color}`
                        }
                      }} 
                    />
                  </motion.div>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </HolographicCard>
      </motion.div>
    );
  };

  const ThreatTrendsChart = () => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <HolographicCard sx={{ height: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                fontSize: '1.8rem'
              }}
            >
              <GlitchText intensity="medium">THREAT ACTIVITY (7 DAYS)</GlitchText>
            </Typography>
            <motion.div
              animate={{
                scale: connected ? [1, 1.2, 1] : [1],
                boxShadow: connected 
                  ? ['0 0 20px #10B981', '0 0 40px #10B981', '0 0 20px #10B981']
                  : ['0 0 20px #F59E0B']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Chip
                label={<GlitchText>REAL-TIME</GlitchText>}
                size="medium"
                color={connected ? 'success' : 'warning'}
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textShadow: connected ? '0 0 10px #10B981' : '0 0 10px #F59E0B'
                }}
              />
            </motion.div>
          </Box>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={threatTrendData}>
              <defs>
                <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.3)" />
              <XAxis dataKey="name" stroke="#8B5CF6" fontSize={14} fontWeight={700} />
              <YAxis stroke="#8B5CF6" fontSize={14} fontWeight={700} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '2px solid #8B5CF6',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                }}
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stackId="1"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#blockedGradient)"
                filter="url(#glow)"
              />
              <Area
                type="monotone"
                dataKey="threats"
                stackId="2"
                stroke="#EF4444"
                strokeWidth={3}
                fill="url(#threatsGradient)"
                filter="url(#glow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </HolographicCard>
    </motion.div>
  );

  const VulnerabilityBreakdown = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <HolographicCard sx={{ height: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 4,
              textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              fontSize: '1.8rem'
            }}
          >
            <GlitchText intensity="medium">VULNERABILITIES BY SEVERITY</GlitchText>
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                filter="url(#pieGlow)"
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '2px solid #8B5CF6',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 3 }}>
            {vulnerabilityData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  background: `${item.color}10`,
                  border: `1px solid ${item.color}40`,
                  '&:hover': {
                    background: `${item.color}20`,
                    transform: 'translateX(10px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <motion.div
                    animate={{
                      boxShadow: [
                        `0 0 20px ${item.color}`,
                        `0 0 40px ${item.color}`,
                        `0 0 20px ${item.color}`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        mr: 3,
                        border: `2px solid ${item.color}`,
                      }}
                    />
                  </motion.div>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      flex: 1,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    <GlitchText>{item.name}</GlitchText>
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: item.color, 
                      fontWeight: 900,
                      fontSize: '1.4rem',
                      textShadow: `0 0 15px ${item.color}`,
                      fontFamily: 'monospace'
                    }}
                  >
                    <GlitchText intensity="medium">{item.value}</GlitchText>
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </HolographicCard>
    </motion.div>
  );

  const RecentAlerts = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <HolographicCard>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                fontSize: '1.8rem'
              }}
            >
              <GlitchText intensity="medium">RECENT SECURITY ALERTS</GlitchText>
            </Typography>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  border: '2px solid #8B5CF6',
                  color: '#8B5CF6',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                  }
                }}
                endIcon={<History />}
              >
                <GlitchText>VIEW ALL</GlitchText>
              </Button>
            </motion.div>
          </Box>

          <List>
            {[
              { severity: 'critical', title: 'Malware detected on endpoint DEV-001', time: '2 minutes ago', icon: <Error sx={{ color: '#EF4444' }} />, color: '#EF4444' },
              { severity: 'high', title: 'Suspicious login from unknown location', time: '15 minutes ago', icon: <Warning sx={{ color: '#F59E0B' }} />, color: '#F59E0B' },
              { severity: 'medium', title: 'Vulnerability scan completed with findings', time: '1 hour ago', icon: <Security sx={{ color: '#3B82F6' }} />, color: '#3B82F6' },
              { severity: 'low', title: 'System backup completed successfully', time: '2 hours ago', icon: <CheckCircle sx={{ color: '#10B981' }} />, color: '#10B981' }
            ].map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 10px 30px ${alert.color}30`
                }}
              >
                <ListItem 
                  sx={{ 
                    px: 3,
                    py: 2,
                    mb: 2,
                    borderRadius: 2,
                    background: `${alert.color}08`,
                    border: `1px solid ${alert.color}30`,
                    '&:hover': {
                      background: `${alert.color}15`,
                      border: `1px solid ${alert.color}60`,
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 50 }}>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {alert.icon}
                    </motion.div>
                  </ListItemIcon>
                  <ListItemText
                    primary={<GlitchText>{alert.title}</GlitchText>}
                    secondary={<GlitchText>{alert.time}</GlitchText>}
                    primaryTypographyProps={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                    secondaryTypographyProps={{
                      color: alert.color,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textShadow: `0 0 10px ${alert.color}`
                    }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </CardContent>
      </HolographicCard>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              mb: 4,
              textAlign: 'center',
              textShadow: '0 0 30px rgba(139, 92, 246, 0.8)'
            }}
          >
            <GlitchText intensity="high">LOADING SECURITY DASHBOARD...</GlitchText>
          </Typography>
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), transparent)',
                'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <LinearProgress 
              sx={{ 
                mb: 4,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
              }} 
            />
          </motion.div>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: 'white',
              mb: 2,
              fontSize: '4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textShadow: '0 0 40px rgba(139, 92, 246, 0.8)'
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <Shield sx={{ fontSize: '4rem', color: 'primary.main' }} />
            </motion.div>
            <GlitchText intensity="high">SECURITY DASHBOARD</GlitchText>
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(139, 92, 246, 0.8)',
              fontSize: '1.5rem',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            <GlitchText>Real-time security monitoring and threat intelligence overview</GlitchText>
          </Typography>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
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
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <SecurityScoreCard />
        </Grid>
        <Grid item xs={12} md={8}>
          <ThreatTrendsChart />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
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