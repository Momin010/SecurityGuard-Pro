import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    threats: [],
    scans: [],
    alerts: [],
    metrics: {}
  });
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to CyberGuard Pro server');
        setConnected(true);
        setSocket(newSocket);
        
        // Join user-specific room
        newSocket.emit('join-room', `user-${user.id}`);
        
        toast.success('Real-time monitoring activated', {
          position: 'bottom-right',
          autoClose: 3000
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
        
        toast.warning('Real-time monitoring disconnected', {
          position: 'bottom-right',
          autoClose: 3000
        });
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
        
        toast.error('Failed to connect to real-time monitoring', {
          position: 'bottom-right',
          autoClose: 5000
        });
      });

      // Real-time data event handlers
      newSocket.on('new-threat', (threat) => {
        setRealTimeData(prev => ({
          ...prev,
          threats: [threat, ...prev.threats.slice(0, 99)] // Keep last 100 threats
        }));
        
        if (threat.severity === 'CRITICAL') {
          toast.error(`Critical Threat Detected: ${threat.title}`, {
            position: 'top-center',
            autoClose: 10000
          });
        }
      });

      newSocket.on('scan-update', (scanData) => {
        setRealTimeData(prev => ({
          ...prev,
          scans: prev.scans.map(scan => 
            scan.scanId === scanData.scanId ? { ...scan, ...scanData } : scan
          )
        }));
        
        if (scanData.status === 'completed') {
          toast.info(`Scan completed: ${scanData.name || 'Unnamed scan'}`, {
            autoClose: 5000
          });
        }
      });

      newSocket.on('new-alert', (alert) => {
        setRealTimeData(prev => ({
          ...prev,
          alerts: [alert, ...prev.alerts.slice(0, 49)] // Keep last 50 alerts
        }));
        
        if (alert.priority === 'high') {
          toast.warning(`Security Alert: ${alert.title}`, {
            autoClose: 8000
          });
        }
      });

      newSocket.on('metrics-update', (metrics) => {
        setRealTimeData(prev => ({
          ...prev,
          metrics: { ...prev.metrics, ...metrics }
        }));
      });

      newSocket.on('vulnerability-found', (vulnerability) => {
        if (vulnerability.severity === 'CRITICAL') {
          toast.error(`Critical Vulnerability Found: ${vulnerability.title}`, {
            position: 'top-center',
            autoClose: 15000
          });
        } else if (vulnerability.severity === 'HIGH') {
          toast.warning(`High Severity Vulnerability: ${vulnerability.title}`, {
            autoClose: 10000
          });
        }
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [user, token]);

  // Socket utility functions
  const emitEvent = (eventName, data) => {
    if (socket && connected) {
      socket.emit(eventName, data);
    }
  };

  const joinRoom = (roomName) => {
    if (socket && connected) {
      socket.emit('join-room', roomName);
    }
  };

  const leaveRoom = (roomName) => {
    if (socket && connected) {
      socket.emit('leave-room', roomName);
    }
  };

  const subscribeToScanUpdates = (scanId) => {
    if (socket && connected) {
      socket.emit('subscribe-scan', scanId);
    }
  };

  const unsubscribeFromScanUpdates = (scanId) => {
    if (socket && connected) {
      socket.emit('unsubscribe-scan', scanId);
    }
  };

  const value = {
    socket,
    connected,
    realTimeData,
    emitEvent,
    joinRoom,
    leaveRoom,
    subscribeToScanUpdates,
    unsubscribeFromScanUpdates
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};